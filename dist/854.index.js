"use strict";
exports.id = 854;
exports.ids = [854];
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

/***/ 23854:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "BackstageExport": () => (/* binding */ BackstageExport),
  "backstageExport": () => (/* binding */ backstageExport)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __webpack_require__(42186);
// EXTERNAL MODULE: ./node_modules/glob/glob.js
var glob = __webpack_require__(91957);
// EXTERNAL MODULE: ./src/types/generated.ts
var generated = __webpack_require__(33476);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(57147);
// EXTERNAL MODULE: ./node_modules/simple-git/dist/esm/index.js
var esm = __webpack_require__(92628);
// EXTERNAL MODULE: ./node_modules/handlebars/lib/index.js
var lib = __webpack_require__(97492);
var lib_default = /*#__PURE__*/__webpack_require__.n(lib);
// EXTERNAL MODULE: ./src/core/multisigs-collector.ts
var multisigs_collector = __webpack_require__(80885);
// EXTERNAL MODULE: ./src/utils/get-backstage-entities.ts
var get_backstage_entities = __webpack_require__(81027);
;// CONCATENATED MODULE: ./src/core/filtered-collector.ts
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
function pick(obj, whitelist) {
    return whitelist.reduce((newObj, key) => {
        if (key in obj) {
            // eslint-disable-next-line functional/immutable-data
            newObj[key] = obj[key];
        }
        return newObj;
    }, {});
}
const ALLOWED_KINDS = ['Component', 'System'];
const ALLOWED_SPEC_FIELDS = ['type'];
const ALLOWED_METADATA_FIELDS = ['uid', 'namespace', 'name', 'title', 'annotations', 'tags'];
class FilteredCollector {
    constructor(entities) {
        this.srcEntities = entities;
        this.entities = this.filterEntities();
    }
    normalizeEntities(list) {
        return [...new Set(list)].sort((a, b) => a.localeCompare(b));
    }
    filterSpec(spec) {
        if (!spec)
            return {};
        return pick(spec, ALLOWED_SPEC_FIELDS);
    }
    filterMetadata(metadata) {
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
            };
        });
    }
}

;// CONCATENATED MODULE: ./src/helpers/backstage-export.ts
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





class BackstageExport extends generated/* HelperInputs */.s {
}
function reexportTemplate(inputs) {
    const outputPath = inputs.output_path + inputs.templatePath.replace(inputs.template_path, '').replace('.hbs', '');
    const compiledTemplate = lib_default().compile(external_fs_.readFileSync(inputs.templatePath, { encoding: 'utf8' }), {
        strict: true
    });
    const options = {
        helpers: {
            backstageLink: (entity) => {
                if (!entity)
                    return 'undefined';
                const md = entity.metadata;
                return `${inputs.backstage_url}/catalog/${md.namespace}/${entity.kind}/${md.name}`;
            }
        }
    };
    const compiledContent = compiledTemplate(inputs.templateData, options);
    const existingContent = external_fs_.existsSync(outputPath) &&
        external_fs_.readFileSync(outputPath, {
            encoding: 'utf-8'
        });
    if (compiledContent !== existingContent) {
        core.info(`Writing ${outputPath}: changed content`);
        external_fs_.writeFileSync(outputPath, compiledContent);
        return true;
    }
    return false;
}
function commitAndPushChanges(output_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const git = (0,esm/* simpleGit */.o5)('.');
        yield git.addConfig('user.email', 'security@aurora.dev');
        yield git.addConfig('user.name', 'Backstage Exporter');
        yield git.add(output_path);
        const msg = 'chore(backstage): 🥷🏽 automatic re-export';
        yield git.commit(msg, undefined);
        yield git.push();
        core.info('Updated and pushed the changes');
        return true;
    });
}
const backstageExport = ({ backstage_url, template_path, output_path, testing }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!template_path || !output_path) {
        throw new Error('set template_path and output_path for handlebars templating');
    }
    const entities = yield (0,get_backstage_entities/* getBackstageEntities */.g)({ backstage_url });
    const multisigsCollector = new multisigs_collector/* MultisigsCollector */.d(entities);
    const filteredCollector = new FilteredCollector(entities);
    // console.log(JSON.stringify(multisigsCollector.systemComponents[0], null, 2));
    const changedFiles = glob.sync(`${template_path}**/*.hbs`).reduce((acc, templatePath) => {
        const templateData = {
            multisigSystemComponents: multisigsCollector.systemComponents,
            filteredEntities: JSON.stringify(filteredCollector.entities, null, 2),
            testing
        };
        if (reexportTemplate({ backstage_url, output_path, template_path, templatePath, templateData })) {
            return [templatePath, ...acc];
        }
        return acc;
    }, []);
    if (testing) {
        core.info(`Testing mode: ${changedFiles.length} changed files, exiting`);
        return true;
    }
    if (changedFiles.length === 0) {
        core.info('No changed files, nothing to commit');
        return false;
    }
    yield commitAndPushChanges(output_path);
});


/***/ }),

/***/ 33476:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": () => (/* binding */ HelperInputs)
/* harmony export */ });
/*
Copyright 2021 Expedia, Inc.
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
class HelperInputs {
}


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
//# sourceMappingURL=854.index.js.map