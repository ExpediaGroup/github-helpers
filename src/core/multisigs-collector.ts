/*
Copyright 2022 Aurora Labs
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {
  Entity,
  isApiEntity,
  isResourceEntity,
  stringifyEntityRef,
  RELATION_OWNED_BY,
  RELATION_API_CONSUMED_BY,
  RELATION_HAS_PART,
  parseEntityRef
} from '@backstage/catalog-model';

type MultisigSigner = {
  signer: Entity;
  owner?: Entity;
};
type MultisigSignerAndKeysComposed = MultisigSigner & { keys: Entity[] };
type MultisigSignerAndKeys = {
  [K in keyof MultisigSignerAndKeysComposed]: MultisigSignerAndKeysComposed[K];
};

type MultisigInfo = {
  entity: Entity;
  signers: MultisigSigner[];
};

type ComponentMultisigs = {
  title: string;
  component: Entity;
  multisigs: MultisigInfo[];
};

type SystemComponents = {
  title: string;
  system: Entity;
  components: ComponentMultisigs[];
};

export class MultisigsCollector {
  systemComponents: SystemComponents[] = [];
  private entities: Entity[] = [];
  private apiEntities: Entity[] = [];
  private resourceEntities: Entity[] = [];
  private multisigs: Entity[] = [];
  private contracts: Entity[] = [];
  private accessKeys: Entity[] = [];

  constructor(entities: Entity[]) {
    this.entities = entities;
    this.apiEntities = this.entities.filter(isApiEntity);
    this.resourceEntities = this.entities.filter(isResourceEntity);
    this.multisigs = this.apiEntities.filter(item => item.spec?.type === 'multisig-deployment');
    this.contracts = this.apiEntities.filter(item => item.spec?.type === 'contract-deployment');
    this.accessKeys = this.resourceEntities.filter(item => item.spec?.type === 'access-key');
    this.systemComponents = this.collectSystems();
  }

  normalizeEntities(list: string[]) {
    return [...new Set(list)].sort((a, b) => a.localeCompare(b));
  }

  collectSystems() {
    const systemRefs = this.normalizeEntities(this.multisigs.map(item => item.spec!.system! as string));
    return systemRefs
      .map(systemRef => {
        const system = this.entities.find(item => stringifyEntityRef(item) === systemRef)!;
        const components = this.collectComponents(system);

        return {
          title: system.metadata.title || system.metadata.name,
          system,
          components
        };
      })
      .sort((a, b) => a.system.metadata.name.localeCompare(b.system.metadata.name));
  }

  collectComponents(system: Entity) {
    const componentRefs = system.relations!.filter(r => r.type === RELATION_HAS_PART && parseEntityRef(r.targetRef).kind === 'component');
    return componentRefs
      .map(componentRef => {
        const component = this.entities.find(item => stringifyEntityRef(item) === componentRef.targetRef)!;
        return {
          title: component.metadata.title || component.metadata.name,
          component,
          multisigs: this.multisigs
            .filter(item => item.relations!.some(r => r.type === 'apiProvidedBy' && r.targetRef === componentRef.targetRef))
            .map(ms => ({
              entity: ms,
              signers: this.collectSigners(ms)
            }))
        };
      })
      .sort((a, b) => a.component.metadata.name.localeCompare(b.component.metadata.name));
  }

  collectSigners(multisig: Entity) {
    return multisig
      .relations!.filter(r => r.type === RELATION_OWNED_BY && parseEntityRef(r.targetRef).kind !== 'group')
      .map(r => {
        const signer = this.entities.find(e => stringifyEntityRef(e) === r.targetRef)!;
        const owner = this.entities.find(e => stringifyEntityRef(e) === signer.spec!.owner)!;
        return {
          signer,
          owner
        };
      })
      .sort((a, b) => a.owner.metadata.name.localeCompare(b.owner.metadata.name));
  }

  getAllApis() {
    return this.apiEntities;
  }

  getAllResources() {
    return this.resourceEntities;
  }

  getMultisigs() {
    return this.systemComponents.flatMap(system => system.components.flatMap(component => component.multisigs));
  }

  getNearContracts() {
    return this.contracts.filter(entity => entity.spec?.network === 'near');
  }

  getSigners() {
    const allSigners = this.getMultisigs().flatMap(ms => ms.signers);
    const uniqueSigners = allSigners.reduce<{ [uid: string]: MultisigSigner }>((acc, signer) => {
      const uid = signer.signer.metadata.uid;
      if (uid && uid in allSigners) {
        return acc;
      }
      if (!this.isQualifiedEntity(signer.signer)) {
        return acc;
      }
      return { ...acc, [uid as string]: signer };
    }, {});
    return Object.values(uniqueSigners);
  }

  getMultisigAccessKeys(): Entity[] {
    const signers = this.getSigners().filter(value => value.signer.spec?.network === 'near');
    const keys = signers.flatMap(value => {
      if (!value.signer.relations) {
        return [];
      }
      return value.signer.relations
        .filter(r => r.type === RELATION_API_CONSUMED_BY && parseEntityRef(r.targetRef).kind === 'resource')
        .map(relation => {
          const key = this.entities.find(e => stringifyEntityRef(e) === relation.targetRef);
          return key;
        });
    });

    return keys.filter<Entity>(this.isEntity).filter(this.isQualifiedEntity);
  }

  getAccessKeysPerSigner() {
    const signers = this.getSigners().filter(value => value.signer.spec?.network === 'near');
    const keysPerSigner = signers.reduce<{ [s: string]: MultisigSignerAndKeys }>((acc, value) => {
      if (!value.signer.relations) {
        return acc;
      }
      const spec = JSON.parse(JSON.stringify(value.signer.spec));
      const signer: string = spec.address;
      const keys = value.signer.relations
        .filter(r => r.type === RELATION_API_CONSUMED_BY && parseEntityRef(r.targetRef).kind === 'resource')
        .map(relation => {
          const key = this.entities.find(e => stringifyEntityRef(e) === relation.targetRef);
          return key;
        })
        .filter<Entity>(this.isEntity);

      return {
        ...acc,
        [signer]: {
          owner: value.owner,
          signer: value.signer,
          keys
        }
      };
    }, {});

    return keysPerSigner;
  }

  getContractAccessKeys(): Entity[] {
    const keys = this.contracts.flatMap(value => {
      if (!value.relations) {
        return [];
      }
      return value.relations
        .filter(r => r.type === RELATION_API_CONSUMED_BY && parseEntityRef(r.targetRef).kind === 'resource')
        .map(relation => {
          const key = this.entities.find(e => stringifyEntityRef(e) === relation.targetRef);
          return key;
        });
    });
    return keys.filter<Entity>(this.isEntity);
  }

  getAllAccessKeys(): Entity[] {
    return this.accessKeys;
  }

  getDeprecatedAccessKeys(): Entity[] {
    const keys = this.getAllAccessKeys();
    const deprecated = keys.filter(entity => entity.metadata.tags?.includes('deprecated'));
    return deprecated;
  }

  getUnknownAccessKeys(): Entity[] {
    const keys = this.getAllAccessKeys();
    const unknown = keys.filter(entity => entity.metadata.tags?.includes('unknown'));
    return unknown;
  }

  private isQualifiedEntity(entity: Entity) {
    return !entity.metadata.tags?.includes('retired') && !entity.metadata.tags?.includes('allow-unknown');
  }

  private isEntity(entity: Entity | undefined): entity is Entity {
    return entity !== undefined;
  }
}
