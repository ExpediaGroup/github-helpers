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

import * as core from '@actions/core';
import * as glob from 'glob';
import { HelperInputs } from '../types/generated';
import { Entity, stringifyEntityRef, RELATION_OWNED_BY, RELATION_HAS_PART, parseEntityRef } from '@backstage/catalog-model';
import * as fs from 'fs';
//import YAML from 'yaml';
import { simpleGit } from 'simple-git';
import handlebars from 'handlebars';
import { getBackstageEntities } from '../utils/get-backstage-entities';

type MultisigSigner = {
  signer: Entity;
  owner?: Entity;
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

class MultisigsCollector {
  systemComponents: SystemComponents[] = [];
  private entities: Entity[] = [];
  private multisigs: Entity[] = [];

  constructor(entities: Entity[]) {
    this.entities = entities;
    this.multisigs = this.entities.filter(item => item.kind === 'API' && item?.spec?.type === 'multisig-deployment');
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
}

export class BackstageExport extends HelperInputs {
  backstage_url?: string;
  template_path?: string;
  output_path?: string;
  testing?: boolean;
}

function reexportTemplate(inputs: BackstageExport & { templatePath: string; templateData: {} }) {
  const outputPath = inputs.output_path! + inputs.templatePath.replace(inputs.template_path!, '').replace('.hbs', '');

  const compiledTemplate = handlebars.compile(fs.readFileSync(inputs.templatePath, { encoding: 'utf8' }), {
    strict: true
  });

  const options = {
    helpers: {
      backstageLink: (entity: Entity) => {
        if (!entity) return 'undefined';
        const md = entity.metadata;
        return `${inputs.backstage_url}/catalog/${md.namespace}/${entity.kind}/${md.name}`;
      }
    }
  };

  const compiledContent = compiledTemplate(inputs.templateData, options);

  const existingContent =
    fs.existsSync(outputPath) &&
    fs.readFileSync(outputPath, {
      encoding: 'utf-8'
    });
  if (compiledContent !== existingContent) {
    core.info(`Writing ${outputPath}: changed content`);
    fs.writeFileSync(outputPath, compiledContent);
    return true;
  }
  return false;
}

async function commitAndPushChanges(output_path: string) {
  const git = simpleGit('.');
  await git.addConfig('user.email', 'security@aurora.dev');
  await git.addConfig('user.name', 'Backstage Exporter');
  await git.add(output_path);
  const msg = 'chore(backstage): 🥷🏽 automatic re-export';
  await git.commit(msg, undefined);
  await git.push();
  core.info('Updated and pushed the changes');
  return true;
}

export const backstageExport = async ({ backstage_url, template_path, output_path, testing }: BackstageExport) => {
  if (!template_path || !output_path) {
    throw new Error('set template_path and output_path for handlebars templating');
  }

  const entities = await getBackstageEntities({ backstage_url });

  const multisigsCollector = new MultisigsCollector(entities);

  // console.log(JSON.stringify(multisigsCollector.systemComponents[0], null, 2));
  const changedFiles = glob.sync(`${template_path}**/*.hbs`).reduce((acc, templatePath) => {
    const templateData = {
      multisigSystemComponents: multisigsCollector.systemComponents,
      testing
    };

    if (reexportTemplate({ backstage_url, output_path, template_path, templatePath, templateData })) {
      return [templatePath, ...acc];
    }

    return acc;
  }, [] as string[]);

  if (testing) {
    core.info(`Testing mode: ${changedFiles.length} changed files, exiting`);
    return true;
  }

  if (changedFiles.length === 0) {
    core.info('No changed files, nothing to commit');
    return false;
  }

  await commitAndPushChanges(output_path);
};
