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
import { MetricSeries } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2';

import { MultisigsCollector } from '../core/multisigs-collector';
import { getBackstageEntities } from '../utils/get-backstage-entities';

type MultisigMetricsParams = {
  backstage_url?: string;
};

const configuration = client.createConfiguration();
client.setServerVariables(configuration, {
  site: 'datadoghq.eu'
});
const apiInstance = new v2.MetricsApi(configuration);

export const backstageMultisigMetrics = async ({ backstage_url }: MultisigMetricsParams) => {
  if (!backstage_url) return;
  const entities = await getBackstageEntities({ backstage_url });

  const multisigsCollector = new MultisigsCollector(entities);
  const series: MetricSeries[] = multisigsCollector.getMultisigs().map(ms => {
    // entities are typically emitted as API kind,
    // tracking for inconsistencies
    const { kind, metadata } = ms.entity;
    const { name } = metadata;

    // inferred type is JsonObject, this converts to any
    const spec = JSON.parse(JSON.stringify(ms.entity.spec));
    const { address, network, networkType, system: rawSystem, owner: rawOwner } = spec;
    const system = rawSystem.split(':')[1];
    const owner = rawOwner.split(':')[1];
    const timestamp = Math.round(new Date(spec.multisig.fetchDate).getTime() / 1000);

    // this tags timeseries with distinguishing
    // properties for filtering purposes
    const resources = [
      {
        type: 'host',
        name: backstage_url.split('@')[1]
      },
      { type: 'api', name },
      { type: 'kind', name: kind },
      { type: 'network', name: network },
      { type: 'networkType', name: networkType },
      { type: 'system', name: system },
      { type: 'owner', name: owner }
    ];

    const version = spec.multisig.version;
    // datadog requires point value to be scalar
    const value = parseFloat(version);
    const points = [{ timestamp, value }];
    return {
      metric: `backstage.multisigs.${address}.version`,
      type: 0,
      points,
      resources
    };
  });

  const params: v2.MetricsApiSubmitMetricsRequest = {
    body: {
      series
    }
  };
  core.info(`Data uploaded: ${JSON.stringify(params)}`);

  try {
    const data = await apiInstance.submitMetrics(params);
    core.info(`API called successfully. Returned data: ${JSON.stringify(data)}`);
    return data;
  } catch (error: unknown) {
    core.error(error as Error);
    return;
  }
};
