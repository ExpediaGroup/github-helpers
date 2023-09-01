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

import { JsonObject } from '@backstage/types';
import { Entity } from '@backstage/catalog-model';

function pick<T extends {}, K extends keyof T>(obj: T, whitelist: K[]): Pick<T, K> {
  return whitelist.reduce((newObj, key) => {
    if (key in obj) {
      // eslint-disable-next-line functional/immutable-data
      newObj[key] = obj[key];
    }
    return newObj;
  }, {} as Pick<T, K>);
}

const ALLOWED_KINDS = ['Component', 'System'];
const ALLOWED_SPEC_FIELDS = ['type', 'deployedAt'];
const ALLOWED_METADATA_FIELDS = ['uid', 'namespace', 'name', 'title', 'annotations', 'tags'];

export class FilteredCollector {
  entities: Entity[];
  private srcEntities: Entity[];

  constructor(entities: Entity[]) {
    this.srcEntities = entities;
    this.entities = this.filterEntities();
  }

  normalizeEntities(list: string[]) {
    return [...new Set(list)].sort((a, b) => a.localeCompare(b));
  }

  filterSpec(spec?: JsonObject) {
    if (!spec) return {};
    return pick(spec, ALLOWED_SPEC_FIELDS);
  }

  filterMetadata(metadata: JsonObject) {
    return pick(metadata, ALLOWED_METADATA_FIELDS);
  }

  filterEntities() {
    return this.srcEntities
      .filter(e => ALLOWED_KINDS.includes(e.kind))
      .map(e => {
        return {
          apiVersion: e.apiVersion,
          kind: e.kind,
          metadata: this.filterMetadata(e.metadata),
          spec: this.filterSpec(e.spec)
        } as Entity;
      });
  }
}
