export const id = 839;
export const ids = [839];
export const modules = {

/***/ 1839:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GenerateMatrix": () => (/* binding */ GenerateMatrix),
/* harmony export */   "generateMatrix": () => (/* binding */ generateMatrix)
/* harmony export */ });
/* harmony import */ var _types_generated__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3476);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(250);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
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


class GenerateMatrix extends _types_generated__WEBPACK_IMPORTED_MODULE_1__/* .HelperInputs */ .s {
    constructor() {
        super(...arguments);
        this.paths = '';
    }
}
const generateMatrix = ({ paths, batches: _batches = '1', load_balancing_sizes, use_basic_matrix_configuration = '' }) => {
    const matrixValues = paths.split(/[\n,]/);
    const batches = Number(_batches);
    let result;
    if (!load_balancing_sizes || matrixValues.length <= batches) {
        const chunkedList = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.chunk)(matrixValues, Math.ceil(matrixValues.length / batches)).map(chunk => chunk.join(','));
        if (use_basic_matrix_configuration === 'true')
            result = { path: chunkedList };
        else
            result = { include: chunkedList.map(chunk => ({ path: chunk })) };
    }
    else {
        const loadBalancingSizes = load_balancing_sizes.split(/[\n,]/).map(size => Number(size));
        if (loadBalancingSizes.length !== matrixValues.length)
            throw new Error('load_balancing_sizes input must have the same length as paths input');
        const targetLoadSize = (0,lodash__WEBPACK_IMPORTED_MODULE_0__.sum)(loadBalancingSizes) / batches;
        const loadBalancedPaths = [];
        let currentLoadSize = 0;
        let currentBatch = [];
        matrixValues.forEach((path, index) => {
            if (Number.isNaN(loadBalancingSizes[index]))
                throw new Error('load_balancing_sizes input must contain values');
            // we've already validated that a value exists at this index above, but TS really _needs_ to see us validate it againgit
            const loadAtIndex = (loadBalancingSizes[index] !== undefined ? loadBalancingSizes[index] : 0);
            const possibleLoadSize = currentLoadSize + loadAtIndex;
            if (Math.abs(possibleLoadSize - targetLoadSize) <= Math.abs(loadAtIndex - targetLoadSize)) {
                currentLoadSize += loadAtIndex;
                currentBatch.push(path);
            }
            else {
                loadBalancedPaths.push(currentBatch.join(','));
                currentBatch = [path];
                currentLoadSize = loadAtIndex;
            }
            if (currentLoadSize >= targetLoadSize) {
                loadBalancedPaths.push(currentBatch.join(','));
                currentBatch = [];
                currentLoadSize = 0;
            }
        });
        if (currentBatch.length > 0)
            loadBalancedPaths.push(currentBatch.join(','));
        if (use_basic_matrix_configuration === 'true')
            result = { path: loadBalancedPaths };
        else
            result = { include: loadBalancedPaths.map(path => ({ path })) };
    }
    return result;
};


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


/***/ })

};

//# sourceMappingURL=839.index.js.map