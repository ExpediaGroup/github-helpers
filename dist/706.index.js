"use strict";
exports.id = 706;
exports.ids = [706];
exports.modules = {

/***/ 6706:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BackstageExport": () => (/* binding */ BackstageExport),
/* harmony export */   "backstageExport": () => (/* binding */ backstageExport)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var glob__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1957);
/* harmony import */ var glob__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(glob__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3476);
/* harmony import */ var _backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4094);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var simple_git__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2628);
/* harmony import */ var handlebars__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7492);
/* harmony import */ var handlebars__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(handlebars__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils_get_backstage_entities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1027);
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
        const componentRefs = system.relations.filter(r => r.type === _backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.RELATION_HAS_PART && (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.parseEntityRef)(r.targetRef).kind === 'component');
        return componentRefs
            .map(componentRef => {
            const component = this.entities.find(item => (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.stringifyEntityRef)(item) === componentRef.targetRef);
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
            .relations.filter(r => r.type === _backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.RELATION_OWNED_BY && (0,_backstage_catalog_model__WEBPACK_IMPORTED_MODULE_2__.parseEntityRef)(r.targetRef).kind !== 'group')
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
class BackstageExport extends _types_generated__WEBPACK_IMPORTED_MODULE_7__/* .HelperInputs */ .s {
}
function reexportTemplate(inputs) {
    const outputPath = inputs.output_path + inputs.templatePath.replace(inputs.template_path, '').replace('.hbs', '');
    const compiledTemplate = handlebars__WEBPACK_IMPORTED_MODULE_5___default().compile(fs__WEBPACK_IMPORTED_MODULE_3__.readFileSync(inputs.templatePath, { encoding: 'utf8' }), {
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
    const existingContent = fs__WEBPACK_IMPORTED_MODULE_3__.existsSync(outputPath) &&
        fs__WEBPACK_IMPORTED_MODULE_3__.readFileSync(outputPath, {
            encoding: 'utf-8'
        });
    if (compiledContent !== existingContent) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Writing ${outputPath}: changed content`);
        fs__WEBPACK_IMPORTED_MODULE_3__.writeFileSync(outputPath, compiledContent);
        return true;
    }
    return false;
}
function commitAndPushChanges(output_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const git = (0,simple_git__WEBPACK_IMPORTED_MODULE_4__/* .simpleGit */ .o5)('.');
        yield git.addConfig('user.email', 'security@aurora.dev');
        yield git.addConfig('user.name', 'Backstage Exporter');
        yield git.add(output_path);
        const msg = 'chore(backstage): 🥷🏽 automatic re-export';
        yield git.commit(msg, undefined);
        yield git.push();
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('Updated and pushed the changes');
        return true;
    });
}
const backstageExport = ({ backstage_url, template_path, output_path, testing }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!template_path || !output_path) {
        throw new Error('set template_path and output_path for handlebars templating');
    }
    const entities = yield (0,_utils_get_backstage_entities__WEBPACK_IMPORTED_MODULE_6__/* .getBackstageEntities */ .g)({ backstage_url });
    const multisigsCollector = new MultisigsCollector(entities);
    // console.log(JSON.stringify(multisigsCollector.systemComponents[0], null, 2));
    const changedFiles = glob__WEBPACK_IMPORTED_MODULE_1__.sync(`${template_path}**/*.hbs`).reduce((acc, templatePath) => {
        const templateData = {
            multisigSystemComponents: multisigsCollector.systemComponents,
            testing
        };
        if (reexportTemplate({ backstage_url, output_path, template_path, templatePath, templateData })) {
            return [templatePath, ...acc];
        }
        return acc;
    }, []);
    if (testing) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Testing mode: ${changedFiles.length} changed files, exiting`);
        return true;
    }
    if (changedFiles.length === 0) {
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info('No changed files, nothing to commit');
        return false;
    }
    yield commitAndPushChanges(output_path);
});


/***/ }),

/***/ 3476:
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
//# sourceMappingURL=706.index.js.map