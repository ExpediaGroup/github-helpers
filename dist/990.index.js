"use strict";
exports.id = 990;
exports.ids = [990];
exports.modules = {

/***/ 6990:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "collectMultisigs": () => (/* binding */ collectMultisigs)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3977);
/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs_promises__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4094);
/* harmony import */ var _utils_get_backstage_entities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1027);
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



//import YAML from 'yaml';

class MultisigsCollector {
    constructor(entities) {
        this.systemComponents = [];
        this.entities = [];
        this.multisigs = [];
        this.entities = entities;
        this.multisigs = this.entities.filter(item => { var _a; return item.kind === 'API' && ((_a = item === null || item === void 0 ? void 0 : item.spec) === null || _a === void 0 ? void 0 : _a.type) === 'multisig-deployment'; });
        this.systemComponents = this.collectSystems();
    }
    normalizeEntities(list) {
        return [...new Set(list)].sort((a, b) => a.localeCompare(b));
    }
    collectSystems() {
        const systemRefs = this.normalizeEntities(this.multisigs.map(item => item.spec.system));
        return systemRefs
            .map(systemRef => {
            const system = this.entities.find(item => (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.stringifyEntityRef)(item) === systemRef);
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
        const componentRefs = (system.relations || []).filter(r => r.type === _backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.RELATION_HAS_PART && (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.parseEntityRef)(r.targetRef).kind === 'component');
        return componentRefs
            .map(componentRef => {
            const component = this.entities.find(item => (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.stringifyEntityRef)(item) === componentRef.targetRef);
            return {
                title: component.metadata.title || component.metadata.name,
                component,
                multisigs: this.multisigs
                    .filter(item => (item.relations || []).some(r => r.type === 'apiProvidedBy' && r.targetRef === componentRef.targetRef))
                    .map(ms => ({
                    entity: ms,
                    signers: this.collectSigners(ms)
                }))
            };
        })
            .sort((a, b) => a.component.metadata.name.localeCompare(b.component.metadata.name));
    }
    collectSigners(multisig) {
        return (multisig.relations || [])
            .filter(r => r.type === _backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.RELATION_OWNED_BY && (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.parseEntityRef)(r.targetRef).kind !== 'group')
            .map(r => {
            const signer = this.entities.find(e => (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.stringifyEntityRef)(e) === r.targetRef);
            const owner = this.entities.find(e => (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.stringifyEntityRef)(e) === signer.spec.owner);
            return {
                signer,
                owner
            };
        })
            .sort((a, b) => a.owner.metadata.name.localeCompare(b.owner.metadata.name));
    }
}
const collectMultisigs = ({ backstage_url, output_path }) => __awaiter(void 0, void 0, void 0, function* () {
    const entities = yield (0,_utils_get_backstage_entities__WEBPACK_IMPORTED_MODULE_3__/* .getBackstageEntities */ .g)({ backstage_url });
    const multisigsCollector = new MultisigsCollector(entities);
    const result = multisigsCollector.systemComponents.flatMap(system => system.components.flatMap(component => component.multisigs.map(ms => {
        var _a, _b;
        return {
            name: ms.entity.metadata.name,
            network: (_a = ms.entity.metadata.name) === null || _a === void 0 ? void 0 : _a.split('-')[0],
            spec: (_b = ms.entity.spec) === null || _b === void 0 ? void 0 : _b.multisig
        };
    })));
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Writing ${output_path}`);
    const jsonData = JSON.stringify(result);
    yield node_fs_promises__WEBPACK_IMPORTED_MODULE_1___default().writeFile(output_path || '', jsonData);
    return true;
});


/***/ }),

/***/ 1027:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "g": () => (/* binding */ getBackstageEntities)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _backstage_catalog_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8988);
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