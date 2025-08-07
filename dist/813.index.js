export const id = 813;
export const ids = [813];
export const modules = {

/***/ 8813:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBatchedCommitMessage: () => (/* binding */ createBatchedCommitMessage)
/* harmony export */ });
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3228);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7484);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_1__);
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


const createBatchedCommitMessage = () => {
    const eventPayload = _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.payload;
    if (!('commits' in eventPayload)) {
        (0,_actions_core__WEBPACK_IMPORTED_MODULE_1__.error)('No commits found in the event payload.');
        return;
    }
    const maxCharactersPerMessage = 50;
    return eventPayload.commits
        .map(commit => {
        const prNumberWithParens = commit.message.match(/\(#(\d+)\)/)?.[0] ?? '';
        const messageWithoutPrNumber = commit.message.replace(prNumberWithParens, '').split('\n')[0]?.trim() ?? '';
        const truncatedMessage = messageWithoutPrNumber.slice(0, maxCharactersPerMessage);
        const ellipses = truncatedMessage.length < messageWithoutPrNumber.length ? '...' : '';
        return `${truncatedMessage}${ellipses} ${prNumberWithParens}`;
    })
        .join(' and ');
};


/***/ })

};

//# sourceMappingURL=813.index.js.map