"use strict";
exports.id = 990;
exports.ids = [990];
exports.modules = {

/***/ 80885:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "d": () => (/* binding */ MultisigsCollector)
/* harmony export */ });
/* harmony import */ var _backstage_catalog_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4094);
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

class MultisigsCollector {
    constructor(entities) {
        this.systemComponents = [];
        this.entities = [];
        this.multisigs = [];
        this.entities = entities;
        this.multisigs = this.entities.filter(item => (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_0__.isApiEntity)(item) && item.spec.type === 'multisig-deployment');
        this.systemComponents = this.collectSystems();
    }
    normalizeEntities(list) {
        return [...new Set(list)].sort((a, b) => a.localeCompare(b));
    }
    collectSystems() {
        const systemRefs = this.normalizeEntities(this.multisigs.map(item => item.spec.system));
        return systemRefs
            .map(systemRef => {
            const system = this.entities.find(item => (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_0__.stringifyEntityRef)(item) === systemRef);
            const components = this.collectComponents(system);
            return {
                title: system.metadata.title || system.metadata.name,
                system,
                components
            };
        })
            .sort((a, b) => a.system.metadata.name.localeCompare(b.system.metadata.name));
    }
    collectComponents(system) {
        const componentRefs = system.relations.filter(r => r.type === _backstage_catalog_model__WEBPACK_IMPORTED_MODULE_0__.RELATION_HAS_PART && (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_0__.parseEntityRef)(r.targetRef).kind === 'component');
        return componentRefs
            .map(componentRef => {
            const component = this.entities.find(item => (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_0__.stringifyEntityRef)(item) === componentRef.targetRef);
            return {
                title: component.metadata.title || component.metadata.name,
                component,
                multisigs: this.multisigs
                    .filter(item => item.relations.some(r => r.type === 'apiProvidedBy' && r.targetRef === componentRef.targetRef))
                    .map(ms => ({
                    entity: ms,
                    signers: this.collectSigners(ms)
                }))
            };
        })
            .sort((a, b) => a.component.metadata.name.localeCompare(b.component.metadata.name));
    }
    collectSigners(multisig) {
        return multisig
            .relations.filter(r => r.type === _backstage_catalog_model__WEBPACK_IMPORTED_MODULE_0__.RELATION_OWNED_BY && (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_0__.parseEntityRef)(r.targetRef).kind !== 'group')
            .map(r => {
            const signer = this.entities.find(e => (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_0__.stringifyEntityRef)(e) === r.targetRef);
            const owner = this.entities.find(e => (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_0__.stringifyEntityRef)(e) === signer.spec.owner);
            return {
                signer,
                owner
            };
        })
            .sort((a, b) => a.owner.metadata.name.localeCompare(b.owner.metadata.name));
    }
    getMultisigs() {
        return this.systemComponents.flatMap(system => system.components.flatMap(component => component.multisigs));
    }
}


/***/ }),

/***/ 86990:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "backstageMultisigMetrics": () => (/* binding */ backstageMultisigMetrics)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _datadog_datadog_api_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53128);
/* harmony import */ var _datadog_datadog_api_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_datadog_datadog_api_client__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_multisigs_collector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(80885);
/* harmony import */ var _utils_get_backstage_entities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(81027);
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




const configuration = _datadog_datadog_api_client__WEBPACK_IMPORTED_MODULE_1__.client.createConfiguration();
_datadog_datadog_api_client__WEBPACK_IMPORTED_MODULE_1__.client.setServerVariables(configuration, {
    site: 'datadoghq.eu'
});
const apiInstance = new _datadog_datadog_api_client__WEBPACK_IMPORTED_MODULE_1__.v2.MetricsApi(configuration);
const backstageMultisigMetrics = ({ backstage_url }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!backstage_url)
        return;
    const entities = yield (0,_utils_get_backstage_entities__WEBPACK_IMPORTED_MODULE_3__/* .getBackstageEntities */ .g)({ backstage_url });
    const multisigsCollector = new _core_multisigs_collector__WEBPACK_IMPORTED_MODULE_2__/* .MultisigsCollector */ .d(entities);
    const series = multisigsCollector.getMultisigs().map(ms => {
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
    const params = {
        body: {
            series
        }
    };
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Data uploaded: ${JSON.stringify(params)}`);
    try {
        const data = yield apiInstance.submitMetrics(params);
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`API called successfully. Returned data: ${JSON.stringify(data)}`);
        return data;
    }
    catch (error) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.error(error);
        return;
    }
});


/***/ }),

/***/ 81027:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "g": () => (/* binding */ getBackstageEntities)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _backstage_catalog_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(78988);
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const getBackstageEntities = ({ backstage_url }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!backstage_url) {
        throw new Error('BACKSTAGE_URL is required, make sure to set the secret');
    }
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('Connecting to Backstage to fetch available entities');
    const discoveryApi = {
        getBaseUrl() {
            return __awaiter(this, void 0, void 0, function* () {
                return `${backstage_url}/api/catalog`;
            });
        }
    };
    const catalogClient = new _backstage_catalog_client__WEBPACK_IMPORTED_MODULE_1__/* .CatalogClient */ .MS({
        discoveryApi
    });
    const entities = yield catalogClient.getEntities({});
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Total backstage entities: ${entities.items.length}`);
    return entities.items;
});


/***/ })

};
;
//# sourceMappingURL=990.index.js.map