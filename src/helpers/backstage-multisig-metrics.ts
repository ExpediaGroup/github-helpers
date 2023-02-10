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
import { client, v2 } from '@datadog/datadog-api-client';

import { MultisigsCollector } from '../core/multisigs-collector';
import { getBackstageEntities } from '../utils/get-backstage-entities';

type MultisigMetricsParams = {
  backstage_url?: string;
};

const configuration = client.createConfiguration();
const apiInstance = new v2.MetricsApi(configuration);

export const submitMultisigMetrics = async ({ backstage_url }: MultisigMetricsParams) => {
  const entities = await getBackstageEntities({ backstage_url });

  const multisigsCollector = new MultisigsCollector(entities);
  const result = multisigsCollector.getMultisigs().map(ms => {
    const { kind, metadata } = ms.entity;
    const { name, uid, etag } = metadata;
    const titleParts = ms.entity.metadata.name?.split('-');
    const [network, type] = titleParts;
    // core.info(`${name} ${kind} ${network} ${type}`);
    return {
      name,
      uid,
      etag,
      network,
      type,
      kind,
      spec: JSON.parse(JSON.stringify(ms.entity.spec))
    };
  });

  const points = result.map(multisig => {
    const timestamp = Math.round(new Date(multisig.spec.multisig.fetchDate).getTime() / 1000);
    if (multisig.network === 'near') {
      if (parseFloat(multisig.spec.multisig.version) >= 3.0) {
        return { timestamp, value: 1 };
      }
    } else {
      if (parseFloat(multisig.spec.multisig.version) >= 1.2) {
        return { timestamp, value: 1 };
      }
    }
    return {
      timestamp,
      value: 0
    };
  });
  const resources = [
    {
      type: 'host',
      name: backstage_url?.split('@')[1]
    },
    ...result.map(multisig => ({ name: multisig.name, type: multisig.kind }))
  ];
  const params: v2.MetricsApiSubmitMetricsRequest = {
    body: {
      series: [
        {
          metric: 'backstage.multisigs.versions',
          type: 0,
          points,
          resources
        }
      ]
    }
  };
  // core.info(JSON.stringify(params));

  try {
    const data = await apiInstance.submitMetrics(params);
    core.info(`API called successfully. Returned data: ${JSON.stringify(data)}`);
    return data;
  } catch (error: unknown) {
    core.error(error as Error);
    return;
  }
};
