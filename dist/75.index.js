"use strict";
exports.id = 75;
exports.ids = [75];
exports.modules = {

/***/ 67075:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "GenerateComponentMatrix": () => (/* binding */ GenerateComponentMatrix),
  "generateComponentMatrix": () => (/* binding */ generateComponentMatrix)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __webpack_require__(42186);
// EXTERNAL MODULE: ./src/types/generated.ts
var generated = __webpack_require__(33476);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js
var github = __webpack_require__(95438);
// EXTERNAL MODULE: ./src/octokit.ts
var octokit = __webpack_require__(6161);
;// CONCATENATED MODULE: ./src/utils/get-changed-files.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["add"] = 0] = "add";
    ChangeType[ChangeType["edit"] = 1] = "edit";
    ChangeType[ChangeType["delete"] = 2] = "delete";
    ChangeType[ChangeType["any"] = 3] = "any";
})(ChangeType || (ChangeType = {}));
function getChangedFiles(eventName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!eventName) {
            return [];
        }
        switch (eventName) {
            case 'push':
                return getChangesFromSha();
            default:
                return getChangesFromPR();
        }
    });
}
function getChangesFromSha() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const beforeSha = github.context.payload.before;
        const afterSha = github.context.payload.after;
        const owner = (_b = (_a = github.context.payload.repository) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.name;
        const repo = (_c = github.context.payload.repository) === null || _c === void 0 ? void 0 : _c.name;
        if (!beforeSha || !afterSha || !repo || !owner) {
            return [];
        }
        const changedFiles = yield octokit/* octokit.repos.compareCommits */.K.repos.compareCommits({
            owner,
            repo,
            base: beforeSha,
            head: afterSha,
            mediaType: { format: 'sha' }
        });
        const changes = changedFiles.data.files.map(f => ({
            file: f.filename,
            changeType: parseStatus(f.status),
            patch: f.patch
        }));
        core.debug('found changed files:');
        for (const change of changes) {
            core.debug(`  ${change.file}`);
        }
        return changes;
    });
}
function getChangesFromPR() {
    return __awaiter(this, void 0, void 0, function* () {
        const pullRequest = github.context.payload.pull_request;
        if (!pullRequest) {
            return [];
        }
        const listFilesResponse = yield octokit/* octokit.pulls.listFiles */.K.pulls.listFiles({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: pullRequest.number
        });
        const changes = listFilesResponse.data.map(f => ({
            file: f.filename,
            changeType: parseStatus(f.status),
            patch: f.patch
        }));
        core.debug('found changed files:');
        for (const change of changes) {
            core.debug(`  ${change.file}`);
        }
        return changes;
    });
}
function parseStatus(status) {
    switch (status) {
        case 'added':
            return ChangeType.add;
        case 'removed':
            return ChangeType.delete;
        case 'modified':
            return ChangeType.edit;
        default:
            return ChangeType.edit;
    }
}

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(71017);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(57147);
// EXTERNAL MODULE: ./src/utils/get-backstage-entities.ts
var get_backstage_entities = __webpack_require__(81027);
;// CONCATENATED MODULE: ./src/helpers/generate-component-matrix.ts
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
var generate_component_matrix_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







class GenerateComponentMatrix extends generated/* HelperInputs */.s {
}
const DEFAULT_GO_VERSION = '1.18';
function parseGoVersion(modFilePath) {
    if (external_fs_.existsSync(modFilePath)) {
        const regex = /^go\s+(\S+)/m;
        const match = regex.exec(external_fs_.readFileSync(modFilePath, 'utf8'));
        if (match)
            return match[1];
    }
    core.warning('unable to detect go version');
    return DEFAULT_GO_VERSION;
}
function securityTier(entity) {
    if (!entity.metadata.annotations)
        return -1;
    const tier = entity.metadata.annotations['aurora.dev/security-tier'];
    if (!tier)
        return -1;
    return parseInt(tier, 10);
}
function allowTestsToFail(entity) {
    var _a;
    const tier = securityTier(entity);
    return tier < 0 || !!((_a = entity.metadata.tags) === null || _a === void 0 ? void 0 : _a.includes('ci-sec-disable'));
}
// the annotation will have "url:" prefix - not a relative path
function sourceLocation(entity) {
    if (!entity.metadata.annotations)
        return;
    const loc = entity.metadata.annotations['backstage.io/source-location'];
    return loc;
}
function sourceLocationRelative(entity) {
    const loc = sourceLocation(entity);
    return loc.split('/').slice(7).join('/');
}
function sourceLocationDir(entity) {
    const loc = sourceLocation(entity);
    return loc.split('/').slice(7, -1).join('/');
}
function explicitRelativeLocation(loc) {
    if (loc.startsWith('./'))
        return loc;
    return ['.', ...loc.split('/')].join('/');
}
/**
 * Finds the first parent directory that contains rootFile.
 * If the rootFile is not found, returns ./
 */
function findRoot(dirName, rootFile) {
    const dirs = dirName.split('/');
    core.info(`searching ${rootFile} for ${dirName}`);
    for (;;) {
        const testFile = external_path_.join('./', ...dirs, rootFile);
        core.info(`checking: ${testFile}`);
        if (external_fs_.existsSync(testFile)) {
            core.info(`Found ${rootFile} root for ${dirName}:`);
            core.info(dirs.join('/'));
            break;
        }
        if (dirs.length === 0) {
            core.info(`Unable to find ${rootFile} for ${dirName}, using the default`);
            break;
        }
        // eslint-disable-next-line functional/immutable-data
        dirs.pop();
    }
    return dirs.length > 0 ? dirs.join('/') : '.';
}
function hasInRoot(dirName, rootFile) {
    const dirs = dirName.split('/');
    const testFile = external_path_.join('./', ...dirs, rootFile);
    if (external_fs_.existsSync(testFile)) {
        core.info(`Found ${testFile}`);
        return true;
    }
    core.info(`Unable to find ${rootFile} in ${dirName}`);
    return false;
}
function inspectComponents(message, items) {
    core.info(`${message} (${items.length}):`);
    items.forEach(item => core.info(` - ${item.metadata.name} at "${sourceLocationRelative(item)}"`));
}
function componentConfig(item, runTests) {
    const path = sourceLocationDir(item);
    const isSolidity = ['ethereum', 'aurora'].some(tag => item.metadata.tags.includes(tag));
    const isRust = item.metadata.tags.includes('near') || hasInRoot(path, 'Cargo.toml');
    const isGo = hasInRoot(path, 'go.mod');
    const runSlither = isSolidity && runTests;
    const runClippy = isRust && runTests;
    const runGoStaticChecks = isGo && runTests;
    // Slither is executed from monorepo's root, not from the "path"
    // with the path passed as a target
    // because of that the slither config will be in a subdir of the working dir
    // and slither action won't find it automatically
    const slitherArgs = hasInRoot(path, 'slither.config.json')
        ? `--config-file ${explicitRelativeLocation(path)}/slither.config.json`
        : '--filter-paths "node_modules|testing|test|lib" --exclude timestamp,solc-version,naming-convention,assembly-usage';
    return {
        name: item.metadata.name,
        tags: item.metadata.tags,
        path,
        securityTier: securityTier(item),
        allowTestsToFail: allowTestsToFail(item),
        nodeRoot: findRoot(path, 'package.json'),
        goVersion: parseGoVersion('go.mod'),
        runSlither,
        slitherArgs,
        runClippy,
        runGoStaticChecks
    };
}
function runTestsPolicy(entity, changed, eventName, workflow_force_all_checks_flag) {
    var _a;
    if (workflow_force_all_checks_flag) {
        core.info(`${entity.metadata.name}: CI runs because of workflow config (force_all_checks: true)`);
        return true;
    }
    if (eventName !== 'pull_request') {
        core.info(`${entity.metadata.name}: CI runs because it's not a PR`);
        return true;
    }
    if ((_a = entity.metadata.tags) === null || _a === void 0 ? void 0 : _a.includes('ci-sec-changed-only')) {
        core.info(`${entity.metadata.name}: CI runs for changed only (changed: ${changed}) - via ci-sec-changed-only tag`);
        return changed;
    }
    core.info(`${entity.metadata.name}: CI runs by default for all components (changed: ${changed}) - no ci-sec-changed-only tag`);
    return true;
}
const generateComponentMatrix = ({ backstage_url, backstage_entities_repo, force_all_checks }) => generate_component_matrix_awaiter(void 0, void 0, void 0, function* () {
    const entities = yield (0,get_backstage_entities/* getBackstageEntities */.g)({ backstage_url, backstage_entities_repo });
    const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
    const repoUrl = [serverUrl, github.context.repo.owner, github.context.repo.repo].join('/');
    const componentItems = entities
        .filter(item => { var _a; return (_a = sourceLocation(item)) === null || _a === void 0 ? void 0 : _a.startsWith(`url:${repoUrl}/`); })
        .filter(item => item.kind === 'Component');
    inspectComponents('Component entities in this repo', componentItems);
    const eventName = process.env.GITHUB_EVENT_NAME;
    const changedFiles = yield getChangedFiles(eventName);
    core.info(`Changed files count: ${changedFiles.length}`);
    const changedComponents = componentItems.filter(item => changedFiles.some(file => {
        const loc = sourceLocationRelative(item);
        return file.file.startsWith(loc);
    }));
    inspectComponents('Changed components', changedComponents);
    core.info('Generating component matrix...');
    const matrix = {
        include: componentItems.map(item => {
            const runTests = runTestsPolicy(item, changedComponents.includes(item), eventName, force_all_checks);
            return componentConfig(item, runTests);
        })
    };
    core.info(JSON.stringify(matrix, null, 2));
    return matrix;
});


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": () => (/* binding */ octokit)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(43006);
/* harmony import */ var _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(95438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_2__);
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



const githubToken = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('github_token', { required: true });
const octokit = (0,_actions_github__WEBPACK_IMPORTED_MODULE_2__.getOctokit)(githubToken, { request: { fetch: _adobe_node_fetch_retry__WEBPACK_IMPORTED_MODULE_1__ } }).rest;


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
/* harmony import */ var simple_git__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(92628);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(90250);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
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




function getFileContentFromRepo(repoUrl, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const cloneDir = `/tmp/github-helpers-${(0,lodash__WEBPACK_IMPORTED_MODULE_3__.now)()}`;
        const git = (0,simple_git__WEBPACK_IMPORTED_MODULE_2__/* .simpleGit */ .o5)();
        try {
            yield git.clone(repoUrl, cloneDir, ['--depth=1']);
            yield git.cwd(cloneDir);
            const { current } = yield git.branch();
            const defaultBranch = current || 'main';
            const fileContent = yield git.show([`${defaultBranch}:${filePath}`]);
            yield git.raw(['rm', '-rf', '.']);
            return fileContent;
        }
        catch (error) {
            throw new Error(`Failed to fetch ${repoUrl}/${filePath}: ${error}`);
        }
    });
}
function fetchBackstageEntitiesFromURL(backstage_url) {
    return __awaiter(this, void 0, void 0, function* () {
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
}
function fetchBackstageEntitiesFromRepo(backstage_entities_repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
        const repoUrl = `${serverUrl}/${backstage_entities_repo}`;
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Cloning ${repoUrl}`);
        const content = yield getFileContentFromRepo(repoUrl, 'filteredEntities.json');
        return JSON.parse(content);
    });
}
const getBackstageEntities = ({ backstage_url, backstage_entities_repo }) => __awaiter(void 0, void 0, void 0, function* () {
    // repo takes a priority over the URL in order to avoid unnecessary runtime
    // dependency
    if (backstage_entities_repo) {
        return fetchBackstageEntitiesFromRepo(backstage_entities_repo);
    }
    else if (backstage_url) {
        return fetchBackstageEntitiesFromURL(backstage_url);
    }
    throw new Error('Backstage URL or entities repo is required. Set BACKSTAGE_URL (github secret) or pass backstage_entities_repo argument to this action');
});


/***/ })

};
;
//# sourceMappingURL=75.index.js.map