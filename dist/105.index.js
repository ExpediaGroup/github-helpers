export const id = 105;
export const ids = [105];
export const modules = {

/***/ 9234:
/***/ ((__unused_webpack_module, exports) => {


/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsoleLogger = exports.LogLevel = void 0;
/**
 * Severity levels for log entries
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * Default logger which logs to stdout and stderr
 */
class ConsoleLogger {
    constructor() {
        this.level = LogLevel.INFO;
        this.name = '';
    }
    getLevel() {
        return this.level;
    }
    /**
     * Sets the instance's log level so that only messages which are equal or more severe are output to the console.
     */
    setLevel(level) {
        this.level = level;
    }
    /**
     * Set the instance's name, which will appear on each log line before the message.
     */
    setName(name) {
        this.name = name;
    }
    /**
     * Log a debug message
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug(...msg) {
        if (ConsoleLogger.isMoreOrEqualSevere(LogLevel.DEBUG, this.level)) {
            console.debug(ConsoleLogger.labels.get(LogLevel.DEBUG), this.name, ...msg);
        }
    }
    /**
     * Log an info message
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info(...msg) {
        if (ConsoleLogger.isMoreOrEqualSevere(LogLevel.INFO, this.level)) {
            console.info(ConsoleLogger.labels.get(LogLevel.INFO), this.name, ...msg);
        }
    }
    /**
     * Log a warning message
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn(...msg) {
        if (ConsoleLogger.isMoreOrEqualSevere(LogLevel.WARN, this.level)) {
            console.warn(ConsoleLogger.labels.get(LogLevel.WARN), this.name, ...msg);
        }
    }
    /**
     * Log an error message
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(...msg) {
        if (ConsoleLogger.isMoreOrEqualSevere(LogLevel.ERROR, this.level)) {
            console.error(ConsoleLogger.labels.get(LogLevel.ERROR), this.name, ...msg);
        }
    }
    /**
     * Helper to compare two log levels and determine if a is equal or more severe than b
     */
    static isMoreOrEqualSevere(a, b) {
        return ConsoleLogger.severity[a] >= ConsoleLogger.severity[b];
    }
}
exports.ConsoleLogger = ConsoleLogger;
/** Map of labels for each log level */
ConsoleLogger.labels = (() => {
    const entries = Object.entries(LogLevel);
    const map = entries.map(([key, value]) => [value, `[${key}] `]);
    return new Map(map);
})();
/** Map of severity as comparable numbers for each log level */
ConsoleLogger.severity = {
    [LogLevel.ERROR]: 400,
    [LogLevel.WARN]: 300,
    [LogLevel.INFO]: 200,
    [LogLevel.DEBUG]: 100,
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4591:
/***/ ((__unused_webpack_module, exports) => {


// This file contains objects documented here: https://api.slack.com/reference/block-kit/block-elements
Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=block-elements.js.map

/***/ }),

/***/ 1356:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=blocks.js.map

/***/ }),

/***/ 3819:
/***/ ((__unused_webpack_module, exports) => {


// This file contains objects documented here: https://api.slack.com/reference/block-kit/composition-objects
Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=composition-objects.js.map

/***/ }),

/***/ 4148:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=extensions.js.map

/***/ }),

/***/ 9110:
/***/ ((__unused_webpack_module, exports) => {


// These types represent users in Slack Calls, which is an API for showing 3rd party calls within the Slack client.
// More information on the API guide for Calls: https://api.slack.com/apis/calls
// and on User objects for use with Calls: https://api.slack.com/apis/calls#users
Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=calls.js.map

/***/ }),

/***/ 7904:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=dialog.js.map

/***/ }),

/***/ 4854:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=app.js.map

/***/ }),

/***/ 2149:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=assistant.js.map

/***/ }),

/***/ 8458:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=call.js.map

/***/ }),

/***/ 674:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=channel.js.map

/***/ }),

/***/ 3147:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=dnd.js.map

/***/ }),

/***/ 245:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=email.js.map

/***/ }),

/***/ 9679:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=emoji.js.map

/***/ }),

/***/ 9335:
/***/ ((__unused_webpack_module, exports) => {


// NOTE: `file_comment_added` and `file_comment_edited` are left out because they are discontinued
Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=file.js.map

/***/ }),

/***/ 365:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=function.js.map

/***/ }),

/***/ 9660:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=grid-migration.js.map

/***/ }),

/***/ 6850:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=group.js.map

/***/ }),

/***/ 7783:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=im.js.map

/***/ }),

/***/ 4573:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(4854), exports);
__exportStar(__webpack_require__(2149), exports);
__exportStar(__webpack_require__(8458), exports);
__exportStar(__webpack_require__(674), exports);
__exportStar(__webpack_require__(3147), exports);
__exportStar(__webpack_require__(245), exports);
__exportStar(__webpack_require__(9679), exports);
__exportStar(__webpack_require__(9335), exports);
__exportStar(__webpack_require__(365), exports);
__exportStar(__webpack_require__(9660), exports);
__exportStar(__webpack_require__(6850), exports);
__exportStar(__webpack_require__(7783), exports);
__exportStar(__webpack_require__(8324), exports);
__exportStar(__webpack_require__(2199), exports);
__exportStar(__webpack_require__(495), exports);
__exportStar(__webpack_require__(6286), exports);
__exportStar(__webpack_require__(1710), exports);
__exportStar(__webpack_require__(5710), exports);
__exportStar(__webpack_require__(4178), exports);
__exportStar(__webpack_require__(7662), exports);
__exportStar(__webpack_require__(7145), exports);
__exportStar(__webpack_require__(6593), exports);
__exportStar(__webpack_require__(5876), exports);
__exportStar(__webpack_require__(6000), exports);
__exportStar(__webpack_require__(5906), exports);
__exportStar(__webpack_require__(8064), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8324:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=invite.js.map

/***/ }),

/***/ 2199:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=link-shared.js.map

/***/ }),

/***/ 495:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=member.js.map

/***/ }),

/***/ 1710:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=message-metadata.js.map

/***/ }),

/***/ 6286:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=message.js.map

/***/ }),

/***/ 5710:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=pin.js.map

/***/ }),

/***/ 4178:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=reaction.js.map

/***/ }),

/***/ 7662:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=shared-channel.js.map

/***/ }),

/***/ 7145:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=star.js.map

/***/ }),

/***/ 8064:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=steps-from-apps.js.map

/***/ }),

/***/ 6593:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=subteam.js.map

/***/ }),

/***/ 5876:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=team.js.map

/***/ }),

/***/ 6000:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=token.js.map

/***/ }),

/***/ 5906:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=user.js.map

/***/ }),

/***/ 4775:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(9110), exports);
__exportStar(__webpack_require__(7904), exports);
__exportStar(__webpack_require__(4573), exports);
__exportStar(__webpack_require__(9380), exports);
__exportStar(__webpack_require__(5723), exports);
__exportStar(__webpack_require__(7445), exports);
__exportStar(__webpack_require__(1356), exports);
__exportStar(__webpack_require__(3819), exports);
__exportStar(__webpack_require__(4591), exports);
__exportStar(__webpack_require__(4148), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5723:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=message-attachments.js.map

/***/ }),

/***/ 9380:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=message-metadata.js.map

/***/ }),

/***/ 7445:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=views.js.map

/***/ }),

/***/ 4048:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebClient = exports.WebClientEvent = void 0;
exports.buildThreadTsWarningMessage = buildThreadTsWarningMessage;
const node_path_1 = __webpack_require__(6760);
const node_querystring_1 = __webpack_require__(1792);
const node_util_1 = __webpack_require__(7975);
const node_zlib_1 = __importDefault(__webpack_require__(8522));
const axios_1 = __importDefault(__webpack_require__(7269));
const form_data_1 = __importDefault(__webpack_require__(6454));
const is_electron_1 = __importDefault(__webpack_require__(201));
const is_stream_1 = __importDefault(__webpack_require__(6543));
const p_queue_1 = __importDefault(__webpack_require__(6459));
const p_retry_1 = __importStar(__webpack_require__(2103));
const errors_1 = __webpack_require__(8486);
const file_upload_1 = __webpack_require__(2577);
const helpers_1 = __importDefault(__webpack_require__(4060));
const instrument_1 = __webpack_require__(9224);
const logger_1 = __webpack_require__(4385);
const methods_1 = __webpack_require__(9339);
const retry_policies_1 = __webpack_require__(1766);
/*
 * Helpers
 */
// Props on axios default headers object to ignore when retrieving full list of actual headers sent in any HTTP requests
const axiosHeaderPropsToIgnore = [
    'delete',
    'common',
    'get',
    'put',
    'head',
    'post',
    'link',
    'patch',
    'purge',
    'unlink',
    'options',
];
const defaultFilename = 'Untitled';
const defaultPageSize = 200;
const noopPageReducer = () => undefined;
var WebClientEvent;
(function (WebClientEvent) {
    // TODO: safe to rename this to conform to PascalCase enum type naming convention?
    WebClientEvent["RATE_LIMITED"] = "rate_limited";
})(WebClientEvent || (exports.WebClientEvent = WebClientEvent = {}));
/**
 * A client for Slack's Web API
 *
 * This client provides an alias for each {@link https://api.slack.com/methods|Web API method}. Each method is
 * a convenience wrapper for calling the {@link WebClient#apiCall} method using the method name as the first parameter.
 */
class WebClient extends methods_1.Methods {
    /**
     * @param token - An API token to authenticate/authorize with Slack (usually start with `xoxp`, `xoxb`)
     * @param {Object} [webClientOptions] - Configuration options.
     * @param {Function} [webClientOptions.requestInterceptor] - An interceptor to mutate outgoing requests. See {@link https://axios-http.com/docs/interceptors Axios interceptors}
     * @param {Function} [webClientOptions.adapter] - An adapter to allow custom handling of requests. Useful if you would like to use a pre-configured http client. See {@link https://github.com/axios/axios/blob/v1.x/README.md?plain=1#L586 Axios adapter}
     */
    constructor(token, { slackApiUrl = 'https://slack.com/api/', logger = undefined, logLevel = undefined, maxRequestConcurrency = 100, retryConfig = retry_policies_1.tenRetriesInAboutThirtyMinutes, agent = undefined, tls = undefined, timeout = 0, rejectRateLimitedCalls = false, headers = {}, teamId = undefined, allowAbsoluteUrls = true, attachOriginalToWebAPIRequestError = true, requestInterceptor = undefined, adapter = undefined, } = {}) {
        super();
        this.token = token;
        this.slackApiUrl = slackApiUrl;
        if (!this.slackApiUrl.endsWith('/')) {
            this.slackApiUrl += '/';
        }
        this.retryConfig = retryConfig;
        this.requestQueue = new p_queue_1.default({ concurrency: maxRequestConcurrency });
        // NOTE: may want to filter the keys to only those acceptable for TLS options
        this.tlsConfig = tls !== undefined ? tls : {};
        this.rejectRateLimitedCalls = rejectRateLimitedCalls;
        this.teamId = teamId;
        this.allowAbsoluteUrls = allowAbsoluteUrls;
        this.attachOriginalToWebAPIRequestError = attachOriginalToWebAPIRequestError;
        // Logging
        if (typeof logger !== 'undefined') {
            this.logger = logger;
            if (typeof logLevel !== 'undefined') {
                this.logger.debug('The logLevel given to WebClient was ignored as you also gave logger');
            }
        }
        else {
            this.logger = (0, logger_1.getLogger)(WebClient.loggerName, logLevel !== null && logLevel !== void 0 ? logLevel : logger_1.LogLevel.INFO, logger);
        }
        if (this.token && !headers.Authorization)
            headers.Authorization = `Bearer ${this.token}`;
        this.axios = axios_1.default.create({
            adapter: adapter ? (config) => adapter(Object.assign(Object.assign({}, config), { adapter: undefined })) : undefined,
            timeout,
            baseURL: this.slackApiUrl,
            headers: (0, is_electron_1.default)() ? headers : Object.assign({ 'User-Agent': (0, instrument_1.getUserAgent)() }, headers),
            httpAgent: agent,
            httpsAgent: agent,
            validateStatus: () => true, // all HTTP status codes should result in a resolved promise (as opposed to only 2xx)
            maxRedirects: 0,
            // disabling axios' automatic proxy support:
            // axios would read from envvars to configure a proxy automatically, but it doesn't support TLS destinations.
            // for compatibility with https://api.slack.com, and for a larger set of possible proxies (SOCKS or other
            // protocols), users of this package should use the `agent` option to configure a proxy.
            proxy: false,
        });
        // serializeApiCallData will always determine the appropriate content-type
        this.axios.defaults.headers.post['Content-Type'] = undefined;
        // request interceptors have reversed execution order
        // see: https://github.com/axios/axios/blob/v1.x/test/specs/interceptors.spec.js#L88
        if (requestInterceptor) {
            this.axios.interceptors.request.use(requestInterceptor, null);
        }
        this.axios.interceptors.request.use(this.serializeApiCallData.bind(this), null);
        this.logger.debug('initialized');
    }
    /**
     * Generic method for calling a Web API method
     * @param method - the Web API method to call {@link https://api.slack.com/methods}
     * @param options - options
     */
    apiCall(method_1) {
        return __awaiter(this, arguments, void 0, function* (method, options = {}) {
            this.logger.debug(`apiCall('${method}') start`);
            warnDeprecations(method, this.logger);
            warnIfFallbackIsMissing(method, this.logger, options);
            warnIfThreadTsIsNotString(method, this.logger, options);
            if (typeof options === 'string' || typeof options === 'number' || typeof options === 'boolean') {
                throw new TypeError(`Expected an options argument but instead received a ${typeof options}`);
            }
            (0, file_upload_1.warnIfNotUsingFilesUploadV2)(method, this.logger);
            // @ts-expect-error insufficient overlap between Record and FilesUploadV2Arguments
            if (method === 'files.uploadV2')
                return this.filesUploadV2(options);
            const headers = {};
            if (options.token)
                headers.Authorization = `Bearer ${options.token}`;
            const url = this.deriveRequestUrl(method);
            const response = yield this.makeRequest(url, Object.assign({ team_id: this.teamId }, options), headers);
            const result = yield this.buildResult(response);
            this.logger.debug(`http request result: ${JSON.stringify(result)}`);
            // log warnings in response metadata
            if (result.response_metadata !== undefined && result.response_metadata.warnings !== undefined) {
                result.response_metadata.warnings.forEach(this.logger.warn.bind(this.logger));
            }
            // log warnings and errors in response metadata messages
            // related to https://api.slack.com/changelog/2016-09-28-response-metadata-is-on-the-way
            if (result.response_metadata !== undefined && result.response_metadata.messages !== undefined) {
                for (const msg of result.response_metadata.messages) {
                    const errReg = /\[ERROR\](.*)/;
                    const warnReg = /\[WARN\](.*)/;
                    if (errReg.test(msg)) {
                        const errMatch = msg.match(errReg);
                        if (errMatch != null) {
                            this.logger.error(errMatch[1].trim());
                        }
                    }
                    else if (warnReg.test(msg)) {
                        const warnMatch = msg.match(warnReg);
                        if (warnMatch != null) {
                            this.logger.warn(warnMatch[1].trim());
                        }
                    }
                }
            }
            // If result's content is gzip, "ok" property is not returned with successful response
            // TODO: look into simplifying this code block to only check for the second condition
            // if an { ok: false } body applies for all API errors
            if (!result.ok && response.headers['content-type'] !== 'application/gzip') {
                throw (0, errors_1.platformErrorFromResult)(result);
            }
            if ('ok' in result && result.ok === false) {
                throw (0, errors_1.platformErrorFromResult)(result);
            }
            this.logger.debug(`apiCall('${method}') end`);
            return result;
        });
    }
    paginate(method, options, shouldStop, reduce) {
        const pageSize = (() => {
            if (options !== undefined && typeof options.limit === 'number') {
                const { limit } = options;
                options.limit = undefined;
                return limit;
            }
            return defaultPageSize;
        })();
        function generatePages() {
            return __asyncGenerator(this, arguments, function* generatePages_1() {
                // when result is undefined, that signals that the first of potentially many calls has not yet been made
                let result;
                // paginationOptions stores pagination options not already stored in the options argument
                let paginationOptions = {
                    limit: pageSize,
                };
                if (options !== undefined && options.cursor !== undefined) {
                    paginationOptions.cursor = options.cursor;
                }
                // NOTE: test for the situation where you're resuming a pagination using and existing cursor
                while (result === undefined || paginationOptions !== undefined) {
                    result = yield __await(this.apiCall(method, Object.assign(options !== undefined ? options : {}, paginationOptions)));
                    yield yield __await(result);
                    paginationOptions = paginationOptionsForNextPage(result, pageSize);
                }
            });
        }
        if (shouldStop === undefined) {
            return generatePages.call(this);
        }
        const pageReducer = reduce !== undefined ? reduce : noopPageReducer;
        let index = 0;
        return (() => __awaiter(this, void 0, void 0, function* () {
            // Unroll the first iteration of the iterator
            // This is done primarily because in order to satisfy the type system, we need a variable that is typed as A
            // (shown as accumulator before), but before the first iteration all we have is a variable typed A | undefined.
            // Unrolling the first iteration allows us to deal with undefined as a special case.
            var _a, e_1, _b, _c;
            const pageIterator = generatePages.call(this);
            const firstIteratorResult = yield pageIterator.next(undefined);
            // Assumption: there will always be at least one result in a paginated API request
            // if (firstIteratorResult.done) { return; }
            const firstPage = firstIteratorResult.value;
            let accumulator = pageReducer(undefined, firstPage, index);
            index += 1;
            if (shouldStop(firstPage)) {
                return accumulator;
            }
            try {
                // Continue iteration
                for (var _d = true, pageIterator_1 = __asyncValues(pageIterator), pageIterator_1_1; pageIterator_1_1 = yield pageIterator_1.next(), _a = pageIterator_1_1.done, !_a; _d = true) {
                    _c = pageIterator_1_1.value;
                    _d = false;
                    const page = _c;
                    accumulator = pageReducer(accumulator, page, index);
                    if (shouldStop(page)) {
                        return accumulator;
                    }
                    index += 1;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = pageIterator_1.return)) yield _b.call(pageIterator_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return accumulator;
        }))();
    }
    /**
     * This wrapper method provides an easy way to upload files using the following endpoints:
     *
     * **#1**: For each file submitted with this method, submit filenames
     * and file metadata to {@link https://api.slack.com/methods/files.getUploadURLExternal files.getUploadURLExternal} to request a URL to
     * which to send the file data to and an id for the file
     *
     * **#2**: for each returned file `upload_url`, upload corresponding file to
     * URLs returned from step 1 (e.g. https://files.slack.com/upload/v1/...\")
     *
     * **#3**: Complete uploads {@link https://api.slack.com/methods/files.completeUploadExternal files.completeUploadExternal}
     * @param options
     */
    filesUploadV2(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('files.uploadV2() start');
            // 1
            const fileUploads = yield this.getAllFileUploads(options);
            const fileUploadsURLRes = yield this.fetchAllUploadURLExternal(fileUploads);
            // set the upload_url and file_id returned from Slack
            fileUploadsURLRes.forEach((res, idx) => {
                fileUploads[idx].upload_url = res.upload_url;
                fileUploads[idx].file_id = res.file_id;
            });
            // 2
            yield this.postFileUploadsToExternalURL(fileUploads, options);
            // 3
            const completion = yield this.completeFileUploads(fileUploads);
            return { ok: true, files: completion };
        });
    }
    /**
     * For each file submitted with this method, submits filenames
     * and file metadata to files.getUploadURLExternal to request a URL to
     * which to send the file data to and an id for the file
     * @param fileUploads
     */
    fetchAllUploadURLExternal(fileUploads) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(fileUploads.map((upload) => {
                const options = {
                    filename: upload.filename,
                    length: upload.length,
                    alt_text: upload.alt_text,
                    snippet_type: upload.snippet_type,
                };
                if ('token' in upload) {
                    options.token = upload.token;
                }
                return this.files.getUploadURLExternal(options);
            }));
        });
    }
    /**
     * Complete uploads.
     * @param fileUploads
     * @returns
     */
    completeFileUploads(fileUploads) {
        return __awaiter(this, void 0, void 0, function* () {
            const toComplete = Object.values((0, file_upload_1.getAllFileUploadsToComplete)(fileUploads));
            return Promise.all(toComplete.map((job) => this.files.completeUploadExternal(job)));
        });
    }
    /**
     * for each returned file upload URL, upload corresponding file
     * @param fileUploads
     * @returns
     */
    postFileUploadsToExternalURL(fileUploads, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(fileUploads.map((upload) => __awaiter(this, void 0, void 0, function* () {
                const { upload_url, file_id, filename, data } = upload;
                // either file or content will be defined
                const body = data;
                // try to post to external url
                if (upload_url) {
                    const headers = {};
                    if (options.token)
                        headers.Authorization = `Bearer ${options.token}`;
                    const uploadRes = yield this.makeRequest(upload_url, {
                        body,
                    }, headers);
                    if (uploadRes.status !== 200) {
                        return Promise.reject(Error(`Failed to upload file (id:${file_id}, filename: ${filename})`));
                    }
                    const returnData = { ok: true, body: uploadRes.data };
                    return Promise.resolve(returnData);
                }
                return Promise.reject(Error(`No upload url found for file (id: ${file_id}, filename: ${filename}`));
            })));
        });
    }
    /**
     * @param options All file uploads arguments
     * @returns An array of file upload entries
     */
    getAllFileUploads(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let fileUploads = [];
            // add single file data to uploads if file or content exists at the top level
            if ('file' in options || 'content' in options) {
                fileUploads.push(yield (0, file_upload_1.getFileUploadJob)(options, this.logger));
            }
            // add multiple files data when file_uploads is supplied
            if ('file_uploads' in options) {
                fileUploads = fileUploads.concat(yield (0, file_upload_1.getMultipleFileUploadJobs)(options, this.logger));
            }
            return fileUploads;
        });
    }
    /**
     * Low-level function to make a single API request. handles queuing, retries, and http-level errors
     */
    makeRequest(url_1, body_1) {
        return __awaiter(this, arguments, void 0, function* (url, body, headers = {}) {
            // TODO: better input types - remove any
            const task = () => this.requestQueue.add(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    // biome-ignore lint/suspicious/noExplicitAny: TODO: type this
                    const config = Object.assign({ headers }, this.tlsConfig);
                    // admin.analytics.getFile returns a binary response
                    // To be able to parse it, it should be read as an ArrayBuffer
                    if (url.endsWith('admin.analytics.getFile')) {
                        config.responseType = 'arraybuffer';
                    }
                    // apps.event.authorizations.list will reject HTTP requests that send token in the body
                    // TODO: consider applying this change to all methods - though that will require thorough integration testing
                    if (url.endsWith('apps.event.authorizations.list')) {
                        body.token = undefined;
                    }
                    this.logger.debug(`http request url: ${url}`);
                    this.logger.debug(`http request body: ${JSON.stringify(redact(body))}`);
                    // compile all headers - some set by default under the hood by axios - that will be sent along
                    let allHeaders = Object.keys(this.axios.defaults.headers).reduce((acc, cur) => {
                        if (!axiosHeaderPropsToIgnore.includes(cur)) {
                            acc[cur] = this.axios.defaults.headers[cur];
                        }
                        return acc;
                    }, {});
                    allHeaders = Object.assign(Object.assign(Object.assign({}, this.axios.defaults.headers.common), allHeaders), headers);
                    this.logger.debug(`http request headers: ${JSON.stringify(redact(allHeaders))}`);
                    const response = yield this.axios.post(url, body, config);
                    this.logger.debug('http response received');
                    if (response.status === 429) {
                        const retrySec = parseRetryHeaders(response);
                        if (retrySec !== undefined) {
                            this.emit(WebClientEvent.RATE_LIMITED, retrySec, { url, body });
                            if (this.rejectRateLimitedCalls) {
                                throw new p_retry_1.AbortError((0, errors_1.rateLimitedErrorWithDelay)(retrySec));
                            }
                            this.logger.info(`API Call failed due to rate limiting. Will retry in ${retrySec} seconds.`);
                            // pause the request queue and then delay the rejection by the amount of time in the retry header
                            this.requestQueue.pause();
                            // NOTE: if there was a way to introspect the current RetryOperation and know what the next timeout
                            // would be, then we could subtract that time from the following delay, knowing that it the next
                            // attempt still wouldn't occur until after the rate-limit header has specified. an even better
                            // solution would be to subtract the time from only the timeout of this next attempt of the
                            // RetryOperation. this would result in the staying paused for the entire duration specified in the
                            // header, yet this operation not having to pay the timeout cost in addition to that.
                            yield (0, helpers_1.default)(retrySec * 1000);
                            // resume the request queue and throw a non-abort error to signal a retry
                            this.requestQueue.start();
                            // TODO: We may want to have more detailed info such as team_id, params except tokens, and so on.
                            throw new Error(`A rate limit was exceeded (url: ${url}, retry-after: ${retrySec})`);
                        }
                        // TODO: turn this into some CodedError
                        throw new p_retry_1.AbortError(new Error(`Retry header did not contain a valid timeout (url: ${url}, retry-after header: ${response.headers['retry-after']})`));
                    }
                    // Slack's Web API doesn't use meaningful status codes besides 429 and 200
                    if (response.status !== 200) {
                        throw (0, errors_1.httpErrorFromResponse)(response);
                    }
                    return response;
                }
                catch (error) {
                    // To make this compatible with tsd, casting here instead of `catch (error: any)`
                    // biome-ignore lint/suspicious/noExplicitAny: errors can be anything
                    const e = error;
                    this.logger.warn('http request failed', e.message);
                    if (e.request) {
                        throw (0, errors_1.requestErrorWithOriginal)(e, this.attachOriginalToWebAPIRequestError);
                    }
                    throw error;
                }
            }));
            // biome-ignore lint/suspicious/noExplicitAny: http responses can be anything
            return (0, p_retry_1.default)(task, this.retryConfig);
        });
    }
    /**
     * Get the complete request URL for the provided URL.
     * @param url - The resource to POST to. Either a Slack API method or absolute URL.
     */
    deriveRequestUrl(url) {
        const isAbsoluteURL = url.startsWith('https://') || url.startsWith('http://');
        if (isAbsoluteURL && this.allowAbsoluteUrls) {
            return url;
        }
        return `${this.axios.getUri() + url}`;
    }
    /**
     * Transforms options (a simple key-value object) into an acceptable value for a body. This can be either
     * a string, used when posting with a content-type of url-encoded. Or, it can be a readable stream, used
     * when the options contain a binary (a stream or a buffer) and the upload should be done with content-type
     * multipart/form-data.
     * @param config - The Axios request configuration object
     */
    serializeApiCallData(config) {
        const { data, headers } = config;
        // The following operation both flattens complex objects into a JSON-encoded strings and searches the values for
        // binary content
        let containsBinaryData = false;
        // biome-ignore lint/suspicious/noExplicitAny: HTTP request data can be anything
        const flattened = Object.entries(data).map(([key, value]) => {
            if (value === undefined || value === null) {
                return [];
            }
            let serializedValue = value;
            if (Buffer.isBuffer(value) || (0, is_stream_1.default)(value)) {
                containsBinaryData = true;
            }
            else if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
                // if value is anything other than string, number, boolean, binary data, a Stream, or a Buffer, then encode it
                // as a JSON string.
                serializedValue = JSON.stringify(value);
            }
            return [key, serializedValue];
        });
        // A body with binary content should be serialized as multipart/form-data
        if (containsBinaryData) {
            this.logger.debug('Request arguments contain binary data');
            const form = flattened.reduce((frm, [key, value]) => {
                if (Buffer.isBuffer(value) || (0, is_stream_1.default)(value)) {
                    const opts = {};
                    opts.filename = (() => {
                        // attempt to find filename from `value`. adapted from:
                        // https://github.com/form-data/form-data/blob/028c21e0f93c5fefa46a7bbf1ba753e4f627ab7a/lib/form_data.js#L227-L230
                        // formidable and the browser add a name property
                        // fs- and request- streams have path property
                        // biome-ignore lint/suspicious/noExplicitAny: form values can be anything
                        const streamOrBuffer = value;
                        if (typeof streamOrBuffer.name === 'string') {
                            return (0, node_path_1.basename)(streamOrBuffer.name);
                        }
                        if (typeof streamOrBuffer.path === 'string') {
                            return (0, node_path_1.basename)(streamOrBuffer.path);
                        }
                        return defaultFilename;
                    })();
                    frm.append(key, value, opts);
                }
                else if (key !== undefined && value !== undefined) {
                    frm.append(key, value);
                }
                return frm;
            }, new form_data_1.default());
            if (headers) {
                // Copying FormData-generated headers into headers param
                // not reassigning to headers param since it is passed by reference and behaves as an inout param
                for (const [header, value] of Object.entries(form.getHeaders())) {
                    headers[header] = value;
                }
            }
            config.data = form;
            config.headers = headers;
            return config;
        }
        // Otherwise, a simple key-value object is returned
        if (headers)
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // biome-ignore lint/suspicious/noExplicitAny: form values can be anything
        const initialValue = {};
        config.data = (0, node_querystring_1.stringify)(flattened.reduce((accumulator, [key, value]) => {
            if (key !== undefined && value !== undefined) {
                accumulator[key] = value;
            }
            return accumulator;
        }, initialValue));
        config.headers = headers;
        return config;
    }
    /**
     * Processes an HTTP response into a WebAPICallResult by performing JSON parsing on the body and merging relevant
     * HTTP headers into the object.
     * @param response - an http response
     */
    buildResult(response) {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = response;
            const isGzipResponse = response.headers['content-type'] === 'application/gzip';
            // Check for GZIP response - if so, it is a successful response from admin.analytics.getFile
            if (isGzipResponse) {
                // admin.analytics.getFile will return a Buffer that can be unzipped
                try {
                    const unzippedData = yield new Promise((resolve, reject) => {
                        node_zlib_1.default.unzip(data, (err, buf) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(buf.toString().split('\n'));
                        });
                    })
                        .then((res) => res)
                        .catch((err) => {
                        throw err;
                    });
                    const fileData = [];
                    if (Array.isArray(unzippedData)) {
                        for (const dataset of unzippedData) {
                            if (dataset && dataset.length > 0) {
                                fileData.push(JSON.parse(dataset));
                            }
                        }
                    }
                    data = { file_data: fileData };
                }
                catch (err) {
                    data = { ok: false, error: err };
                }
            }
            else if (!isGzipResponse && response.request.path === '/api/admin.analytics.getFile') {
                // if it isn't a Gzip response but is from the admin.analytics.getFile request,
                // decode the ArrayBuffer to JSON read the error
                data = JSON.parse(new node_util_1.TextDecoder().decode(data));
            }
            if (typeof data === 'string') {
                // response.data can be a string, not an object for some reason
                try {
                    data = JSON.parse(data);
                }
                catch (_) {
                    // failed to parse the string value as JSON data
                    data = { ok: false, error: data };
                }
            }
            if (data.response_metadata === undefined) {
                data.response_metadata = {};
            }
            // add scopes metadata from headers
            if (response.headers['x-oauth-scopes'] !== undefined) {
                data.response_metadata.scopes = response.headers['x-oauth-scopes'].trim().split(/\s*,\s*/);
            }
            if (response.headers['x-accepted-oauth-scopes'] !== undefined) {
                data.response_metadata.acceptedScopes = response.headers['x-accepted-oauth-scopes']
                    .trim()
                    .split(/\s*,\s*/);
            }
            // add retry metadata from headers
            const retrySec = parseRetryHeaders(response);
            if (retrySec !== undefined) {
                data.response_metadata.retryAfter = retrySec;
            }
            return data;
        });
    }
}
exports.WebClient = WebClient;
/**
 * The name used to prefix all logging generated from this object
 */
WebClient.loggerName = 'WebClient';
exports["default"] = WebClient;
/**
 * Determines an appropriate set of cursor pagination options for the next request to a paginated API method.
 * @param previousResult - the result of the last request, where the next cursor might be found.
 * @param pageSize - the maximum number of additional items to fetch in the next request.
 */
function paginationOptionsForNextPage(previousResult, pageSize) {
    if (previousResult !== undefined &&
        previousResult.response_metadata !== undefined &&
        previousResult.response_metadata.next_cursor !== undefined &&
        previousResult.response_metadata.next_cursor !== '') {
        return {
            limit: pageSize,
            cursor: previousResult.response_metadata.next_cursor,
        };
    }
    return undefined;
}
/**
 * Extract the amount of time (in seconds) the platform has recommended this client wait before sending another request
 * from a rate-limited HTTP response (statusCode = 429).
 */
function parseRetryHeaders(response) {
    if (response.headers['retry-after'] !== undefined) {
        const retryAfter = Number.parseInt(response.headers['retry-after'], 10);
        if (!Number.isNaN(retryAfter)) {
            return retryAfter;
        }
    }
    return undefined;
}
/**
 * Log a warning when using a deprecated method
 * @param method api method being called
 * @param logger instance of web clients logger
 */
function warnDeprecations(method, logger) {
    const deprecatedMethods = ['workflows.'];
    const isDeprecated = deprecatedMethods.some((depMethod) => {
        const re = new RegExp(`^${depMethod}`);
        return re.test(method);
    });
    if (isDeprecated) {
        logger.warn(`${method} is deprecated. Please check on https://api.slack.com/methods for an alternative.`);
    }
}
/**
 * Log a warning when using chat.postMessage without text argument or attachments with fallback argument
 * @param method api method being called
 * @param logger instance of we clients logger
 * @param options arguments for the Web API method
 */
function warnIfFallbackIsMissing(method, logger, options) {
    const targetMethods = ['chat.postEphemeral', 'chat.postMessage', 'chat.scheduleMessage'];
    const isTargetMethod = targetMethods.includes(method);
    const hasAttachments = (args) => Array.isArray(args.attachments) && args.attachments.length;
    const missingAttachmentFallbackDetected = (args) => Array.isArray(args.attachments) &&
        args.attachments.some((attachment) => !attachment.fallback || attachment.fallback.trim() === '');
    const isEmptyText = (args) => args.text === undefined || args.text === null || args.text === '';
    const buildMissingTextWarning = () => `The top-level \`text\` argument is missing in the request payload for a ${method} call - It's a best practice to always provide a \`text\` argument when posting a message. The \`text\` is used in places where the content cannot be rendered such as: system push notifications, assistive technology such as screen readers, etc.`;
    const buildMissingFallbackWarning = () => `Additionally, the attachment-level \`fallback\` argument is missing in the request payload for a ${method} call - To avoid this warning, it is recommended to always provide a top-level \`text\` argument when posting a message. Alternatively, you can provide an attachment-level \`fallback\` argument, though this is now considered a legacy field (see https://api.slack.com/reference/messaging/attachments#legacy_fields for more details).`;
    if (isTargetMethod && typeof options === 'object') {
        if (hasAttachments(options)) {
            if (missingAttachmentFallbackDetected(options) && isEmptyText(options)) {
                logger.warn(buildMissingTextWarning());
                logger.warn(buildMissingFallbackWarning());
            }
        }
        else if (isEmptyText(options)) {
            logger.warn(buildMissingTextWarning());
        }
    }
}
/**
 * Log a warning when thread_ts is not a string
 * @param method api method being called
 * @param logger instance of web clients logger
 * @param options arguments for the Web API method
 */
function warnIfThreadTsIsNotString(method, logger, options) {
    const targetMethods = ['chat.postEphemeral', 'chat.postMessage', 'chat.scheduleMessage', 'files.upload'];
    const isTargetMethod = targetMethods.includes(method);
    if (isTargetMethod && (options === null || options === void 0 ? void 0 : options.thread_ts) !== undefined && typeof (options === null || options === void 0 ? void 0 : options.thread_ts) !== 'string') {
        logger.warn(buildThreadTsWarningMessage(method));
    }
}
function buildThreadTsWarningMessage(method) {
    return `The given thread_ts value in the request payload for a ${method} call is a float value. We highly recommend using a string value instead.`;
}
/**
 * Takes an object and redacts specific items
 * @param body
 * @returns
 */
function redact(body) {
    // biome-ignore lint/suspicious/noExplicitAny: objects can be anything
    const flattened = Object.entries(body).map(([key, value]) => {
        // no value provided
        if (value === undefined || value === null) {
            return [];
        }
        let serializedValue = value;
        // redact possible tokens
        if (key.match(/.*token.*/) !== null || key.match(/[Aa]uthorization/)) {
            serializedValue = '[[REDACTED]]';
        }
        // when value is buffer or stream we can avoid logging it
        if (Buffer.isBuffer(value) || (0, is_stream_1.default)(value)) {
            serializedValue = '[[BINARY VALUE OMITTED]]';
        }
        else if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
            serializedValue = JSON.stringify(value);
        }
        return [key, serializedValue];
    });
    // return as object
    const initialValue = {};
    return flattened.reduce((accumulator, [key, value]) => {
        if (key !== undefined && value !== undefined) {
            accumulator[key] = value;
        }
        return accumulator;
    }, initialValue);
}
//# sourceMappingURL=WebClient.js.map

/***/ }),

/***/ 8486:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorCode = void 0;
exports.errorWithCode = errorWithCode;
exports.requestErrorWithOriginal = requestErrorWithOriginal;
exports.httpErrorFromResponse = httpErrorFromResponse;
exports.platformErrorFromResult = platformErrorFromResult;
exports.rateLimitedErrorWithDelay = rateLimitedErrorWithDelay;
/**
 * A dictionary of codes for errors produced by this package
 */
var ErrorCode;
(function (ErrorCode) {
    // general error
    ErrorCode["RequestError"] = "slack_webapi_request_error";
    ErrorCode["HTTPError"] = "slack_webapi_http_error";
    ErrorCode["PlatformError"] = "slack_webapi_platform_error";
    ErrorCode["RateLimitedError"] = "slack_webapi_rate_limited_error";
    // file uploads errors
    ErrorCode["FileUploadInvalidArgumentsError"] = "slack_webapi_file_upload_invalid_args_error";
    ErrorCode["FileUploadReadFileDataError"] = "slack_webapi_file_upload_read_file_data_error";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
/**
 * Factory for producing a {@link CodedError} from a generic error
 */
function errorWithCode(error, code) {
    // NOTE: might be able to return something more specific than a CodedError with conditional typing
    const codedError = error;
    codedError.code = code;
    return codedError;
}
/**
 * A factory to create WebAPIRequestError objects
 * @param original - original error
 * @param attachOriginal - config indicating if 'original' property should be added on the error object
 */
function requestErrorWithOriginal(original, attachOriginal) {
    const error = errorWithCode(new Error(`A request error occurred: ${original.message}`), ErrorCode.RequestError);
    if (attachOriginal) {
        error.original = original;
    }
    return error;
}
/**
 * A factory to create WebAPIHTTPError objects
 * @param response - original error
 */
function httpErrorFromResponse(response) {
    const error = errorWithCode(new Error(`An HTTP protocol error occurred: statusCode = ${response.status}`), ErrorCode.HTTPError);
    error.statusCode = response.status;
    error.statusMessage = response.statusText;
    const nonNullHeaders = {};
    for (const k of Object.keys(response.headers)) {
        if (k && response.headers[k]) {
            nonNullHeaders[k] = response.headers[k];
        }
    }
    error.headers = nonNullHeaders;
    error.body = response.data;
    return error;
}
/**
 * A factory to create WebAPIPlatformError objects
 * @param result - Web API call result
 */
function platformErrorFromResult(result) {
    const error = errorWithCode(new Error(`An API error occurred: ${result.error}`), ErrorCode.PlatformError);
    error.data = result;
    return error;
}
/**
 * A factory to create WebAPIRateLimitedError objects
 * @param retrySec - Number of seconds that the request can be retried in
 */
function rateLimitedErrorWithDelay(retrySec) {
    const error = errorWithCode(new Error(`A rate-limit has been reached, you may retry this request in ${retrySec} seconds`), ErrorCode.RateLimitedError);
    error.retryAfter = retrySec;
    return error;
}
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ 2577:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getFileUploadJob = getFileUploadJob;
exports.getMultipleFileUploadJobs = getMultipleFileUploadJobs;
exports.getFileData = getFileData;
exports.getFileDataLength = getFileDataLength;
exports.getFileDataAsStream = getFileDataAsStream;
exports.getAllFileUploadsToComplete = getAllFileUploadsToComplete;
exports.warnIfNotUsingFilesUploadV2 = warnIfNotUsingFilesUploadV2;
exports.warnIfChannels = warnIfChannels;
exports.errorIfChannelsCsv = errorIfChannelsCsv;
exports.errorIfInvalidOrMissingFileData = errorIfInvalidOrMissingFileData;
exports.warnIfMissingOrInvalidFileNameAndDefault = warnIfMissingOrInvalidFileNameAndDefault;
exports.warnIfLegacyFileType = warnIfLegacyFileType;
exports.buildMissingFileIdError = buildMissingFileIdError;
exports.buildFileSizeErrorMsg = buildFileSizeErrorMsg;
exports.buildLegacyFileTypeWarning = buildLegacyFileTypeWarning;
exports.buildMissingFileNameWarning = buildMissingFileNameWarning;
exports.buildMissingExtensionWarning = buildMissingExtensionWarning;
exports.buildLegacyMethodWarning = buildLegacyMethodWarning;
exports.buildGeneralFilesUploadWarning = buildGeneralFilesUploadWarning;
exports.buildFilesUploadMissingMessage = buildFilesUploadMissingMessage;
exports.buildChannelsWarning = buildChannelsWarning;
exports.buildMultipleChannelsErrorMsg = buildMultipleChannelsErrorMsg;
exports.buildInvalidFilesUploadParamError = buildInvalidFilesUploadParamError;
const node_fs_1 = __webpack_require__(3024);
const node_stream_1 = __webpack_require__(7075);
const errors_1 = __webpack_require__(8486);
function getFileUploadJob(options, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        // Validate parameters
        warnIfLegacyFileType(options, logger);
        warnIfChannels(options, logger);
        errorIfChannelsCsv(options);
        const fileName = warnIfMissingOrInvalidFileNameAndDefault(options, logger);
        const fileData = yield getFileData(options);
        const fileDataBytesLength = getFileDataLength(fileData);
        const fileUploadJob = {
            // supplied by user
            alt_text: options.alt_text,
            channel_id: (_a = options.channels) !== null && _a !== void 0 ? _a : options.channel_id,
            filename: (_b = options.filename) !== null && _b !== void 0 ? _b : fileName,
            initial_comment: options.initial_comment,
            snippet_type: options.snippet_type,
            title: (_d = (_c = options.title) !== null && _c !== void 0 ? _c : options.filename) !== null && _d !== void 0 ? _d : fileName, // default title to filename unless otherwise specified
            // calculated
            data: fileData,
            length: fileDataBytesLength,
        };
        if ('thread_ts' in options) {
            fileUploadJob.thread_ts = options.thread_ts;
        }
        if ('token' in options) {
            fileUploadJob.token = options.token;
        }
        if ('content' in options) {
            return Object.assign({ content: options.content }, fileUploadJob);
        }
        if ('file' in options) {
            return Object.assign({ file: options.file }, fileUploadJob);
        }
        throw (0, errors_1.errorWithCode)(new Error('Either a file or content field is required for valid file upload. You must supply one'), errors_1.ErrorCode.FileUploadInvalidArgumentsError);
    });
}
/**
 * Returns an array of files upload entries when `file_uploads` is supplied.
 * **Note**
 * file_uploads should be set when multiple files are intended to be attached to a
 * single message. To support this, we handle options supplied with
 * top level `initial_comment`, `thread_ts`, `channel_id` and `file_uploads` parameters.
 * ```javascript
 * const res = await client.files.uploadV2({
 *   initial_comment: 'Here are the files!',
 *   thread_ts: '1223313423434.131321',
 *   channel_id: 'C12345',
 *   file_uploads: [
 *     {
 *       file: './test/fixtures/test-txt.txt',
 *       filename: 'test-txt.txt',
 *     },
 *     {
 *       file: './test/fixtures/test-png.png',
 *       filename: 'test-png.png',
 *     },
 *   ],
 * });
 * ```
 * @param options provided by user
 */
function getMultipleFileUploadJobs(options, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        if ('file_uploads' in options) {
            // go through each file_upload and create a job for it
            return Promise.all(options.file_uploads.map((upload) => {
                // ensure no omitted properties included in files_upload entry
                // these properties are valid only at the top-level, not
                // inside file_uploads.
                const { channel_id, channels, initial_comment, thread_ts } = upload;
                if (channel_id || channels || initial_comment || thread_ts) {
                    throw (0, errors_1.errorWithCode)(new Error(buildInvalidFilesUploadParamError()), errors_1.ErrorCode.FileUploadInvalidArgumentsError);
                }
                // takes any channel_id, initial_comment and thread_ts
                // supplied at the top level.
                const uploadJobArgs = Object.assign(Object.assign({}, upload), { channels: options.channels, channel_id: options.channel_id, initial_comment: options.initial_comment });
                if ('thread_ts' in options) {
                    uploadJobArgs.thread_ts = options.thread_ts;
                }
                if ('token' in options) {
                    uploadJobArgs.token = options.token;
                }
                if ('content' in upload) {
                    return getFileUploadJob(Object.assign({ content: upload.content }, uploadJobArgs), logger);
                }
                if ('file' in upload) {
                    return getFileUploadJob(Object.assign({ file: upload.file }, uploadJobArgs), logger);
                }
                throw (0, errors_1.errorWithCode)(new Error('Either a file or content field is required for valid file upload. You must supply one'), errors_1.ErrorCode.FileUploadInvalidArgumentsError);
            }));
        }
        throw new Error(buildFilesUploadMissingMessage());
    });
}
// Helpers to build the FileUploadJob
/**
 * Returns a single file upload's data
 * @param options
 * @returns Binary data representation of file
 */
function getFileData(options) {
    return __awaiter(this, void 0, void 0, function* () {
        errorIfInvalidOrMissingFileData(options);
        if ('file' in options) {
            const { file } = options;
            // try to handle as buffer
            if (Buffer.isBuffer(file))
                return file;
            // try to handle as filepath
            if (typeof file === 'string') {
                // try to read file as if the string was a file path
                try {
                    const dataBuffer = (0, node_fs_1.readFileSync)(file);
                    return dataBuffer;
                }
                catch (error) {
                    throw (0, errors_1.errorWithCode)(new Error(`Unable to resolve file data for ${file}. Please supply a filepath string, or binary data Buffer or String directly.`), errors_1.ErrorCode.FileUploadInvalidArgumentsError);
                }
            }
            // try to handle as Readable
            const data = yield getFileDataAsStream(file);
            if (data)
                return data;
        }
        if ('content' in options)
            return Buffer.from(options.content);
        // general catch-all error
        throw (0, errors_1.errorWithCode)(new Error('There was an issue getting the file data for the file or content supplied'), errors_1.ErrorCode.FileUploadReadFileDataError);
    });
}
function getFileDataLength(data) {
    if (data) {
        return Buffer.byteLength(data, 'utf8');
    }
    throw (0, errors_1.errorWithCode)(new Error(buildFileSizeErrorMsg()), errors_1.ErrorCode.FileUploadReadFileDataError);
}
function getFileDataAsStream(readable) {
    return __awaiter(this, void 0, void 0, function* () {
        const chunks = [];
        return new Promise((resolve, reject) => {
            readable.on('readable', () => {
                let chunk = readable.read();
                while (chunk !== null) {
                    chunks.push(chunk);
                    chunk = readable.read();
                }
            });
            readable.on('end', () => {
                if (chunks.length > 0) {
                    const content = Buffer.concat(chunks);
                    resolve(content);
                }
                else {
                    reject(Error('No data in supplied file'));
                }
            });
        });
    });
}
/**
 * Filters through all fileUploads and groups them into jobs for completion
 * based on combination of channel_id, thread_ts, initial_comment.
 * {@link https://api.slack.com/methods/files.completeUploadExternal files.completeUploadExternal} allows for multiple
 * files to be uploaded with a message (`initial_comment`), and as a threaded message (`thread_ts`)
 * In order to be grouped together, file uploads must have like properties.
 * @param fileUploads
 * @returns
 */
function getAllFileUploadsToComplete(fileUploads) {
    const toComplete = {};
    for (const upload of fileUploads) {
        const { channel_id, thread_ts, initial_comment, file_id, title } = upload;
        if (file_id) {
            const compareString = `:::${channel_id}:::${thread_ts}:::${initial_comment}`;
            if (!Object.prototype.hasOwnProperty.call(toComplete, compareString)) {
                toComplete[compareString] = {
                    files: [{ id: file_id, title }],
                    channel_id,
                    initial_comment,
                };
                if (thread_ts && channel_id) {
                    const fileThreadDestinationArgument = {
                        channel_id,
                        thread_ts,
                    };
                    toComplete[compareString] = Object.assign(Object.assign({}, toComplete[compareString]), fileThreadDestinationArgument);
                }
                if ('token' in upload) {
                    toComplete[compareString].token = upload.token;
                }
            }
            else {
                toComplete[compareString].files.push({
                    id: file_id,
                    title,
                });
            }
        }
        else {
            throw new Error(buildMissingFileIdError());
        }
    }
    return toComplete;
}
// Validation
/**
 * Advise to use the files.uploadV2 method over legacy files.upload method and over
 * lower-level utilities.
 * @param method
 * @param logger
 */
function warnIfNotUsingFilesUploadV2(method, logger) {
    const targetMethods = ['files.upload'];
    const isTargetMethod = targetMethods.includes(method);
    if (method === 'files.upload')
        logger.warn(buildLegacyMethodWarning(method));
    if (isTargetMethod)
        logger.info(buildGeneralFilesUploadWarning());
}
/**
 * `channels` param is supported but only when a single channel is specified.
 * @param options
 * @param logger
 */
function warnIfChannels(options, logger) {
    if (options.channels)
        logger.warn(buildChannelsWarning());
}
/**
 * v1 files.upload supported `channels` parameter provided as a comma-separated
 * string of values, e.g. 'C1234,C5678'. V2 no longer supports this csv value.
 * You may still supply `channels` with a single channel string value e.g. 'C1234'
 * but it is highly encouraged to supply `channel_id` instead.
 * @param options
 */
function errorIfChannelsCsv(options) {
    const channels = options.channels ? options.channels.split(',') : [];
    if (channels.length > 1) {
        throw (0, errors_1.errorWithCode)(new Error(buildMultipleChannelsErrorMsg()), errors_1.ErrorCode.FileUploadInvalidArgumentsError);
    }
}
/**
 * Checks for either a file or content property and errors if missing
 * @param options
 */
function errorIfInvalidOrMissingFileData(options) {
    const hasFile = 'file' in options;
    const hasContent = 'content' in options;
    if (!(hasFile || hasContent) || (hasFile && hasContent)) {
        throw (0, errors_1.errorWithCode)(new Error('Either a file or content field is required for valid file upload. You cannot supply both'), errors_1.ErrorCode.FileUploadInvalidArgumentsError);
    }
    if ('file' in options) {
        const { file } = options;
        if (file && !(typeof file === 'string' || Buffer.isBuffer(file) || file instanceof node_stream_1.Readable)) {
            throw (0, errors_1.errorWithCode)(new Error('file must be a valid string path, buffer or Readable'), errors_1.ErrorCode.FileUploadInvalidArgumentsError);
        }
    }
    if ('content' in options && options.content && typeof options.content !== 'string') {
        throw (0, errors_1.errorWithCode)(new Error('content must be a string'), errors_1.ErrorCode.FileUploadInvalidArgumentsError);
    }
}
/**
 * @param options
 * @param logger
 * @returns filename if it exists
 */
function warnIfMissingOrInvalidFileNameAndDefault(options, logger) {
    var _a;
    const DEFAULT_FILETYPE = 'txt';
    const DEFAULT_FILENAME = `file.${(_a = options.filetype) !== null && _a !== void 0 ? _a : DEFAULT_FILETYPE}`;
    const { filename } = options;
    if (!filename) {
        // Filename was an optional property in legacy method
        logger.warn(buildMissingFileNameWarning());
        return DEFAULT_FILENAME;
    }
    if (filename.split('.').length < 2) {
        // likely filename is missing extension
        logger.warn(buildMissingExtensionWarning(filename));
    }
    return filename;
}
/**
 * `filetype` param is no longer supported and will be ignored
 * @param options
 * @param logger
 */
function warnIfLegacyFileType(options, logger) {
    if (options.filetype) {
        logger.warn(buildLegacyFileTypeWarning());
    }
}
// Validation message utilities
function buildMissingFileIdError() {
    return 'Missing required file id for file upload completion';
}
function buildFileSizeErrorMsg() {
    return 'There was an issue calculating the size of your file';
}
function buildLegacyFileTypeWarning() {
    return ('filetype is no longer a supported field in files.uploadV2.' +
        ' \nPlease remove this field. To indicate file type, please do so via the required filename property' +
        ' using the appropriate file extension, e.g. image.png, text.txt');
}
function buildMissingFileNameWarning() {
    return ('filename is a required field for files.uploadV2. \n For backwards compatibility and ease of migration, ' +
        'defaulting the filename. For best experience and consistent unfurl behavior, you' +
        ' should set the filename property with correct file extension, e.g. image.png, text.txt');
}
function buildMissingExtensionWarning(filename) {
    return `filename supplied '${filename}' may be missing a proper extension. Missing extenions may result in unexpected unfurl behavior when shared`;
}
function buildLegacyMethodWarning(method) {
    return `${method} may cause some issues like timeouts for relatively large files.`;
}
function buildGeneralFilesUploadWarning() {
    return ('Our latest recommendation is to use client.files.uploadV2() method, ' +
        'which is mostly compatible and much stabler, instead.');
}
function buildFilesUploadMissingMessage() {
    return 'Something went wrong with processing file_uploads';
}
function buildChannelsWarning() {
    return ("Although the 'channels' parameter is still supported for smoother migration from legacy files.upload, " +
        "we recommend using the new channel_id parameter with a single str value instead (e.g. 'C12345').");
}
function buildMultipleChannelsErrorMsg() {
    return 'Sharing files with multiple channels is no longer supported in v2. Share files in each channel separately instead.';
}
function buildInvalidFilesUploadParamError() {
    return ('You may supply file_uploads only for a single channel, comment, thread respectively. ' +
        'Therefore, please supply any channel_id, initial_comment, thread_ts in the top-layer.');
}
//# sourceMappingURL=file-upload.js.map

/***/ }),

/***/ 4060:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = delay;
/**
 * Build a Promise that will resolve after the specified number of milliseconds.
 * @param ms milliseconds to wait
 * @param value value for eventual resolution
 */
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
//# sourceMappingURL=helpers.js.map

/***/ }),

/***/ 5105:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/// <reference lib="es2017" />
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addAppMetadata = exports.retryPolicies = exports.ErrorCode = exports.LogLevel = exports.WebClientEvent = exports.WebClient = void 0;
var WebClient_1 = __webpack_require__(4048);
Object.defineProperty(exports, "WebClient", ({ enumerable: true, get: function () { return WebClient_1.WebClient; } }));
Object.defineProperty(exports, "WebClientEvent", ({ enumerable: true, get: function () { return WebClient_1.WebClientEvent; } }));
var logger_1 = __webpack_require__(4385);
Object.defineProperty(exports, "LogLevel", ({ enumerable: true, get: function () { return logger_1.LogLevel; } }));
var errors_1 = __webpack_require__(8486);
Object.defineProperty(exports, "ErrorCode", ({ enumerable: true, get: function () { return errors_1.ErrorCode; } }));
var retry_policies_1 = __webpack_require__(1766);
Object.defineProperty(exports, "retryPolicies", ({ enumerable: true, get: function () { return __importDefault(retry_policies_1).default; } }));
var instrument_1 = __webpack_require__(9224);
Object.defineProperty(exports, "addAppMetadata", ({ enumerable: true, get: function () { return instrument_1.addAppMetadata; } }));
__exportStar(__webpack_require__(9339), exports);
__exportStar(__webpack_require__(381), exports);
__exportStar(__webpack_require__(5591), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9224:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addAppMetadata = addAppMetadata;
exports.getUserAgent = getUserAgent;
const os = __importStar(__webpack_require__(8161));
const node_path_1 = __webpack_require__(6760);
const packageJson = __webpack_require__(6734);
/**
 * Replaces occurrences of '/' with ':' in a string, since '/' is meaningful inside User-Agent strings as a separator.
 */
function replaceSlashes(s) {
    return s.replace('/', ':');
}
// TODO: for the deno build (see the `npm run build:deno` npm run script), we could replace the `os-browserify` npm
// module shim with our own shim leveraging the deno beta compatibility layer for node's `os` module (for more info
// see https://deno.land/std@0.116.0/node/os.ts). At the time of writing this TODO (2021/11/25), this required deno
// v1.16.2 and use of the --unstable flag. Once support for this exists without the --unstable flag, we can improve
// the `os` module deno shim to correctly report operating system from a deno runtime. Until then, the below `os`-
// based code will report "browser/undefined" from a deno runtime.
const baseUserAgent = `${replaceSlashes(packageJson.name)}/${packageJson.version} ` +
    `${(0, node_path_1.basename)(process.title)}/${process.version.replace('v', '')} ` +
    `${os.platform()}/${os.release()}`;
const appMetadata = {};
/**
 * Appends the app metadata into the User-Agent value
 * @param appMetadata.name - name of tool to be counted in instrumentation
 * @param appMetadata.version - version of tool to be counted in instrumentation
 */
function addAppMetadata({ name, version }) {
    appMetadata[replaceSlashes(name)] = version;
}
/**
 * Returns the current User-Agent value for instrumentation
 */
function getUserAgent() {
    const appIdentifier = Object.entries(appMetadata)
        .map(([name, version]) => `${name}/${version}`)
        .join(' ');
    // only prepend the appIdentifier when its not empty
    return (appIdentifier.length > 0 ? `${appIdentifier} ` : '') + baseUserAgent;
}
//# sourceMappingURL=instrument.js.map

/***/ }),

/***/ 4385:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogLevel = void 0;
exports.getLogger = getLogger;
const logger_1 = __webpack_require__(9234);
var logger_2 = __webpack_require__(9234);
Object.defineProperty(exports, "LogLevel", ({ enumerable: true, get: function () { return logger_2.LogLevel; } }));
let instanceCount = 0;
/**
 * INTERNAL interface for getting or creating a named Logger.
 */
function getLogger(name, level, existingLogger) {
    // Get a unique ID for the logger.
    const instanceId = instanceCount;
    instanceCount += 1;
    // Set up the logger.
    const logger = (() => {
        if (existingLogger !== undefined) {
            return existingLogger;
        }
        return new logger_1.ConsoleLogger();
    })();
    logger.setName(`web-api:${name}:${instanceId}`);
    if (level !== undefined) {
        logger.setLevel(level);
    }
    return logger;
}
//# sourceMappingURL=logger.js.map

/***/ }),

/***/ 9339:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Methods = void 0;
const eventemitter3_1 = __webpack_require__(2415);
const WebClient_1 = __webpack_require__(4048);
/**
 * Binds a certain `method` and its (required) arguments and result types to the `apiCall` method in `WebClient`.
 */
function bindApiCall(self, method) {
    const apiMethod = self.apiCall.bind(self, method);
    return apiMethod;
}
/**
 * Binds a certain `method` and its (required) arguments and result types to the `apiCall` method in `WebClient`.
 */
function bindApiCallWithOptionalArgument(self, method) {
    const apiMethod = self.apiCall.bind(self, method);
    return apiMethod;
}
function bindFilesUploadV2(self) {
    return self.filesUploadV2.bind(self);
}
/**
 * A class that defines all Web API methods, their arguments type, their response type, and binds those methods to the
 * `apiCall` class method.
 */
class Methods extends eventemitter3_1.EventEmitter {
    constructor() {
        super();
        this.admin = {
            analytics: {
                /**
                 * @description Retrieve analytics data for a given date, presented as a compressed JSON file.
                 * @see {@link https://api.slack.com/methods/api.test `api.test` API reference}.
                 */
                getFile: bindApiCall(this, 'admin.analytics.getFile'),
            },
            apps: {
                activities: {
                    /**
                     * @description Get logs for a specified team/org.
                     * @see {@link https://api.slack.com/methods/admin.apps.activities.list `admin.apps.activities.list` API reference}.
                     */
                    list: bindApiCallWithOptionalArgument(this, 'admin.apps.activities.list'),
                },
                /**
                 * @description Approve an app for installation on a workspace.
                 * @see {@link https://api.slack.com/methods/admin.apps.approve `admin.apps.approve` API reference}.
                 */
                approve: bindApiCall(this, 'admin.apps.approve'),
                approved: {
                    /**
                     * @description List approved apps for an org or workspace.
                     * @see {@link https://api.slack.com/methods/admin.apps.approved.list `admin.apps.approved.list` API reference}.
                     */
                    list: bindApiCall(this, 'admin.apps.approved.list'),
                },
                /**
                 * @description Clear an app resolution.
                 * @see {@link https://api.slack.com/methods/admin.apps.clearResolution `admin.apps.clearResolution` API reference}.
                 */
                clearResolution: bindApiCall(this, 'admin.apps.clearResolution'),
                config: {
                    /**
                     * @description Look up the app config for connectors by their IDs.
                     * @see {@link https://api.slack.com/methods/admin.apps.config.lookup `admin.apps.config.lookup` API reference}.
                     */
                    lookup: bindApiCall(this, 'admin.apps.config.lookup'),
                    /**
                     * @description Set the app config for a connector.
                     * @see {@link https://api.slack.com/methods/admin.apps.config.set `admin.apps.config.set` API reference}.
                     */
                    set: bindApiCall(this, 'admin.apps.config.set'),
                },
                requests: {
                    /**
                     * @description Cancel app request for team.
                     * @see {@link https://api.slack.com/methods/admin.apps.requests.cancel `admin.apps.requests.cancel` API reference}.
                     */
                    cancel: bindApiCall(this, 'admin.apps.requests.cancel'),
                    /**
                     * @description List app requests for a team/workspace.
                     * @see {@link https://api.slack.com/methods/admin.apps.requests.list `admin.apps.requests.list` API reference}.
                     */
                    list: bindApiCall(this, 'admin.apps.requests.list'),
                },
                /**
                 * @description Restrict an app for installation on a workspace.
                 * @see {@link https://api.slack.com/methods/admin.apps.restrict `admin.apps.restrict` API reference}.
                 */
                restrict: bindApiCall(this, 'admin.apps.restrict'),
                restricted: {
                    /**
                     * @description List restricted apps for an org or workspace.
                     * @see {@link https://api.slack.com/methods/admin.apps.restricted.list `admin.apps.restricted.list` API reference}.
                     */
                    list: bindApiCall(this, 'admin.apps.restricted.list'),
                },
                /**
                 * @description Uninstall an app from one or many workspaces, or an entire enterprise organization.
                 * @see {@link https://api.slack.com/methods/admin.apps.uninstall `admin.apps.uninstall` API reference}.
                 */
                uninstall: bindApiCall(this, 'admin.apps.uninstall'),
            },
            auth: {
                policy: {
                    /**
                     * @description Assign entities to a particular authentication policy.
                     * @see {@link https://api.slack.com/methods/admin.auth.policy.assignEntities `admin.auth.policy.assignEntities` API reference}.
                     */
                    assignEntities: bindApiCall(this, 'admin.auth.policy.assignEntities'),
                    /**
                     * @description Fetch all the entities assigned to a particular authentication policy by name.
                     * @see {@link https://api.slack.com/methods/admin.auth.policy.getEntities `admin.auth.policy.getEntities` API reference}.
                     */
                    getEntities: bindApiCall(this, 'admin.auth.policy.getEntities'),
                    /**
                     * @description Remove specified entities from a specified authentication policy.
                     * @see {@link https://api.slack.com/methods/admin.auth.policy.removeEntities `admin.auth.policy.removeEntities` API reference}.
                     */
                    removeEntities: bindApiCall(this, 'admin.auth.policy.removeEntities'),
                },
            },
            barriers: {
                /**
                 * @description Create an Information Barrier.
                 * @see {@link https://api.slack.com/methods/admin.barriers.create `admin.barriers.create` API reference}.
                 */
                create: bindApiCall(this, 'admin.barriers.create'),
                /**
                 * @description Delete an existing Information Barrier.
                 * @see {@link https://api.slack.com/methods/admin.barriers.delete `admin.barriers.delete` API reference}.
                 */
                delete: bindApiCall(this, 'admin.barriers.delete'),
                /**
                 * @description Get all Information Barriers for your organization.
                 * @see {@link https://api.slack.com/methods/admin.barriers.list `admin.barriers.list` API reference}.
                 */
                list: bindApiCallWithOptionalArgument(this, 'admin.barriers.list'),
                /**
                 * @description Update an existing Information Barrier.
                 * @see {@link https://api.slack.com/methods/admin.barriers.update `admin.barriers.update` API reference}.
                 */
                update: bindApiCall(this, 'admin.barriers.update'),
            },
            conversations: {
                /**
                 * @description Archive a public or private channel.
                 * @see {@link https://api.slack.com/methods/admin.conversations.archive `admin.conversations.archive` API reference}.
                 */
                archive: bindApiCall(this, 'admin.conversations.archive'),
                /**
                 * @description Archive public or private channels in bulk.
                 * @see {@link https://api.slack.com/methods/admin.conversations.bulkArchive `admin.conversations.bulkArchive` API reference}.
                 */
                bulkArchive: bindApiCall(this, 'admin.conversations.bulkArchive'),
                /**
                 * @description Delete public or private channels in bulk.
                 * @see {@link https://api.slack.com/methods/admin.conversations.bulkDelet `admin.conversations.bulkDelete` API reference}.
                 */
                bulkDelete: bindApiCall(this, 'admin.conversations.bulkDelete'),
                /**
                 * @description Move public or private channels in bulk.
                 * @see {@link https://api.slack.com/methods/admin.conversations.bulkMove `admin.conversations.bulkMove` API reference}.
                 */
                bulkMove: bindApiCall(this, 'admin.conversations.bulkMove'),
                /**
                 * @description Convert a public channel to a private channel.
                 * @see {@link https://api.slack.com/methods/admin.conversations.convertToPrivate `admin.conversations.convertToPrivate` API reference}.
                 */
                convertToPrivate: bindApiCall(this, 'admin.conversations.convertToPrivate'),
                /**
                 * @description Convert a private channel to a public channel.
                 * @see {@link https://api.slack.com/methods/admin.conversations.convertToPublic `admin.conversations.convertToPublic` API reference}.
                 */
                convertToPublic: bindApiCall(this, 'admin.conversations.convertToPublic'),
                /**
                 * @description Create a public or private channel-based conversation.
                 * @see {@link https://api.slack.com/methods/admin.conversations.create `admin.conversations.create` API reference}.
                 */
                create: bindApiCall(this, 'admin.conversations.create'),
                /**
                 * @description Delete a public or private channel.
                 * @see {@link https://api.slack.com/methods/admin.conversations.delete `admin.conversations.delete` API reference}.
                 */
                delete: bindApiCall(this, 'admin.conversations.delete'),
                /**
                 * @description Disconnect a connected channel from one or more workspaces.
                 * @see {@link https://api.slack.com/methods/admin.conversations.disconnectShared `admin.conversations.disconnectShared` API reference}.
                 */
                disconnectShared: bindApiCall(this, 'admin.conversations.disconnectShared'),
                ekm: {
                    /**
                     * @description List all disconnected channels — i.e., channels that were once connected to other workspaces
                     * and then disconnected — and the corresponding original channel IDs for key revocation with EKM.
                     * @see {@link https://api.slack.com/methods/admin.conversations.ekm.listOriginalConnectedChannelInfo `admin.conversations.ekm.listOriginalConnectedChannelInfo` API reference}.
                     */
                    listOriginalConnectedChannelInfo: bindApiCallWithOptionalArgument(this, 'admin.conversations.ekm.listOriginalConnectedChannelInfo'),
                },
                /**
                 * @description Get conversation preferences for a public or private channel.
                 * @see {@link https://api.slack.com/methods/admin.conversations.getConversationPrefs `admin.conversations.getConversationPrefs` API reference}.
                 */
                getConversationPrefs: bindApiCall(this, 'admin.conversations.getConversationPrefs'),
                /**
                 * @description Get a conversation's retention policy.
                 * @see {@link https://api.slack.com/methods/admin.conversations.getCustomRetention `admin.conversations.getCustomRetention` API reference}.
                 */
                getCustomRetention: bindApiCall(this, 'admin.conversations.getCustomRetention'),
                /**
                 * @description Get all the workspaces a given public or private channel is connected to within
                 * this Enterprise org.
                 * @see {@link https://api.slack.com/methods/admin.conversations.getTeams `admin.conversations.getTeams` API reference}.
                 */
                getTeams: bindApiCall(this, 'admin.conversations.getTeams'),
                /**
                 * @description Invite a user to a public or private channel.
                 * @see {@link https://api.slack.com/methods/admin.conversations.invite `admin.conversations.invite` API reference}.
                 */
                invite: bindApiCall(this, 'admin.conversations.invite'),
                /**
                 * @description Returns channels on the given team using the filters.
                 * @see {@link https://api.slack.com/methods/admin.conversations.lookup `admin.conversations.lookup` API reference}.
                 */
                lookup: bindApiCall(this, 'admin.conversations.lookup'),
                /**
                 * @description Remove a conversation's retention policy.
                 * @see {@link https://api.slack.com/methods/admin.conversations.removeCustomRetention `admin.conversations.removeCustomRetention` API reference}.
                 */
                removeCustomRetention: bindApiCall(this, 'admin.conversations.removeCustomRetention'),
                /**
                 * @description Rename a public or private channel.
                 * @see {@link https://api.slack.com/methods/admin.conversations.rename `admin.conversations.rename` API reference}.
                 */
                rename: bindApiCall(this, 'admin.conversations.rename'),
                restrictAccess: {
                    /**
                     * @description Add an allowlist of IDP groups for accessing a channel.
                     * @see {@link https://api.slack.com/methods/admin.conversations.restrictAccess.addGroup `admin.conversations.restrictAccess.addGroup` API reference}.
                     */
                    addGroup: bindApiCall(this, 'admin.conversations.restrictAccess.addGroup'),
                    /**
                     * @description List all IDP Groups linked to a channel.
                     * @see {@link https://api.slack.com/methods/admin.conversations.restrictAccess.listGroups `admin.conversations.restrictAccess.listGroups` API reference}.
                     */
                    listGroups: bindApiCall(this, 'admin.conversations.restrictAccess.listGroups'),
                    /**
                     * @description Remove a linked IDP group linked from a private channel.
                     * @see {@link https://api.slack.com/methods/admin.conversations.restrictAccess.removeGroup `admin.conversations.restrictAccess.removeGroup` API reference}.
                     */
                    removeGroup: bindApiCall(this, 'admin.conversations.restrictAccess.removeGroup'),
                },
                /**
                 * @description Search for public or private channels in an Enterprise organization.
                 * @see {@link https://api.slack.com/methods/admin.conversations.search `admin.conversations.search` API reference}.
                 */
                search: bindApiCallWithOptionalArgument(this, 'admin.conversations.search'),
                /**
                 * @description Set the posting permissions for a public or private channel.
                 * @see {@link https://api.slack.com/methods/admin.conversations.setConversationPrefs `admin.conversations.setConversationPrefs` API reference}.
                 */
                setConversationPrefs: bindApiCall(this, 'admin.conversations.setConversationPrefs'),
                /**
                 * @description Set a conversation's retention policy.
                 * @see {@link https://api.slack.com/methods/admin.conversations.setCustomRetention `admin.conversations.setCustomRetention` API reference}.
                 */
                setCustomRetention: bindApiCall(this, 'admin.conversations.setCustomRetention'),
                /**
                 * @description Set the workspaces in an Enterprise grid org that connect to a public or private channel.
                 * @see {@link https://api.slack.com/methods/admin.conversations.setTeams `admin.conversations.setTeams` API reference}.
                 */
                setTeams: bindApiCall(this, 'admin.conversations.setTeams'),
                /**
                 * @description Unarchive a public or private channel.
                 * @see {@link https://api.slack.com/methods/admin.conversations.unarchive `admin.conversations.unarchive` API reference}.
                 */
                unarchive: bindApiCall(this, 'admin.conversations.unarchive'),
            },
            emoji: {
                /**
                 * @description Add an emoji.
                 * @see {@link https://api.slack.com/methods/admin.emoji.add `admin.emoji.add` API reference}.
                 */
                add: bindApiCall(this, 'admin.emoji.add'),
                /**
                 * @description Add an emoji alias.
                 * @see {@link https://api.slack.com/methods/admin.emoji.addAlias `admin.emoji.addAlias` API reference}.
                 */
                addAlias: bindApiCall(this, 'admin.emoji.addAlias'),
                /**
                 * @description List emoji for an Enterprise Grid organization.
                 * @see {@link https://api.slack.com/methods/admin.emoji.list `admin.emoji.list` API reference}.
                 */
                list: bindApiCallWithOptionalArgument(this, 'admin.emoji.list'),
                /**
                 * @description Remove an emoji across an Enterprise Grid organization.
                 * @see {@link https://api.slack.com/methods/admin.emoji.remove `admin.emoji.remove` API reference}.
                 */
                remove: bindApiCall(this, 'admin.emoji.remove'),
                /**
                 * @description Rename an emoji.
                 * @see {@link https://api.slack.com/methods/admin.emoji.rename `admin.emoji.rename` API reference}.
                 */
                rename: bindApiCall(this, 'admin.emoji.rename'),
            },
            functions: {
                /**
                 * @description Look up functions by a set of apps.
                 * @see {@link https://api.slack.com/methods/admin.functions.list `admin.functions.list` API reference}.
                 */
                list: bindApiCall(this, 'admin.functions.list'),
                permissions: {
                    /**
                     * @description Lookup the visibility of multiple Slack functions and include the users if
                     * it is limited to particular named entities.
                     * @see {@link https://api.slack.com/methods/admin.functions.permissions.lookup `admin.functions.permissions.lookup` API reference}.
                     */
                    lookup: bindApiCall(this, 'admin.functions.permissions.lookup'),
                    /**
                     * @description Set the visibility of a Slack function and define the users or workspaces if
                     * it is set to named_entities.
                     * @see {@link https://api.slack.com/methods/admin.functions.permissions.set `admin.functions.permissions.set` API reference}.
                     */
                    set: bindApiCall(this, 'admin.functions.permissions.set'),
                },
            },
            inviteRequests: {
                /**
                 * @description Approve a workspace invite request.
                 * @see {@link https://api.slack.com/methods/admin.inviteRequests.approve `admin.inviteRequests.approve` API reference}.
                 */
                approve: bindApiCall(this, 'admin.inviteRequests.approve'),
                approved: {
                    /**
                     * @description List all approved workspace invite requests.
                     * @see {@link https://api.slack.com/methods/admin.inviteRequests.approved.list `admin.inviteRequests.approved.list` API reference}.
                     */
                    list: bindApiCall(this, 'admin.inviteRequests.approved.list'),
                },
                denied: {
                    /**
                     * @description List all denied workspace invite requests.
                     * @see {@link https://api.slack.com/methods/admin.inviteRequests.denied.list `admin.inviteRequests.denied.list` API reference}.
                     */
                    list: bindApiCall(this, 'admin.inviteRequests.denied.list'),
                },
                /**
                 * @description Deny a workspace invite request.
                 * @see {@link https://api.slack.com/methods/admin.inviteRequests.deny `admin.inviteRequests.deny` API reference}.
                 */
                deny: bindApiCall(this, 'admin.inviteRequests.deny'),
                /**
                 * @description List all pending workspace invite requests.
                 * @see {@link https://api.slack.com/methods/admin.inviteRequests.list `admin.inviteRequests.list` API reference}.
                 */
                list: bindApiCall(this, 'admin.inviteRequests.list'),
            },
            roles: {
                /**
                 * @description Adds members to the specified role with the specified scopes.
                 * @see {@link https://api.slack.com/methods/admin.roles.addAssignments `admin.roles.addAssignments` API reference}.
                 */
                addAssignments: bindApiCall(this, 'admin.roles.addAssignments'),
                /**
                 * @description Lists assignments for all roles across entities.
                 * Options to scope results by any combination of roles or entities.
                 * @see {@link https://api.slack.com/methods/admin.roles.listAssignments `admin.roles.listAssignments` API reference}.
                 */
                listAssignments: bindApiCallWithOptionalArgument(this, 'admin.roles.listAssignments'),
                /**
                 * @description Removes a set of users from a role for the given scopes and entities.
                 * @see {@link https://api.slack.com/methods/admin.roles.removeAssignments `admin.roles.removeAssignments` API reference}.
                 */
                removeAssignments: bindApiCall(this, 'admin.roles.removeAssignments'),
            },
            teams: {
                admins: {
                    /**
                     * @description List all of the admins on a given workspace.
                     * @see {@link https://api.slack.com/methods/admin.teams.admins.list `admin.teams.admins.list` API reference}.
                     */
                    list: bindApiCall(this, 'admin.teams.admins.list'),
                },
                /**
                 * @description Create an Enterprise team.
                 * @see {@link https://api.slack.com/methods/admin.teams.create `admin.teams.create` API reference}.
                 */
                create: bindApiCall(this, 'admin.teams.create'),
                /**
                 * @description List all teams on an Enterprise organization.
                 * @see {@link https://api.slack.com/methods/admin.teams.list `admin.teams.list` API reference}.
                 */
                list: bindApiCallWithOptionalArgument(this, 'admin.teams.list'),
                owners: {
                    /**
                     * @description List all of the owners on a given workspace.
                     * @see {@link https://api.slack.com/methods/admin.teams.owners.list `admin.teams.owners.list` API reference}.
                     */
                    list: bindApiCall(this, 'admin.teams.owners.list'),
                },
                settings: {
                    /**
                     * @description Fetch information about settings in a workspace.
                     * @see {@link https://api.slack.com/methods/admin.teams.owners.list `admin.teams.owners.list` API reference}.
                     */
                    info: bindApiCall(this, 'admin.teams.settings.info'),
                    /**
                     * @description Set the default channels of a workspace.
                     * @see {@link https://api.slack.com/methods/admin.teams.settings.setDefaultChannels `admin.teams.settings.setDefaultChannels` API reference}.
                     */
                    setDefaultChannels: bindApiCall(this, 'admin.teams.settings.setDefaultChannels'),
                    /**
                     * @description Set the description of a given workspace.
                     * @see {@link https://api.slack.com/methods/admin.teams.settings.setDescription `admin.teams.settings.setDescription` API reference}.
                     */
                    setDescription: bindApiCall(this, 'admin.teams.settings.setDescription'),
                    /**
                     * @description Set the discoverability of a given workspace.
                     * @see {@link https://api.slack.com/methods/admin.teams.settings.setDiscoverability `admin.teams.settings.setDiscoverability` API reference}.
                     */
                    setDiscoverability: bindApiCall(this, 'admin.teams.settings.setDiscoverability'),
                    /**
                     * @description Sets the icon of a workspace.
                     * @see {@link https://api.slack.com/methods/admin.teams.settings.setIcon `admin.teams.settings.setIcon` API reference}.
                     */
                    setIcon: bindApiCall(this, 'admin.teams.settings.setIcon'),
                    /**
                     * @description Set the name of a given workspace.
                     * @see {@link https://api.slack.com/methods/admin.teams.settings.setName `admin.teams.settings.setName` API reference}.
                     */
                    setName: bindApiCall(this, 'admin.teams.settings.setName'),
                },
            },
            usergroups: {
                /**
                 * @description Add up to one hundred default channels to an IDP group.
                 * @see {@link https://api.slack.com/methods/admin.usergroups.addChannels `admin.teams.usergroups.addChannels` API reference}.
                 */
                addChannels: bindApiCall(this, 'admin.usergroups.addChannels'),
                /**
                 * @description Associate one or more default workspaces with an organization-wide IDP group.
                 * @see {@link https://api.slack.com/methods/admin.usergroups.addTeams `admin.teams.usergroups.addTeams` API reference}.
                 */
                addTeams: bindApiCall(this, 'admin.usergroups.addTeams'),
                /**
                 * @description List the channels linked to an org-level IDP group (user group).
                 * @see {@link https://api.slack.com/methods/admin.usergroups.listChannels `admin.teams.usergroups.listChannels` API reference}.
                 */
                listChannels: bindApiCall(this, 'admin.usergroups.listChannels'),
                /**
                 * @description Remove one or more default channels from an org-level IDP group (user group).
                 * @see {@link https://api.slack.com/methods/admin.usergroups.removeChannels `admin.teams.usergroups.removeChannels` API reference}.
                 */
                removeChannels: bindApiCall(this, 'admin.usergroups.removeChannels'),
            },
            users: {
                /**
                 * @description Add an Enterprise user to a workspace.
                 * @see {@link https://api.slack.com/methods/admin.users.assign `admin.users.assign` API reference}.
                 */
                assign: bindApiCall(this, 'admin.users.assign'),
                /**
                 * @description Invite a user to a workspace.
                 * @see {@link https://api.slack.com/methods/admin.users.invite `admin.users.invite` API reference}.
                 */
                invite: bindApiCall(this, 'admin.users.invite'),
                /**
                 * @description List users on a workspace.
                 * @see {@link https://api.slack.com/methods/admin.users.list `admin.users.list` API reference}.
                 */
                list: bindApiCallWithOptionalArgument(this, 'admin.users.list'),
                /**
                 * @description Remove a user from a workspace.
                 * @see {@link https://api.slack.com/methods/admin.users.remove `admin.users.remove` API reference}.
                 */
                remove: bindApiCall(this, 'admin.users.remove'),
                session: {
                    /**
                     * @description Clear user-specific session settings—the session duration and what happens when the client
                     * closes—for a list of users.
                     * @see {@link https://api.slack.com/methods/admin.users.session.clearSettings `admin.users.session.clearSettings` API reference}.
                     */
                    clearSettings: bindApiCall(this, 'admin.users.session.clearSettings'),
                    /**
                     * @description Get user-specific session settings—the session duration and what happens when the client
                     * closes—given a list of users.
                     * @see {@link https://api.slack.com/methods/admin.users.session.getSettings `admin.users.session.getSettings` API reference}.
                     */
                    getSettings: bindApiCall(this, 'admin.users.session.getSettings'),
                    /**
                     * @description Revoke a single session for a user. The user will be forced to login to Slack.
                     * @see {@link https://api.slack.com/methods/admin.users.session.invalidate `admin.users.session.invalidate` API reference}.
                     */
                    invalidate: bindApiCall(this, 'admin.users.session.invalidate'),
                    /**
                     * @description List active user sessions for an organization.
                     * @see {@link https://api.slack.com/methods/admin.users.session.list `admin.users.session.list` API reference}.
                     */
                    list: bindApiCallWithOptionalArgument(this, 'admin.users.session.list'),
                    /**
                     * @description Wipes all valid sessions on all devices for a given user.
                     * @see {@link https://api.slack.com/methods/admin.users.session.reset `admin.users.session.reset` API reference}.
                     */
                    reset: bindApiCall(this, 'admin.users.session.reset'),
                    /**
                     * @description Enqueues an asynchronous job to wipe all valid sessions on all devices for a given user list.
                     * @see {@link https://api.slack.com/methods/admin.users.session.resetBulk `admin.users.session.resetBulk` API reference}.
                     */
                    resetBulk: bindApiCall(this, 'admin.users.session.resetBulk'),
                    /**
                     * @description Configure the user-level session settings—the session duration and what happens when the client
                     * closes—for one or more users.
                     * @see {@link https://api.slack.com/methods/admin.users.session.setSettings `admin.users.session.setSettings` API reference}.
                     */
                    setSettings: bindApiCall(this, 'admin.users.session.setSettings'),
                },
                /**
                 * @description Set an existing guest, regular user, or owner to be an admin user.
                 * @see {@link https://api.slack.com/methods/admin.users.setAdmin `admin.users.setAdmin` API reference}.
                 */
                setAdmin: bindApiCall(this, 'admin.users.setAdmin'),
                /**
                 * @description Set an expiration for a guest user.
                 * @see {@link https://api.slack.com/methods/admin.users.setExpiration `admin.users.setExpiration` API reference}.
                 */
                setExpiration: bindApiCall(this, 'admin.users.setExpiration'),
                /**
                 * @description Set an existing guest, regular user, or admin user to be a workspace owner.
                 * @see {@link https://api.slack.com/methods/admin.users.setOwner `admin.users.setOwner` API reference}.
                 */
                setOwner: bindApiCall(this, 'admin.users.setOwner'),
                /**
                 * @description Set an existing guest user, admin user, or owner to be a regular user.
                 * @see {@link https://api.slack.com/methods/admin.users.setRegular `admin.users.setRegular` API reference}.
                 */
                setRegular: bindApiCall(this, 'admin.users.setRegular'),
                unsupportedVersions: {
                    /**
                     * @description Ask Slackbot to send you an export listing all workspace members using unsupported software,
                     * presented as a zipped CSV file.
                     * @see {@link https://api.slack.com/methods/admin.users.unsupportedVersions.export `admin.users.unsupportedVersions.export` API reference}.
                     */
                    export: bindApiCall(this, 'admin.users.unsupportedVersions.export'),
                },
            },
            workflows: {
                collaborators: {
                    /**
                     * @description Add collaborators to workflows within the team or enterprise.
                     * @see {@link https://api.slack.com/methods/admin.workflows.collaborators.add `admin.workflows.collaborators.add` API reference}.
                     */
                    add: bindApiCall(this, 'admin.workflows.collaborators.add'),
                    /**
                     * @description Remove collaborators from workflows within the team or enterprise.
                     * @see {@link https://api.slack.com/methods/admin.workflows.collaborators.remove `admin.workflows.collaborators.remove` API reference}.
                     */
                    remove: bindApiCall(this, 'admin.workflows.collaborators.remove'),
                },
                permissions: {
                    /**
                     * @description Look up the permissions for a set of workflows.
                     * @see {@link https://api.slack.com/methods/admin.workflows.permissions.lookup `admin.workflows.permissions.lookup` API reference}.
                     */
                    lookup: bindApiCall(this, 'admin.workflows.permissions.lookup'),
                },
                /**
                 * @description Search workflows within the team or enterprise.
                 * @see {@link https://api.slack.com/methods/admin.workflows.search `admin.workflows.search` API reference}.
                 */
                search: bindApiCallWithOptionalArgument(this, 'admin.workflows.search'),
                /**
                 * @description Unpublish workflows within the team or enterprise.
                 * @see {@link https://api.slack.com/methods/admin.workflows.unpublish `admin.workflows.unpublish` API reference}.
                 */
                unpublish: bindApiCall(this, 'admin.workflows.unpublish'),
            },
        };
        this.api = {
            /**
             * @description Checks API calling code.
             * @see {@link https://api.slack.com/methods/api.test `api.test` API reference}.
             */
            test: bindApiCallWithOptionalArgument(this, 'api.test'),
        };
        this.assistant = {
            threads: {
                /**
                 * @description Set loading status to indicate that the app is building a response.
                 * @see {@link https://api.slack.com/methods/assistant.threads.setStatus `assistant.threads.setStatus` API reference}.
                 */
                setStatus: bindApiCall(this, 'assistant.threads.setStatus'),
                /**
                 * @description Set suggested prompts for the user. Can suggest up to four prompts.
                 * @see {@link https://api.slack.com/methods/assistant.threads.setSuggestedPrompts `assistant.threads.setSuggestedPrompts` API reference}.
                 */
                setSuggestedPrompts: bindApiCall(this, 'assistant.threads.setSuggestedPrompts'),
                /**
                 * @description Set the title of the thread. This is shown when a user views the app's chat history.
                 * @see {@link https://api.slack.com/methods/assistant.threads.setTitle `assistant.threads.setTitle` API reference}.
                 */
                setTitle: bindApiCall(this, 'assistant.threads.setTitle'),
            },
        };
        this.apps = {
            connections: {
                /**
                 * @description Generate a temporary Socket Mode WebSocket URL that your app can connect to in order to receive
                 * events and interactive payloads over.
                 * @see {@link https://api.slack.com/methods/apps.connections.open `apps.connections.open` API reference}.
                 */
                open: bindApiCallWithOptionalArgument(this, 'apps.connections.open'),
            },
            event: {
                authorizations: {
                    /**
                     * @description Get a list of authorizations for the given event context.
                     * Each authorization represents an app installation that the event is visible to.
                     * @see {@link https://api.slack.com/methods/apps.event.authorizations.list `apps.event.authorizations.list` API reference}.
                     */
                    list: bindApiCall(this, 'apps.event.authorizations.list'),
                },
            },
            manifest: {
                /**
                 * @description Create an app from an app manifest.
                 * @see {@link https://api.slack.com/methods/apps.manifest.create `apps.manifest.create` API reference}.
                 */
                create: bindApiCall(this, 'apps.manifest.create'),
                /**
                 * @description Permanently deletes an app created through app manifests.
                 * @see {@link https://api.slack.com/methods/apps.manifest.delete `apps.manifest.delete` API reference}.
                 */
                delete: bindApiCall(this, 'apps.manifest.delete'),
                /**
                 * @description Export an app manifest from an existing app.
                 * @see {@link https://api.slack.com/methods/apps.manifest.export `apps.manifest.export` API reference}.
                 */
                export: bindApiCall(this, 'apps.manifest.export'),
                /**
                 * @description Update an app from an app manifest.
                 * @see {@link https://api.slack.com/methods/apps.manifest.update `apps.manifest.update` API reference}.
                 */
                update: bindApiCall(this, 'apps.manifest.update'),
                /**
                 * @description Validate an app manifest.
                 * @see {@link https://api.slack.com/methods/apps.manifest.validate `apps.manifest.validate` API reference}.
                 */
                validate: bindApiCall(this, 'apps.manifest.validate'),
            },
            /**
             * @description Uninstalls your app from a workspace.
             * @see {@link https://api.slack.com/methods/apps.uninstall `apps.uninstall` API reference}.
             */
            uninstall: bindApiCall(this, 'apps.uninstall'),
        };
        this.auth = {
            /**
             * @description Revokes a token.
             * @see {@link https://api.slack.com/methods/auth.revoke `auth.revoke` API reference}.
             */
            revoke: bindApiCallWithOptionalArgument(this, 'auth.revoke'),
            teams: {
                /**
                 * @description Obtain a full list of workspaces your org-wide app has been approved for.
                 * @see {@link https://api.slack.com/methods/auth.teams.list `auth.teams.list` API reference}.
                 */
                list: bindApiCallWithOptionalArgument(this, 'auth.teams.list'),
            },
            test: bindApiCallWithOptionalArgument(this, 'auth.test'),
        };
        this.bookmarks = {
            /**
             * @description Add bookmark to a channel.
             * @see {@link https://api.slack.com/methods/bookmarks.add `bookmarks.add` API reference}.
             */
            add: bindApiCall(this, 'bookmarks.add'),
            /**
             * @description Edit bookmark.
             * @see {@link https://api.slack.com/methods/bookmarks.edit `bookmarks.edit` API reference}.
             */
            edit: bindApiCall(this, 'bookmarks.edit'),
            /**
             * @description List bookmarks for a channel.
             * @see {@link https://api.slack.com/methods/bookmarks.list `bookmarks.list` API reference}.
             */
            list: bindApiCall(this, 'bookmarks.list'),
            /**
             * @description Remove bookmark from a channel.
             * @see {@link https://api.slack.com/methods/bookmarks.remove `bookmarks.remove` API reference}.
             */
            remove: bindApiCall(this, 'bookmarks.remove'),
        };
        this.bots = {
            /**
             * @description Gets information about a bot user.
             * @see {@link https://api.slack.com/methods/bots.info `bots.info` API reference}.
             */
            info: bindApiCallWithOptionalArgument(this, 'bots.info'),
        };
        this.calls = {
            /**
             * @description Registers a new Call.
             * @see {@link https://api.slack.com/methods/calls.add `calls.add` API reference}.
             */
            add: bindApiCall(this, 'calls.add'),
            /**
             * @description Ends a Call.
             * @see {@link https://api.slack.com/methods/calls.end `calls.end` API reference}.
             */
            end: bindApiCall(this, 'calls.end'),
            /**
             * @description Returns information about a Call.
             * @see {@link https://api.slack.com/methods/calls.info `calls.info` API reference}.
             */
            info: bindApiCall(this, 'calls.info'),
            /**
             * @description Updates information about a Call.
             * @see {@link https://api.slack.com/methods/calls.info `calls.info` API reference}.
             */
            update: bindApiCall(this, 'calls.update'),
            participants: {
                /**
                 * @description Registers new participants added to a Call.
                 * @see {@link https://api.slack.com/methods/calls.participants.add `calls.participants.add` API reference}.
                 */
                add: bindApiCall(this, 'calls.participants.add'),
                remove: bindApiCall(this, 'calls.participants.remove'),
            },
        };
        this.canvases = {
            access: {
                /**
                 * @description Remove access to a canvas for specified entities.
                 * @see {@link https://api.slack.com/methods/canvases.access.delete `canvases.access.delete` API reference}.
                 */
                delete: bindApiCall(this, 'canvases.access.delete'),
                /**
                 * @description Sets the access level to a canvas for specified entities.
                 * @see {@link https://api.slack.com/methods/canvases.access.set `canvases.access.set` API reference}.
                 */
                set: bindApiCall(this, 'canvases.access.set'),
            },
            /**
             * @description Create Canvas for a user.
             * @see {@link https://api.slack.com/methods/canvases.create `canvases.create` API reference}.
             */
            create: bindApiCallWithOptionalArgument(this, 'canvases.create'),
            /**
             * @description Deletes a canvas.
             * @see {@link https://api.slack.com/methods/canvases.delete `canvases.delete` API reference}.
             */
            delete: bindApiCall(this, 'canvases.delete'),
            /**
             * @description Update an existing canvas.
             * @see {@link https://api.slack.com/methods/canvases.edit `canvases.edit` API reference}.
             */
            edit: bindApiCall(this, 'canvases.edit'),
            sections: {
                /**
                 * @description Find sections matching the provided criteria.
                 * @see {@link https://api.slack.com/methods/canvases.sections.lookup `canvases.sections.lookup` API reference}.
                 */
                lookup: bindApiCall(this, 'canvases.sections.lookup'),
            },
        };
        this.chat = {
            /**
             * @description Deletes a message.
             * @see {@link https://api.slack.com/methods/chat.delete `chat.delete` API reference}.
             */
            delete: bindApiCall(this, 'chat.delete'),
            /**
             * @description Deletes a pending scheduled message from the queue.
             * @see {@link https://api.slack.com/methods/chat.deleteScheduledMessage `chat.deleteScheduledMessage` API reference}.
             */
            deleteScheduledMessage: bindApiCall(this, 'chat.deleteScheduledMessage'),
            /**
             * @description Retrieve a permalink URL for a specific extant message.
             * @see {@link https://api.slack.com/methods/chat.getPermalink `chat.getPermalink` API reference}.
             */
            getPermalink: bindApiCall(this, 'chat.getPermalink'),
            /**
             * @description Share a me message into a channel.
             * @see {@link https://api.slack.com/methods/chat.meMessage `chat.meMessage` API reference}.
             */
            meMessage: bindApiCall(this, 'chat.meMessage'),
            /**
             * @description Sends an ephemeral message to a user in a channel.
             * @see {@link https://api.slack.com/methods/chat.postEphemeral `chat.postEphemeral` API reference}.
             */
            postEphemeral: bindApiCall(this, 'chat.postEphemeral'),
            /**
             * @description Sends a message to a channel.
             * @see {@link https://api.slack.com/methods/chat.postMessage `chat.postMessage` API reference}.
             */
            postMessage: bindApiCall(this, 'chat.postMessage'),
            /**
             * @description Schedules a message to be sent to a channel.
             * @see {@link https://api.slack.com/methods/chat.scheduleMessage `chat.scheduleMessage` API reference}.
             */
            scheduleMessage: bindApiCall(this, 'chat.scheduleMessage'),
            scheduledMessages: {
                /**
                 * @description Returns a list of scheduled messages.
                 * @see {@link https://api.slack.com/methods/chat.scheduledMessages.list `chat.scheduledMessages.list` API reference}.
                 */
                list: bindApiCallWithOptionalArgument(this, 'chat.scheduledMessages.list'),
            },
            /**
             * @description Provide custom unfurl behavior for user-posted URLs.
             * @see {@link https://api.slack.com/methods/chat.unfurl `chat.unfurl` API reference}.
             */
            unfurl: bindApiCall(this, 'chat.unfurl'),
            /**
             * @description Updates a message.
             * @see {@link https://api.slack.com/methods/chat.update `chat.update` API reference}.
             */
            update: bindApiCall(this, 'chat.update'),
        };
        this.conversations = {
            /**
             * @description Accepts an invitation to a Slack Connect channel.
             * @see {@link https://api.slack.com/methods/conversations.acceptSharedInvite `conversations.acceptSharedInvite` API reference}.
             */
            acceptSharedInvite: bindApiCall(this, 'conversations.acceptSharedInvite'),
            /**
             * @description Approves an invitation to a Slack Connect channel.
             * @see {@link https://api.slack.com/methods/conversations.approveSharedInvite `conversations.approveSharedInvite` API reference}.
             */
            approveSharedInvite: bindApiCall(this, 'conversations.approveSharedInvite'),
            /**
             * @description Archives a conversation.
             * @see {@link https://api.slack.com/methods/conversations.archive `conversations.archive` API reference}.
             */
            archive: bindApiCall(this, 'conversations.archive'),
            canvases: {
                /**
                 * @description Create a Channel Canvas for a channel.
                 * @see {@link https://api.slack.com/methods/conversations.canvases.create `conversations.canvases.create` API reference}.
                 */
                create: bindApiCall(this, 'conversations.canvases.create'),
            },
            /**
             * @description Closes a direct message or multi-person direct message.
             * @see {@link https://api.slack.com/methods/conversations.close `conversations.close` API reference}.
             */
            close: bindApiCall(this, 'conversations.close'),
            /**
             * @description Initiates a public or private channel-based conversation.
             * @see {@link https://api.slack.com/methods/conversations.create `conversations.create` API reference}.
             */
            create: bindApiCall(this, 'conversations.create'),
            /**
             * @description Declines an invitation to a Slack Connect channel.
             * @see {@link https://api.slack.com/methods/conversations.declineSharedInvite `conversations.declineSharedInvite` API reference}.
             */
            declineSharedInvite: bindApiCall(this, 'conversations.declineSharedInvite'),
            externalInvitePermissions: {
                /**
                 * @description Convert a team in a shared channel from an External Limited channel to a fully shared Slack
                 * Connect channel or vice versa.
                 * @see {@link https://api.slack.com/methods/conversations.externalInvitePermissions.set `conversations.externalInvitePermissions.set` API reference}.
                 */
                set: bindApiCall(this, 'conversations.externalInvitePermissions.set'),
            },
            /**
             * @description Fetches a conversation's history of messages and events.
             * @see {@link https://api.slack.com/methods/conversations.history `conversations.history` API reference}.
             */
            history: bindApiCall(this, 'conversations.history'),
            /**
             * @description Retrieve information about a conversation.
             * @see {@link https://api.slack.com/methods/conversations.info `conversations.info` API reference}.
             */
            info: bindApiCall(this, 'conversations.info'),
            /**
             * @description Invites users to a channel.
             * @see {@link https://api.slack.com/methods/conversations.invite `conversations.invite` API reference}.
             */
            invite: bindApiCall(this, 'conversations.invite'),
            /**
             * @description Sends an invitation to a Slack Connect channel.
             * @see {@link https://api.slack.com/methods/conversations.inviteShared `conversations.inviteShared` API reference}.
             */
            inviteShared: bindApiCall(this, 'conversations.inviteShared'),
            /**
             * @description Joins an existing conversation.
             * @see {@link https://api.slack.com/methods/conversations.join `conversations.join` API reference}.
             */
            join: bindApiCall(this, 'conversations.join'),
            /**
             * @description Removes a user from a conversation.
             * @see {@link https://api.slack.com/methods/conversations.kick `conversations.kick` API reference}.
             */
            kick: bindApiCall(this, 'conversations.kick'),
            /**
             * @description Leaves a conversation.
             * @see {@link https://api.slack.com/methods/conversations.leave `conversations.leave` API reference}.
             */
            leave: bindApiCall(this, 'conversations.leave'),
            /**
             * @description List all channels in a Slack team.
             * @see {@link https://api.slack.com/methods/conversations.list `conversations.list` API reference}.
             */
            list: bindApiCallWithOptionalArgument(this, 'conversations.list'),
            /**
             * @description Lists shared channel invites that have been generated or received but have not been approved by
             * all parties.
             * @see {@link https://api.slack.com/methods/conversations.listConnectInvites `conversations.listConnectInvites` API reference}.
             */
            listConnectInvites: bindApiCallWithOptionalArgument(this, 'conversations.listConnectInvites'),
            /**
             * @description Sets the read cursor in a channel.
             * @see {@link https://api.slack.com/methods/conversations.mark `conversations.mark` API reference}.
             */
            mark: bindApiCall(this, 'conversations.mark'),
            /**
             * @description Retrieve members of a conversation.
             * @see {@link https://api.slack.com/methods/conversations.members `conversations.members` API reference}.
             */
            members: bindApiCall(this, 'conversations.members'),
            /**
             * @description Opens or resumes a direct message or multi-person direct message.
             * @see {@link https://api.slack.com/methods/conversations.open `conversations.open` API reference}.
             */
            open: bindApiCall(this, 'conversations.open'),
            /**
             * @description Renames a conversation.
             * @see {@link https://api.slack.com/methods/conversations.rename `conversations.rename` API reference}.
             */
            rename: bindApiCall(this, 'conversations.rename'),
            /**
             * @description Retrieve a thread of messages posted to a conversation.
             * @see {@link https://api.slack.com/methods/conversations.replies `conversations.replies` API reference}.
             */
            replies: bindApiCall(this, 'conversations.replies'),
            requestSharedInvite: {
                /**
                 * @description Approves a request to add an external user to a channel and sends them a Slack Connect invite.
                 * @see {@link https://api.slack.com/methods/conversations.requestSharedInvite.approve `conversations.requestSharedInvite.approve` API reference}.
                 */
                approve: bindApiCall(this, 'conversations.requestSharedInvite.approve'),
                /**
                 * @description Denies a request to invite an external user to a channel.
                 * @see {@link https://api.slack.com/methods/conversations.requestSharedInvite.deny `conversations.requestSharedInvite.deny` API reference}.
                 */
                deny: bindApiCall(this, 'conversations.requestSharedInvite.deny'),
                /**
                 * @description Lists requests to add external users to channels with ability to filter.
                 * @see {@link https://api.slack.com/methods/conversations.requestSharedInvite.list `conversations.requestSharedInvite.list` API reference}.
                 */
                list: bindApiCallWithOptionalArgument(this, 'conversations.requestSharedInvite.list'),
            },
            /**
             * @description Sets the purpose for a conversation.
             * @see {@link https://api.slack.com/methods/conversations.setPurpose `conversations.setPurpose` API reference}.
             */
            setPurpose: bindApiCall(this, 'conversations.setPurpose'),
            /**
             * @description Sets the topic for a conversation.
             * @see {@link https://api.slack.com/methods/conversations.setTopic `conversations.setTopic` API reference}.
             */
            setTopic: bindApiCall(this, 'conversations.setTopic'),
            /**
             * @description Reverses conversation archival.
             * @see {@link https://api.slack.com/methods/conversations.unarchive `conversations.unarchive` API reference}.
             */
            unarchive: bindApiCall(this, 'conversations.unarchive'),
        };
        this.dialog = {
            /**
             * @description Open a dialog with a user.
             * @see {@link https://api.slack.com/methods/dialog.open `dialog.open` API reference}.
             */
            open: bindApiCall(this, 'dialog.open'),
        };
        this.dnd = {
            /**
             * @description Ends the current user's Do Not Disturb session immediately.
             * @see {@link https://api.slack.com/methods/dnd.endDnd `dnd.endDnd` API reference}.
             */
            endDnd: bindApiCallWithOptionalArgument(this, 'dnd.endDnd'),
            /**
             * @description Ends the current user's snooze mode immediately.
             * @see {@link https://api.slack.com/methods/dnd.endSnooze `dnd.endSnooze` API reference}.
             */
            endSnooze: bindApiCallWithOptionalArgument(this, 'dnd.endSnooze'),
            /**
             * @description Retrieves a user's current Do Not Disturb status.
             * @see {@link https://api.slack.com/methods/dnd.info `dnd.info` API reference}.
             */
            info: bindApiCallWithOptionalArgument(this, 'dnd.info'),
            /**
             * @description Turns on Do Not Disturb mode for the current user, or changes its duration.
             * @see {@link https://api.slack.com/methods/dnd.setSnooze `dnd.setSnooze` API reference}.
             */
            setSnooze: bindApiCall(this, 'dnd.setSnooze'),
            /**
             * @description Retrieves the Do Not Disturb status for up to 50 users on a team.
             * @see {@link https://api.slack.com/methods/dnd.teamInfo `dnd.teamInfo` API reference}.
             */
            teamInfo: bindApiCall(this, 'dnd.teamInfo'),
        };
        this.emoji = {
            /**
             * @description Lists custom emoji for a team.
             * @see {@link https://api.slack.com/methods/emoji.list `emoji.list` API reference}.
             */
            list: bindApiCallWithOptionalArgument(this, 'emoji.list'),
        };
        this.files = {
            /**
             * @description Finishes an upload started with {@link https://api.slack.com/methods/files.getUploadURLExternal `files.getUploadURLExternal`}.
             * @see {@link https://api.slack.com/methods/files.completeUploadExternal `files.completeUploadExternal` API reference}.
             */
            completeUploadExternal: bindApiCall(this, 'files.completeUploadExternal'),
            /**
             * @description Deletes a file.
             * @see {@link https://api.slack.com/methods/files.delete `files.delete` API reference}.
             */
            delete: bindApiCall(this, 'files.delete'),
            /**
             * @description Gets a URL for an edge external file upload.
             * @see {@link https://api.slack.com/methods/files.getUploadURLExternal `files.getUploadURLExternal` API reference}.
             */
            getUploadURLExternal: bindApiCall(this, 'files.getUploadURLExternal'),
            /**
             * @description Gets information about a file.
             * @see {@link https://api.slack.com/methods/files.info `files.info` API reference}.
             */
            info: bindApiCall(this, 'files.info'),
            /**
             * @description List files for a team, in a channel, or from a user with applied filters.
             * @see {@link https://api.slack.com/methods/files.list `files.list` API reference}.
             */
            list: bindApiCall(this, 'files.list'),
            /**
             * @description Revokes public/external sharing access for a file.
             * @see {@link https://api.slack.com/methods/files.revokePublicURL `files.revokePublicURL` API reference}.
             */
            revokePublicURL: bindApiCall(this, 'files.revokePublicURL'),
            /**
             * @description Enables a file for public/external sharing.
             * @see {@link https://api.slack.com/methods/files.revokePublicURL `files.revokePublicURL` API reference}.
             */
            sharedPublicURL: bindApiCall(this, 'files.sharedPublicURL'),
            /**
             * @description Uploads or creates a file.
             * @deprecated Use `uploadV2` instead. See {@link https://api.slack.com/changelog/2024-04-a-better-way-to-upload-files-is-here-to-stay our post on retiring `files.upload`}.
             * @see {@link https://api.slack.com/methods/files.upload `files.upload` API reference}.
             */
            upload: bindApiCall(this, 'files.upload'),
            /**
             * @description Custom method to support a new way of uploading files to Slack.
             * Supports a single file upload
             * Supply:
             * - (required) single file or content
             * - (optional) channel, alt_text, snippet_type,
             * Supports multiple file uploads
             * Supply:
             * - multiple upload_files
             * Will try to honor both single file or content data supplied as well
             * as multiple file uploads property.
             * @see {@link https://tools.slack.dev/node-slack-sdk/web-api#upload-a-file `@slack/web-api` Upload a file documentation}.
             */
            uploadV2: bindFilesUploadV2(this),
            comments: {
                /**
                 * @description Deletes an existing comment on a file.
                 * @see {@link https://api.slack.com/methods/files.comments.delete `files.comments.delete` API reference}.
                 */
                delete: bindApiCall(this, 'files.comments.delete'),
            },
            remote: {
                /**
                 * @description Adds a file from a remote service.
                 * @see {@link https://api.slack.com/methods/files.remote.add `files.remote.add` API reference}.
                 */
                add: bindApiCall(this, 'files.remote.add'),
                /**
                 * @description Retrieve information about a remote file added to Slack.
                 * @see {@link https://api.slack.com/methods/files.remote.info `files.remote.info` API reference}.
                 */
                info: bindApiCall(this, 'files.remote.info'),
                /**
                 * @description List remote files added to Slack.
                 * @see {@link https://api.slack.com/methods/files.remote.list `files.remote.list` API reference}.
                 */
                list: bindApiCall(this, 'files.remote.list'),
                /**
                 * @description Remove a remote file.
                 * @see {@link https://api.slack.com/methods/files.remote.remove `files.remote.remove` API reference}.
                 */
                remove: bindApiCall(this, 'files.remote.remove'),
                /**
                 * @description Share a remote file into a channel.
                 * @see {@link https://api.slack.com/methods/files.remote.share `files.remote.share` API reference}.
                 */
                share: bindApiCall(this, 'files.remote.share'),
                /**
                 * @description Updates an existing remote file.
                 * @see {@link https://api.slack.com/methods/files.remote.update `files.remote.update` API reference}.
                 */
                update: bindApiCall(this, 'files.remote.update'),
            },
        };
        this.functions = {
            /**
             * @description Signal the failure to execute a Custom Function.
             * @see {@link https://api.slack.com/methods/functions.completeError `functions.completeError` API reference}.
             */
            completeError: bindApiCall(this, 'functions.completeError'),
            /**
             * @description Signal the successful completion of a Custom Function.
             * @see {@link https://api.slack.com/methods/functions.completeSuccess `functions.completeSuccess` API reference}.
             */
            completeSuccess: bindApiCall(this, 'functions.completeSuccess'),
        };
        this.migration = {
            /**
             * @description For Enterprise Grid workspaces, map local user IDs to global user IDs.
             * @see {@link https://api.slack.com/methods/migration.exchange `migration.exchange` API reference}.
             */
            exchange: bindApiCall(this, 'migration.exchange'),
        };
        this.oauth = {
            /**
             * @description Exchanges a temporary OAuth verifier code for an access token.
             * @deprecated This is a legacy method only used by classic Slack apps. Use `oauth.v2.access` for new Slack apps.
             * @see {@link https://api.slack.com/methods/oauth.access `oauth.access` API reference}.
             */
            access: bindApiCall(this, 'oauth.access'),
            v2: {
                /**
                 * @description Exchanges a temporary OAuth verifier code for an access token.
                 * @see {@link https://api.slack.com/methods/oauth.v2.access `oauth.v2.access` API reference}.
                 */
                access: bindApiCall(this, 'oauth.v2.access'),
                /**
                 * @description Exchanges a legacy access token for a new expiring access token and refresh token.
                 * @see {@link https://api.slack.com/methods/oauth.v2.exchange `oauth.v2.exchange` API reference}.
                 */
                exchange: bindApiCall(this, 'oauth.v2.exchange'),
            },
        };
        this.openid = {
            connect: {
                /**
                 * @description Exchanges a temporary OAuth verifier code for an access token for {@link https://api.slack.com/authentication/sign-in-with-slack Sign in with Slack}.
                 * @see {@link https://api.slack.com/methods/openid.connect.token `openid.connect.token` API reference}.
                 */
                token: bindApiCall(this, 'openid.connect.token'),
                /**
                 * @description Get the identity of a user who has authorized {@link https://api.slack.com/authentication/sign-in-with-slack Sign in with Slack}.
                 * @see {@link https://api.slack.com/methods/openid.connect.userInfo `openid.connect.userInfo` API reference}.
                 */
                userInfo: bindApiCallWithOptionalArgument(this, 'openid.connect.userInfo'),
            },
        };
        this.pins = {
            /**
             * @description Pins an item to a channel.
             * @see {@link https://api.slack.com/methods/pins.add `pins.add` API reference}.
             */
            add: bindApiCall(this, 'pins.add'),
            /**
             * @description Lists items pinned to a channel.
             * @see {@link https://api.slack.com/methods/pins.list `pins.list` API reference}.
             */
            list: bindApiCall(this, 'pins.list'),
            /**
             * @description Un-pins an item from a channel.
             * @see {@link https://api.slack.com/methods/pins.remove `pins.remove` API reference}.
             */
            remove: bindApiCall(this, 'pins.remove'),
        };
        this.reactions = {
            /**
             * @description Adds a reaction to an item.
             * @see {@link https://api.slack.com/methods/reactions.add `reactions.add` API reference}.
             */
            add: bindApiCall(this, 'reactions.add'),
            /**
             * @description Gets reactions for an item.
             * @see {@link https://api.slack.com/methods/reactions.get `reactions.get` API reference}.
             */
            get: bindApiCall(this, 'reactions.get'),
            /**
             * @description List reactions made by a user.
             * @see {@link https://api.slack.com/methods/reactions.list `reactions.list` API reference}.
             */
            list: bindApiCallWithOptionalArgument(this, 'reactions.list'),
            /**
             * @description Removes a reaction from an item.
             * @see {@link https://api.slack.com/methods/reactions.remove `reactions.remove` API reference}.
             */
            remove: bindApiCall(this, 'reactions.remove'),
        };
        // TODO: keep tabs on reminders APIs, may be deprecated once Later list APIs land
        // See: https://api.slack.com/changelog/2023-07-its-later-already-for-stars-and-reminders
        this.reminders = {
            /**
             * @description Creates a reminder.
             * @see {@link https://api.slack.com/methods/reminders.add `reminders.add` API reference}.
             */
            add: bindApiCall(this, 'reminders.add'),
            /**
             * @description Marks a reminder as complete.
             * @see {@link https://api.slack.com/methods/reminders.complete `reminders.complete` API reference}.
             */
            complete: bindApiCall(this, 'reminders.complete'),
            /**
             * @description Deletes a reminder.
             * @see {@link https://api.slack.com/methods/reminders.delete `reminders.delete` API reference}.
             */
            delete: bindApiCall(this, 'reminders.delete'),
            /**
             * @description Gets information about a reminder.
             * @see {@link https://api.slack.com/methods/reminders.info `reminders.info` API reference}.
             */
            info: bindApiCall(this, 'reminders.info'),
            /**
             * @description Lists all reminders created by or for a given user.
             * @see {@link https://api.slack.com/methods/reminders.list `reminders.list` API reference}.
             */
            list: bindApiCallWithOptionalArgument(this, 'reminders.list'),
        };
        this.rtm = {
            /**
             * @description Starts a Real Time Messaging session.
             * @see {@link https://api.slack.com/methods/rtm.connect `rtm.connect` API reference}.
             */
            connect: bindApiCallWithOptionalArgument(this, 'rtm.connect'),
            /**
             * @description Starts a Real Time Messaging session.
             * @deprecated Use `rtm.connect` instead. See {@link https://api.slack.com/changelog/2021-10-rtm-start-to-stop our post on retiring `rtm.start`}.
             * @see {@link https://api.slack.com/methods/rtm.start `rtm.start` API reference}.
             */
            start: bindApiCallWithOptionalArgument(this, 'rtm.start'),
        };
        this.search = {
            /**
             * @description Searches for messages and files matching a query.
             * @see {@link https://api.slack.com/methods/search.all search.all` API reference}.
             */
            all: bindApiCall(this, 'search.all'),
            /**
             * @description Searches for files matching a query.
             * @see {@link https://api.slack.com/methods/search.files search.files` API reference}.
             */
            files: bindApiCall(this, 'search.files'),
            /**
             * @description Searches for messages matching a query.
             * @see {@link https://api.slack.com/methods/search.messages search.messages` API reference}.
             */
            messages: bindApiCall(this, 'search.messages'),
        };
        this.team = {
            /**
             * @description Gets the access logs for the current team.
             * @see {@link https://api.slack.com/methods/team.accessLogs `team.accessLogs` API reference}.
             */
            accessLogs: bindApiCallWithOptionalArgument(this, 'team.accessLogs'),
            /**
             * @description Gets billable users information for the current team.
             * @see {@link https://api.slack.com/methods/team.billableInfo `team.billableInfo` API reference}.
             */
            billableInfo: bindApiCallWithOptionalArgument(this, 'team.billableInfo'),
            billing: {
                /**
                 * @description Reads a workspace's billing plan information.
                 * @see {@link https://api.slack.com/methods/team.billing.info `team.billing.info` API reference}.
                 */
                info: bindApiCall(this, 'team.billing.info'),
            },
            externalTeams: {
                /**
                 * @description Disconnect an external organization.
                 * @see {@link https://api.slack.com/methods/team.externalTeams.disconnect `team.externalTeams.disconnect` API reference}.
                 */
                disconnect: bindApiCall(this, 'team.externalTeams.disconnect'),
                /**
                 * @description Returns a list of all the external teams connected and details about the connection.
                 * @see {@link https://api.slack.com/methods/team.externalTeams.list `team.externalTeams.list` API reference}.
                 */
                list: bindApiCall(this, 'team.externalTeams.list'),
            },
            /**
             * @description Gets information about the current team.
             * @see {@link https://api.slack.com/methods/team.info `team.info` API reference}.
             */
            info: bindApiCallWithOptionalArgument(this, 'team.info'),
            /**
             * @description Gets the integration logs for the current team.
             * @see {@link https://api.slack.com/methods/team.integrationLogs `team.integrationLogs` API reference}.
             */
            integrationLogs: bindApiCallWithOptionalArgument(this, 'team.integrationLogs'),
            preferences: {
                /**
                 * @description Retrieve a list of a workspace's team preferences.
                 * @see {@link https://api.slack.com/methods/team.preferences.list `team.preferences.list` API reference}.
                 */
                list: bindApiCallWithOptionalArgument(this, 'team.preferences.list'),
            },
            profile: {
                /**
                 * @description Retrieve a team's profile.
                 * @see {@link https://api.slack.com/methods/team.profile.get `team.profile.get` API reference}.
                 */
                get: bindApiCallWithOptionalArgument(this, 'team.profile.get'),
            },
        };
        this.tooling = {
            tokens: {
                /**
                 * @description Exchanges a refresh token for a new app configuration token.
                 * @see {@link https://api.slack.com/methods/tooling.tokens.rotate `tooling.tokens.rotate` API reference}.
                 */
                rotate: bindApiCall(this, 'tooling.tokens.rotate'),
            },
        };
        this.usergroups = {
            /**
             * @description Create a User Group.
             * @see {@link https://api.slack.com/methods/usergroups.create `usergroups.create` API reference}.
             */
            create: bindApiCall(this, 'usergroups.create'),
            /**
             * @description Disable an existing User Group.
             * @see {@link https://api.slack.com/methods/usergroups.disable `usergroups.disable` API reference}.
             */
            disable: bindApiCall(this, 'usergroups.disable'),
            /**
             * @description Enable an existing User Group.
             * @see {@link https://api.slack.com/methods/usergroups.enable `usergroups.enable` API reference}.
             */
            enable: bindApiCall(this, 'usergroups.enable'),
            /**
             * @description List all User Groups for a team.
             * @see {@link https://api.slack.com/methods/usergroups.list `usergroups.list` API reference}.
             */
            list: bindApiCallWithOptionalArgument(this, 'usergroups.list'),
            /**
             * @description Update an existing User Group.
             * @see {@link https://api.slack.com/methods/usergroups.update `usergroups.update` API reference}.
             */
            update: bindApiCall(this, 'usergroups.update'),
            users: {
                /**
                 * @description List all users in a User Group.
                 * @see {@link https://api.slack.com/methods/usergroups.users.list `usergroups.users.list` API reference}.
                 */
                list: bindApiCall(this, 'usergroups.users.list'),
                /**
                 * @description Update the list of users in a User Group.
                 * @see {@link https://api.slack.com/methods/usergroups.users.update `usergroups.users.update` API reference}.
                 */
                update: bindApiCall(this, 'usergroups.users.update'),
            },
        };
        this.users = {
            /**
             * @description List conversations the calling user may access.
             * @see {@link https://api.slack.com/methods/users.conversations `users.conversations` API reference}.
             */
            conversations: bindApiCall(this, 'users.conversations'),
            /**
             * @description Delete the user profile photo.
             * @see {@link https://api.slack.com/methods/users.deletePhoto `users.deletePhoto` API reference}.
             */
            deletePhoto: bindApiCall(this, 'users.deletePhoto'),
            discoverableContacts: {
                /**
                 * @description Lookup an email address to see if someone is on Slack.
                 * @see {@link https://api.slack.com/methods/users.discoverableContacts.lookup `users.discoverableContacts.lookup` API reference}.
                 */
                lookup: bindApiCall(this, 'users.discoverableContacts.lookup'),
            },
            /**
             * @description Gets user presence information.
             * @see {@link https://api.slack.com/methods/users.getPresence `users.getPresence` API reference}.
             */
            getPresence: bindApiCall(this, 'users.getPresence'),
            /**
             * @description Get a user's identity.
             * @see {@link https://api.slack.com/methods/users.identity `users.identity` API reference}.
             */
            identity: bindApiCall(this, 'users.identity'),
            /**
             * @description Gets information about a user.
             * @see {@link https://api.slack.com/methods/users.info `users.info` API reference}.
             */
            info: bindApiCall(this, 'users.info'),
            /**
             * @description Lists all users in a Slack team.
             * @see {@link https://api.slack.com/methods/users.list `users.list` API reference}.
             */
            list: bindApiCall(this, 'users.list'),
            /**
             * @description Find a user with an email address.
             * @see {@link https://api.slack.com/methods/users.lookupByEmail `users.lookupByEmail` API reference}.
             */
            lookupByEmail: bindApiCall(this, 'users.lookupByEmail'),
            /**
             * @description Set the user profile photo.
             * @see {@link https://api.slack.com/methods/users.setPhoto `users.setPhoto` API reference}.
             */
            setPhoto: bindApiCall(this, 'users.setPhoto'),
            /**
             * @description Manually sets user presence.
             * @see {@link https://api.slack.com/methods/users.setPresence `users.setPresence` API reference}.
             */
            setPresence: bindApiCall(this, 'users.setPresence'),
            profile: {
                /**
                 * @description Retrieve a user's profile information, including their custom status.
                 * @see {@link https://api.slack.com/methods/users.profile.get `users.profile.get` API reference}.
                 */
                get: bindApiCall(this, 'users.profile.get'),
                /**
                 * @description Set a user's profile information, including custom status.
                 * @see {@link https://api.slack.com/methods/users.profile.set `users.profile.set` API reference}.
                 */
                set: bindApiCall(this, 'users.profile.set'),
            },
        };
        this.views = {
            /**
             * @description Open a view for a user.
             * @see {@link https://api.slack.com/methods/views.open `views.open` API reference}.
             */
            open: bindApiCall(this, 'views.open'),
            /**
             * @description Publish a static view for a user.
             * @see {@link https://api.slack.com/methods/views.publish `views.publish` API reference}.
             */
            publish: bindApiCall(this, 'views.publish'),
            /**
             * @description Push a view onto the stack of a root view.
             * @see {@link https://api.slack.com/methods/views.push `views.push` API reference}.
             */
            push: bindApiCall(this, 'views.push'),
            /**
             * @description Update an existing view.
             * @see {@link https://api.slack.com/methods/views.update `views.update` API reference}.
             */
            update: bindApiCall(this, 'views.update'),
        };
        // ------------------
        // Deprecated methods
        // ------------------
        // TODO: breaking changes for future majors:
        // - stars.* methods are marked as deprecated; once Later has APIs, these will see an official sunsetting timeline
        // - workflows.* methods, Sep 12 2024: https://api.slack.com/changelog/2023-08-workflow-steps-from-apps-step-back
        this.stars = {
            /**
             * @description Save an item for later. Formerly known as adding a star.
             * @deprecated Stars can still be added but they can no longer be viewed or interacted with by end-users.
             * See {@link https://api.slack.com/changelog/2023-07-its-later-already-for-stars-and-reminders our post on stars and the Later list}.
             * @see {@link https://api.slack.com/methods/stars.add `stars.add` API reference}.
             */
            add: bindApiCall(this, 'stars.add'),
            /**
             * @description List a user's saved items, formerly known as stars.
             * @deprecated Stars can still be listed but they can no longer be viewed or interacted with by end-users.
             * See {@link https://api.slack.com/changelog/2023-07-its-later-already-for-stars-and-reminders our post on stars and the Later list}.
             * @see {@link https://api.slack.com/methods/stars.list `stars.list` API reference}.
             */
            list: bindApiCall(this, 'stars.list'),
            /**
             * @description Remove a saved item from a user's saved items, formerly known as stars.
             * @deprecated Stars can still be removed but they can no longer be viewed or interacted with by end-users.
             * See {@link https://api.slack.com/changelog/2023-07-its-later-already-for-stars-and-reminders our post on stars and the Later list}.
             * @see {@link https://api.slack.com/methods/stars.remove `stars.remove` API reference}.
             */
            remove: bindApiCall(this, 'stars.remove'),
        };
        this.workflows = {
            /**
             * @description Indicate that an app's step in a workflow completed execution.
             * @deprecated Steps from Apps is deprecated.
             * We're retiring all Slack app functionality around Steps from Apps in September 2024.
             * See {@link https://api.slack.com/changelog/2023-08-workflow-steps-from-apps-step-back our post on deprecating Steps from Apps}.
             * @see {@link https://api.slack.com/methods/workflows.stepCompleted `workflows.stepCompleted` API reference}.
             */
            stepCompleted: bindApiCall(this, 'workflows.stepCompleted'),
            /**
             * @description Indicate that an app's step in a workflow failed to execute.
             * @deprecated Steps from Apps is deprecated.
             * We're retiring all Slack app functionality around Steps from Apps in September 2024.
             * See {@link https://api.slack.com/changelog/2023-08-workflow-steps-from-apps-step-back our post on deprecating Steps from Apps}.
             * @see {@link https://api.slack.com/methods/workflows.stepFailed `workflows.stepFailed` API reference}.
             */
            stepFailed: bindApiCall(this, 'workflows.stepFailed'),
            /**
             * @description Update the configuration for a workflow step.
             * @deprecated Steps from Apps is deprecated.
             * We're retiring all Slack app functionality around Steps from Apps in September 2024.
             * See {@link https://api.slack.com/changelog/2023-08-workflow-steps-from-apps-step-back our post on deprecating Steps from Apps}.
             * @see {@link https://api.slack.com/methods/workflows.updateStep `workflows.updateStep` API reference}.
             */
            updateStep: bindApiCall(this, 'workflows.updateStep'),
        };
        // Check that the class being created extends from `WebClient` rather than this class
        if (new.target !== WebClient_1.WebClient && !(new.target.prototype instanceof WebClient_1.WebClient)) {
            throw new Error('Attempt to inherit from WebClient methods without inheriting from WebClient');
        }
    }
}
exports.Methods = Methods;
__exportStar(__webpack_require__(4775), exports);
//# sourceMappingURL=methods.js.map

/***/ }),

/***/ 1766:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rapidRetryPolicy = exports.fiveRetriesInFiveMinutes = exports.tenRetriesInAboutThirtyMinutes = void 0;
/**
 * The default retry policy. Retry up to 10 times, over the span of about 30 minutes. It's not exact because
 * randomization has been added to prevent a stampeding herd problem (if all instances in your application are retrying
 * a request at the exact same intervals, they are more likely to cause failures for each other).
 */
exports.tenRetriesInAboutThirtyMinutes = {
    retries: 10,
    factor: 1.96821,
    randomize: true,
};
/**
 * Short & sweet, five retries in five minutes and then bail.
 */
exports.fiveRetriesInFiveMinutes = {
    retries: 5,
    factor: 3.86,
};
/**
 * This policy is just to keep the tests running fast.
 */
exports.rapidRetryPolicy = {
    minTimeout: 0,
    maxTimeout: 1,
};
const policies = {
    tenRetriesInAboutThirtyMinutes: exports.tenRetriesInAboutThirtyMinutes,
    fiveRetriesInFiveMinutes: exports.fiveRetriesInFiveMinutes,
    rapidRetryPolicy: exports.rapidRetryPolicy,
};
exports["default"] = policies;
//# sourceMappingURL=retry-policies.js.map

/***/ }),

/***/ 381:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5591:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2415:
/***/ ((module) => {



var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ 201:
/***/ ((module) => {

// https://github.com/electron/electron/issues/2288
function isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to false
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}

module.exports = isElectron;


/***/ }),

/***/ 6543:
/***/ ((module) => {



const isStream = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream.writable = stream =>
	isStream(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream.readable = stream =>
	isStream(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream.duplex = stream =>
	isStream.writable(stream) &&
	isStream.readable(stream);

isStream.transform = stream =>
	isStream.duplex(stream) &&
	typeof stream._transform === 'function';

module.exports = isStream;


/***/ }),

/***/ 2766:
/***/ ((module) => {


module.exports = (promise, onFinally) => {
	onFinally = onFinally || (() => {});

	return promise.then(
		val => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => val),
		err => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => {
			throw err;
		})
	);
};


/***/ }),

/***/ 6459:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const EventEmitter = __webpack_require__(301);
const p_timeout_1 = __webpack_require__(4802);
const priority_queue_1 = __webpack_require__(5905);
// eslint-disable-next-line @typescript-eslint/no-empty-function
const empty = () => { };
const timeoutError = new p_timeout_1.TimeoutError();
/**
Promise queue with concurrency control.
*/
class PQueue extends EventEmitter {
    constructor(options) {
        var _a, _b, _c, _d;
        super();
        this._intervalCount = 0;
        this._intervalEnd = 0;
        this._pendingCount = 0;
        this._resolveEmpty = empty;
        this._resolveIdle = empty;
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        options = Object.assign({ carryoverConcurrencyCount: false, intervalCap: Infinity, interval: 0, concurrency: Infinity, autoStart: true, queueClass: priority_queue_1.default }, options);
        if (!(typeof options.intervalCap === 'number' && options.intervalCap >= 1)) {
            throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${(_b = (_a = options.intervalCap) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : ''}\` (${typeof options.intervalCap})`);
        }
        if (options.interval === undefined || !(Number.isFinite(options.interval) && options.interval >= 0)) {
            throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${(_d = (_c = options.interval) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ''}\` (${typeof options.interval})`);
        }
        this._carryoverConcurrencyCount = options.carryoverConcurrencyCount;
        this._isIntervalIgnored = options.intervalCap === Infinity || options.interval === 0;
        this._intervalCap = options.intervalCap;
        this._interval = options.interval;
        this._queue = new options.queueClass();
        this._queueClass = options.queueClass;
        this.concurrency = options.concurrency;
        this._timeout = options.timeout;
        this._throwOnTimeout = options.throwOnTimeout === true;
        this._isPaused = options.autoStart === false;
    }
    get _doesIntervalAllowAnother() {
        return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
    }
    get _doesConcurrentAllowAnother() {
        return this._pendingCount < this._concurrency;
    }
    _next() {
        this._pendingCount--;
        this._tryToStartAnother();
        this.emit('next');
    }
    _resolvePromises() {
        this._resolveEmpty();
        this._resolveEmpty = empty;
        if (this._pendingCount === 0) {
            this._resolveIdle();
            this._resolveIdle = empty;
            this.emit('idle');
        }
    }
    _onResumeInterval() {
        this._onInterval();
        this._initializeIntervalIfNeeded();
        this._timeoutId = undefined;
    }
    _isIntervalPaused() {
        const now = Date.now();
        if (this._intervalId === undefined) {
            const delay = this._intervalEnd - now;
            if (delay < 0) {
                // Act as the interval was done
                // We don't need to resume it here because it will be resumed on line 160
                this._intervalCount = (this._carryoverConcurrencyCount) ? this._pendingCount : 0;
            }
            else {
                // Act as the interval is pending
                if (this._timeoutId === undefined) {
                    this._timeoutId = setTimeout(() => {
                        this._onResumeInterval();
                    }, delay);
                }
                return true;
            }
        }
        return false;
    }
    _tryToStartAnother() {
        if (this._queue.size === 0) {
            // We can clear the interval ("pause")
            // Because we can redo it later ("resume")
            if (this._intervalId) {
                clearInterval(this._intervalId);
            }
            this._intervalId = undefined;
            this._resolvePromises();
            return false;
        }
        if (!this._isPaused) {
            const canInitializeInterval = !this._isIntervalPaused();
            if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                const job = this._queue.dequeue();
                if (!job) {
                    return false;
                }
                this.emit('active');
                job();
                if (canInitializeInterval) {
                    this._initializeIntervalIfNeeded();
                }
                return true;
            }
        }
        return false;
    }
    _initializeIntervalIfNeeded() {
        if (this._isIntervalIgnored || this._intervalId !== undefined) {
            return;
        }
        this._intervalId = setInterval(() => {
            this._onInterval();
        }, this._interval);
        this._intervalEnd = Date.now() + this._interval;
    }
    _onInterval() {
        if (this._intervalCount === 0 && this._pendingCount === 0 && this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = undefined;
        }
        this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
        this._processQueue();
    }
    /**
    Executes all queued functions until it reaches the limit.
    */
    _processQueue() {
        // eslint-disable-next-line no-empty
        while (this._tryToStartAnother()) { }
    }
    get concurrency() {
        return this._concurrency;
    }
    set concurrency(newConcurrency) {
        if (!(typeof newConcurrency === 'number' && newConcurrency >= 1)) {
            throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
        }
        this._concurrency = newConcurrency;
        this._processQueue();
    }
    /**
    Adds a sync or async task to the queue. Always returns a promise.
    */
    async add(fn, options = {}) {
        return new Promise((resolve, reject) => {
            const run = async () => {
                this._pendingCount++;
                this._intervalCount++;
                try {
                    const operation = (this._timeout === undefined && options.timeout === undefined) ? fn() : p_timeout_1.default(Promise.resolve(fn()), (options.timeout === undefined ? this._timeout : options.timeout), () => {
                        if (options.throwOnTimeout === undefined ? this._throwOnTimeout : options.throwOnTimeout) {
                            reject(timeoutError);
                        }
                        return undefined;
                    });
                    resolve(await operation);
                }
                catch (error) {
                    reject(error);
                }
                this._next();
            };
            this._queue.enqueue(run, options);
            this._tryToStartAnother();
            this.emit('add');
        });
    }
    /**
    Same as `.add()`, but accepts an array of sync or async functions.

    @returns A promise that resolves when all functions are resolved.
    */
    async addAll(functions, options) {
        return Promise.all(functions.map(async (function_) => this.add(function_, options)));
    }
    /**
    Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
    */
    start() {
        if (!this._isPaused) {
            return this;
        }
        this._isPaused = false;
        this._processQueue();
        return this;
    }
    /**
    Put queue execution on hold.
    */
    pause() {
        this._isPaused = true;
    }
    /**
    Clear the queue.
    */
    clear() {
        this._queue = new this._queueClass();
    }
    /**
    Can be called multiple times. Useful if you for example add additional items at a later time.

    @returns A promise that settles when the queue becomes empty.
    */
    async onEmpty() {
        // Instantly resolve if the queue is empty
        if (this._queue.size === 0) {
            return;
        }
        return new Promise(resolve => {
            const existingResolve = this._resolveEmpty;
            this._resolveEmpty = () => {
                existingResolve();
                resolve();
            };
        });
    }
    /**
    The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.

    @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
    */
    async onIdle() {
        // Instantly resolve if none pending and if nothing else is queued
        if (this._pendingCount === 0 && this._queue.size === 0) {
            return;
        }
        return new Promise(resolve => {
            const existingResolve = this._resolveIdle;
            this._resolveIdle = () => {
                existingResolve();
                resolve();
            };
        });
    }
    /**
    Size of the queue.
    */
    get size() {
        return this._queue.size;
    }
    /**
    Size of the queue, filtered by the given options.

    For example, this can be used to find the number of items remaining in the queue with a specific priority level.
    */
    sizeBy(options) {
        // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
        return this._queue.filter(options).length;
    }
    /**
    Number of pending promises.
    */
    get pending() {
        return this._pendingCount;
    }
    /**
    Whether the queue is currently paused.
    */
    get isPaused() {
        return this._isPaused;
    }
    get timeout() {
        return this._timeout;
    }
    /**
    Set the timeout for future operations.
    */
    set timeout(milliseconds) {
        this._timeout = milliseconds;
    }
}
exports["default"] = PQueue;


/***/ }),

/***/ 9015:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
// Port of lower_bound from https://en.cppreference.com/w/cpp/algorithm/lower_bound
// Used to compute insertion index to keep queue sorted after insertion
function lowerBound(array, value, comparator) {
    let first = 0;
    let count = array.length;
    while (count > 0) {
        const step = (count / 2) | 0;
        let it = first + step;
        if (comparator(array[it], value) <= 0) {
            first = ++it;
            count -= step + 1;
        }
        else {
            count = step;
        }
    }
    return first;
}
exports["default"] = lowerBound;


/***/ }),

/***/ 5905:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const lower_bound_1 = __webpack_require__(9015);
class PriorityQueue {
    constructor() {
        this._queue = [];
    }
    enqueue(run, options) {
        options = Object.assign({ priority: 0 }, options);
        const element = {
            priority: options.priority,
            run
        };
        if (this.size && this._queue[this.size - 1].priority >= options.priority) {
            this._queue.push(element);
            return;
        }
        const index = lower_bound_1.default(this._queue, element, (a, b) => b.priority - a.priority);
        this._queue.splice(index, 0, element);
    }
    dequeue() {
        const item = this._queue.shift();
        return item === null || item === void 0 ? void 0 : item.run;
    }
    filter(options) {
        return this._queue.filter((element) => element.priority === options.priority).map((element) => element.run);
    }
    get size() {
        return this._queue.length;
    }
}
exports["default"] = PriorityQueue;


/***/ }),

/***/ 301:
/***/ ((module) => {



var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ 2103:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const retry = __webpack_require__(5546);

const networkErrorMsgs = [
	'Failed to fetch', // Chrome
	'NetworkError when attempting to fetch resource.', // Firefox
	'The Internet connection appears to be offline.', // Safari
	'Network request failed' // `cross-fetch`
];

class AbortError extends Error {
	constructor(message) {
		super();

		if (message instanceof Error) {
			this.originalError = message;
			({message} = message);
		} else {
			this.originalError = new Error(message);
			this.originalError.stack = this.stack;
		}

		this.name = 'AbortError';
		this.message = message;
	}
}

const decorateErrorWithCounts = (error, attemptNumber, options) => {
	// Minus 1 from attemptNumber because the first attempt does not count as a retry
	const retriesLeft = options.retries - (attemptNumber - 1);

	error.attemptNumber = attemptNumber;
	error.retriesLeft = retriesLeft;
	return error;
};

const isNetworkError = errorMessage => networkErrorMsgs.includes(errorMessage);

const pRetry = (input, options) => new Promise((resolve, reject) => {
	options = {
		onFailedAttempt: () => {},
		retries: 10,
		...options
	};

	const operation = retry.operation(options);

	operation.attempt(async attemptNumber => {
		try {
			resolve(await input(attemptNumber));
		} catch (error) {
			if (!(error instanceof Error)) {
				reject(new TypeError(`Non-error was thrown: "${error}". You should only throw errors.`));
				return;
			}

			if (error instanceof AbortError) {
				operation.stop();
				reject(error.originalError);
			} else if (error instanceof TypeError && !isNetworkError(error.message)) {
				operation.stop();
				reject(error);
			} else {
				decorateErrorWithCounts(error, attemptNumber, options);

				try {
					await options.onFailedAttempt(error);
				} catch (error) {
					reject(error);
					return;
				}

				if (!operation.retry(error)) {
					reject(operation.mainError());
				}
			}
		}
	});
});

module.exports = pRetry;
// TODO: remove this in the next major version
module.exports["default"] = pRetry;

module.exports.AbortError = AbortError;


/***/ }),

/***/ 4802:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const pFinally = __webpack_require__(2766);

class TimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

const pTimeout = (promise, milliseconds, fallback) => new Promise((resolve, reject) => {
	if (typeof milliseconds !== 'number' || milliseconds < 0) {
		throw new TypeError('Expected `milliseconds` to be a positive number');
	}

	if (milliseconds === Infinity) {
		resolve(promise);
		return;
	}

	const timer = setTimeout(() => {
		if (typeof fallback === 'function') {
			try {
				resolve(fallback());
			} catch (error) {
				reject(error);
			}

			return;
		}

		const message = typeof fallback === 'string' ? fallback : `Promise timed out after ${milliseconds} milliseconds`;
		const timeoutError = fallback instanceof Error ? fallback : new TimeoutError(message);

		if (typeof promise.cancel === 'function') {
			promise.cancel();
		}

		reject(timeoutError);
	}, milliseconds);

	// TODO: Use native `finally` keyword when targeting Node.js 10
	pFinally(
		// eslint-disable-next-line promise/prefer-await-to-then
		promise.then(resolve, reject),
		() => {
			clearTimeout(timer);
		}
	);
});

module.exports = pTimeout;
// TODO: Remove this for the next major release
module.exports["default"] = pTimeout;

module.exports.TimeoutError = TimeoutError;


/***/ }),

/***/ 5546:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(7084);

/***/ }),

/***/ 7084:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var RetryOperation = __webpack_require__(9538);

exports.operation = function(options) {
  var timeouts = exports.timeouts(options);
  return new RetryOperation(timeouts, {
      forever: options && (options.forever || options.retries === Infinity),
      unref: options && options.unref,
      maxRetryTime: options && options.maxRetryTime
  });
};

exports.timeouts = function(options) {
  if (options instanceof Array) {
    return [].concat(options);
  }

  var opts = {
    retries: 10,
    factor: 2,
    minTimeout: 1 * 1000,
    maxTimeout: Infinity,
    randomize: false
  };
  for (var key in options) {
    opts[key] = options[key];
  }

  if (opts.minTimeout > opts.maxTimeout) {
    throw new Error('minTimeout is greater than maxTimeout');
  }

  var timeouts = [];
  for (var i = 0; i < opts.retries; i++) {
    timeouts.push(this.createTimeout(i, opts));
  }

  if (options && options.forever && !timeouts.length) {
    timeouts.push(this.createTimeout(i, opts));
  }

  // sort the array numerically ascending
  timeouts.sort(function(a,b) {
    return a - b;
  });

  return timeouts;
};

exports.createTimeout = function(attempt, opts) {
  var random = (opts.randomize)
    ? (Math.random() + 1)
    : 1;

  var timeout = Math.round(random * Math.max(opts.minTimeout, 1) * Math.pow(opts.factor, attempt));
  timeout = Math.min(timeout, opts.maxTimeout);

  return timeout;
};

exports.wrap = function(obj, options, methods) {
  if (options instanceof Array) {
    methods = options;
    options = null;
  }

  if (!methods) {
    methods = [];
    for (var key in obj) {
      if (typeof obj[key] === 'function') {
        methods.push(key);
      }
    }
  }

  for (var i = 0; i < methods.length; i++) {
    var method   = methods[i];
    var original = obj[method];

    obj[method] = function retryWrapper(original) {
      var op       = exports.operation(options);
      var args     = Array.prototype.slice.call(arguments, 1);
      var callback = args.pop();

      args.push(function(err) {
        if (op.retry(err)) {
          return;
        }
        if (err) {
          arguments[0] = op.mainError();
        }
        callback.apply(this, arguments);
      });

      op.attempt(function() {
        original.apply(obj, args);
      });
    }.bind(obj, original);
    obj[method].options = options;
  }
};


/***/ }),

/***/ 9538:
/***/ ((module) => {

function RetryOperation(timeouts, options) {
  // Compatibility for the old (timeouts, retryForever) signature
  if (typeof options === 'boolean') {
    options = { forever: options };
  }

  this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
  this._timeouts = timeouts;
  this._options = options || {};
  this._maxRetryTime = options && options.maxRetryTime || Infinity;
  this._fn = null;
  this._errors = [];
  this._attempts = 1;
  this._operationTimeout = null;
  this._operationTimeoutCb = null;
  this._timeout = null;
  this._operationStart = null;
  this._timer = null;

  if (this._options.forever) {
    this._cachedTimeouts = this._timeouts.slice(0);
  }
}
module.exports = RetryOperation;

RetryOperation.prototype.reset = function() {
  this._attempts = 1;
  this._timeouts = this._originalTimeouts.slice(0);
}

RetryOperation.prototype.stop = function() {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }
  if (this._timer) {
    clearTimeout(this._timer);
  }

  this._timeouts       = [];
  this._cachedTimeouts = null;
};

RetryOperation.prototype.retry = function(err) {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }

  if (!err) {
    return false;
  }
  var currentTime = new Date().getTime();
  if (err && currentTime - this._operationStart >= this._maxRetryTime) {
    this._errors.push(err);
    this._errors.unshift(new Error('RetryOperation timeout occurred'));
    return false;
  }

  this._errors.push(err);

  var timeout = this._timeouts.shift();
  if (timeout === undefined) {
    if (this._cachedTimeouts) {
      // retry forever, only keep last error
      this._errors.splice(0, this._errors.length - 1);
      timeout = this._cachedTimeouts.slice(-1);
    } else {
      return false;
    }
  }

  var self = this;
  this._timer = setTimeout(function() {
    self._attempts++;

    if (self._operationTimeoutCb) {
      self._timeout = setTimeout(function() {
        self._operationTimeoutCb(self._attempts);
      }, self._operationTimeout);

      if (self._options.unref) {
          self._timeout.unref();
      }
    }

    self._fn(self._attempts);
  }, timeout);

  if (this._options.unref) {
      this._timer.unref();
  }

  return true;
};

RetryOperation.prototype.attempt = function(fn, timeoutOps) {
  this._fn = fn;

  if (timeoutOps) {
    if (timeoutOps.timeout) {
      this._operationTimeout = timeoutOps.timeout;
    }
    if (timeoutOps.cb) {
      this._operationTimeoutCb = timeoutOps.cb;
    }
  }

  var self = this;
  if (this._operationTimeoutCb) {
    this._timeout = setTimeout(function() {
      self._operationTimeoutCb();
    }, self._operationTimeout);
  }

  this._operationStart = new Date().getTime();

  this._fn(this._attempts);
};

RetryOperation.prototype.try = function(fn) {
  console.log('Using RetryOperation.try() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = function(fn) {
  console.log('Using RetryOperation.start() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = RetryOperation.prototype.try;

RetryOperation.prototype.errors = function() {
  return this._errors;
};

RetryOperation.prototype.attempts = function() {
  return this._attempts;
};

RetryOperation.prototype.mainError = function() {
  if (this._errors.length === 0) {
    return null;
  }

  var counts = {};
  var mainError = null;
  var mainErrorCount = 0;

  for (var i = 0; i < this._errors.length; i++) {
    var error = this._errors[i];
    var message = error.message;
    var count = (counts[message] || 0) + 1;

    counts[message] = count;

    if (count >= mainErrorCount) {
      mainError = error;
      mainErrorCount = count;
    }
  }

  return mainError;
};


/***/ }),

/***/ 7269:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*! Axios v1.8.4 Copyright (c) 2025 Matt Zabriskie and contributors */


const FormData$1 = __webpack_require__(6454);
const crypto = __webpack_require__(6982);
const url = __webpack_require__(7016);
const proxyFromEnv = __webpack_require__(7777);
const http = __webpack_require__(8611);
const https = __webpack_require__(5692);
const util = __webpack_require__(9023);
const followRedirects = __webpack_require__(1573);
const zlib = __webpack_require__(3106);
const stream = __webpack_require__(2203);
const events = __webpack_require__(4434);

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const FormData__default = /*#__PURE__*/_interopDefaultLegacy(FormData$1);
const crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
const url__default = /*#__PURE__*/_interopDefaultLegacy(url);
const proxyFromEnv__default = /*#__PURE__*/_interopDefaultLegacy(proxyFromEnv);
const http__default = /*#__PURE__*/_interopDefaultLegacy(http);
const https__default = /*#__PURE__*/_interopDefaultLegacy(https);
const util__default = /*#__PURE__*/_interopDefaultLegacy(util);
const followRedirects__default = /*#__PURE__*/_interopDefaultLegacy(followRedirects);
const zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);
const stream__default = /*#__PURE__*/_interopDefaultLegacy(stream);

function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************

const utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

utils$1.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const prototype$1 = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils$1.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData__default["default"] || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils$1.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils$1.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

  if (!utils$1.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils$1.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils$1.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils$1.isArray(value) && isFlatArray(value)) ||
        ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils$1.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils$1.forEach(value, function each(el, key) {
      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils$1.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  if (utils$1.isFunction(options)) {
    options = {
      serialize: options
    };
  } 

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$1.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

const InterceptorManager$1 = InterceptorManager;

const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

const URLSearchParams = url__default["default"].URLSearchParams;

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  const randomValues = new Uint32Array(size);
  crypto__default["default"].randomFillSync(randomValues);
  for (let i = 0; i < size; i++) {
    str += alphabet[randomValues[i] % length];
  }

  return str;
};


const platform$1 = {
  isNode: true,
  classes: {
    URLSearchParams,
    FormData: FormData__default["default"],
    Blob: typeof Blob !== 'undefined' && Blob || null
  },
  ALPHABET,
  generateString,
  protocols: [ 'http', 'https', 'file', 'data' ]
};

const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';

const utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hasBrowserEnv: hasBrowserEnv,
  hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
  hasStandardBrowserEnv: hasStandardBrowserEnv,
  navigator: _navigator,
  origin: origin
});

const platform = {
  ...utils,
  ...platform$1
};

function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils$1.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils$1.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils$1.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils$1.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};

    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils$1.isObject(data);

    if (isObjectPayload && utils$1.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils$1.isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils$1.isArrayBuffer(data) ||
      utils$1.isBuffer(data) ||
      utils$1.isStream(data) ||
      utils$1.isFile(data) ||
      utils$1.isBlob(data) ||
      utils$1.isReadableStream(data)
    ) {
      return data;
    }
    if (utils$1.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$1.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
      return data;
    }

    if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

const defaults$1 = defaults;

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils$1.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
const parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils$1.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils$1.isString(value)) return;

  if (utils$1.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils$1.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils$1.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$1.isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils$1.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils$1.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils$1.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils$1.freezeMethods(AxiosHeaders);

const AxiosHeaders$1 = AxiosHeaders;

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils$1.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

const VERSION = "1.8.4";

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;

/**
 * Parse data uri to a Buffer or Blob
 *
 * @param {String} uri
 * @param {?Boolean} asBlob
 * @param {?Object} options
 * @param {?Function} options.Blob
 *
 * @returns {Buffer|Blob}
 */
function fromDataURI(uri, asBlob, options) {
  const _Blob = options && options.Blob || platform.classes.Blob;
  const protocol = parseProtocol(uri);

  if (asBlob === undefined && _Blob) {
    asBlob = true;
  }

  if (protocol === 'data') {
    uri = protocol.length ? uri.slice(protocol.length + 1) : uri;

    const match = DATA_URL_PATTERN.exec(uri);

    if (!match) {
      throw new AxiosError('Invalid URL', AxiosError.ERR_INVALID_URL);
    }

    const mime = match[1];
    const isBase64 = match[2];
    const body = match[3];
    const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? 'base64' : 'utf8');

    if (asBlob) {
      if (!_Blob) {
        throw new AxiosError('Blob is not supported', AxiosError.ERR_NOT_SUPPORT);
      }

      return new _Blob([buffer], {type: mime});
    }

    return buffer;
  }

  throw new AxiosError('Unsupported protocol ' + protocol, AxiosError.ERR_NOT_SUPPORT);
}

const kInternals = Symbol('internals');

class AxiosTransformStream extends stream__default["default"].Transform{
  constructor(options) {
    options = utils$1.toFlatObject(options, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (prop, source) => {
      return !utils$1.isUndefined(source[prop]);
    });

    super({
      readableHighWaterMark: options.chunkSize
    });

    const internals = this[kInternals] = {
      timeWindow: options.timeWindow,
      chunkSize: options.chunkSize,
      maxRate: options.maxRate,
      minChunkSize: options.minChunkSize,
      bytesSeen: 0,
      isCaptured: false,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };

    this.on('newListener', event => {
      if (event === 'progress') {
        if (!internals.isCaptured) {
          internals.isCaptured = true;
        }
      }
    });
  }

  _read(size) {
    const internals = this[kInternals];

    if (internals.onReadCallback) {
      internals.onReadCallback();
    }

    return super._read(size);
  }

  _transform(chunk, encoding, callback) {
    const internals = this[kInternals];
    const maxRate = internals.maxRate;

    const readableHighWaterMark = this.readableHighWaterMark;

    const timeWindow = internals.timeWindow;

    const divider = 1000 / timeWindow;
    const bytesThreshold = (maxRate / divider);
    const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;

    const pushChunk = (_chunk, _callback) => {
      const bytes = Buffer.byteLength(_chunk);
      internals.bytesSeen += bytes;
      internals.bytes += bytes;

      internals.isCaptured && this.emit('progress', internals.bytesSeen);

      if (this.push(_chunk)) {
        process.nextTick(_callback);
      } else {
        internals.onReadCallback = () => {
          internals.onReadCallback = null;
          process.nextTick(_callback);
        };
      }
    };

    const transformChunk = (_chunk, _callback) => {
      const chunkSize = Buffer.byteLength(_chunk);
      let chunkRemainder = null;
      let maxChunkSize = readableHighWaterMark;
      let bytesLeft;
      let passed = 0;

      if (maxRate) {
        const now = Date.now();

        if (!internals.ts || (passed = (now - internals.ts)) >= timeWindow) {
          internals.ts = now;
          bytesLeft = bytesThreshold - internals.bytes;
          internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
          passed = 0;
        }

        bytesLeft = bytesThreshold - internals.bytes;
      }

      if (maxRate) {
        if (bytesLeft <= 0) {
          // next time window
          return setTimeout(() => {
            _callback(null, _chunk);
          }, timeWindow - passed);
        }

        if (bytesLeft < maxChunkSize) {
          maxChunkSize = bytesLeft;
        }
      }

      if (maxChunkSize && chunkSize > maxChunkSize && (chunkSize - maxChunkSize) > minChunkSize) {
        chunkRemainder = _chunk.subarray(maxChunkSize);
        _chunk = _chunk.subarray(0, maxChunkSize);
      }

      pushChunk(_chunk, chunkRemainder ? () => {
        process.nextTick(_callback, null, chunkRemainder);
      } : _callback);
    };

    transformChunk(chunk, function transformNextChunk(err, _chunk) {
      if (err) {
        return callback(err);
      }

      if (_chunk) {
        transformChunk(_chunk, transformNextChunk);
      } else {
        callback(null);
      }
    });
  }
}

const AxiosTransformStream$1 = AxiosTransformStream;

const {asyncIterator} = Symbol;

const readBlob = async function* (blob) {
  if (blob.stream) {
    yield* blob.stream();
  } else if (blob.arrayBuffer) {
    yield await blob.arrayBuffer();
  } else if (blob[asyncIterator]) {
    yield* blob[asyncIterator]();
  } else {
    yield blob;
  }
};

const readBlob$1 = readBlob;

const BOUNDARY_ALPHABET = platform.ALPHABET.ALPHA_DIGIT + '-_';

const textEncoder = typeof TextEncoder === 'function' ? new TextEncoder() : new util__default["default"].TextEncoder();

const CRLF = '\r\n';
const CRLF_BYTES = textEncoder.encode(CRLF);
const CRLF_BYTES_COUNT = 2;

class FormDataPart {
  constructor(name, value) {
    const {escapeName} = this.constructor;
    const isStringValue = utils$1.isString(value);

    let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${
      !isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ''
    }${CRLF}`;

    if (isStringValue) {
      value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
    } else {
      headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
    }

    this.headers = textEncoder.encode(headers + CRLF);

    this.contentLength = isStringValue ? value.byteLength : value.size;

    this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;

    this.name = name;
    this.value = value;
  }

  async *encode(){
    yield this.headers;

    const {value} = this;

    if(utils$1.isTypedArray(value)) {
      yield value;
    } else {
      yield* readBlob$1(value);
    }

    yield CRLF_BYTES;
  }

  static escapeName(name) {
      return String(name).replace(/[\r\n"]/g, (match) => ({
        '\r' : '%0D',
        '\n' : '%0A',
        '"' : '%22',
      }[match]));
  }
}

const formDataToStream = (form, headersHandler, options) => {
  const {
    tag = 'form-data-boundary',
    size = 25,
    boundary = tag + '-' + platform.generateString(size, BOUNDARY_ALPHABET)
  } = options || {};

  if(!utils$1.isFormData(form)) {
    throw TypeError('FormData instance required');
  }

  if (boundary.length < 1 || boundary.length > 70) {
    throw Error('boundary must be 10-70 characters long')
  }

  const boundaryBytes = textEncoder.encode('--' + boundary + CRLF);
  const footerBytes = textEncoder.encode('--' + boundary + '--' + CRLF + CRLF);
  let contentLength = footerBytes.byteLength;

  const parts = Array.from(form.entries()).map(([name, value]) => {
    const part = new FormDataPart(name, value);
    contentLength += part.size;
    return part;
  });

  contentLength += boundaryBytes.byteLength * parts.length;

  contentLength = utils$1.toFiniteNumber(contentLength);

  const computedHeaders = {
    'Content-Type': `multipart/form-data; boundary=${boundary}`
  };

  if (Number.isFinite(contentLength)) {
    computedHeaders['Content-Length'] = contentLength;
  }

  headersHandler && headersHandler(computedHeaders);

  return stream.Readable.from((async function *() {
    for(const part of parts) {
      yield boundaryBytes;
      yield* part.encode();
    }

    yield footerBytes;
  })());
};

const formDataToStream$1 = formDataToStream;

class ZlibHeaderTransformStream extends stream__default["default"].Transform {
  __transform(chunk, encoding, callback) {
    this.push(chunk);
    callback();
  }

  _transform(chunk, encoding, callback) {
    if (chunk.length !== 0) {
      this._transform = this.__transform;

      // Add Default Compression headers if no zlib headers are present
      if (chunk[0] !== 120) { // Hex: 78
        const header = Buffer.alloc(2);
        header[0] = 120; // Hex: 78
        header[1] = 156; // Hex: 9C 
        this.push(header, encoding);
      }
    }

    this.__transform(chunk, encoding, callback);
  }
}

const ZlibHeaderTransformStream$1 = ZlibHeaderTransformStream;

const callbackify = (fn, reducer) => {
  return utils$1.isAsyncFn(fn) ? function (...args) {
    const cb = args.pop();
    fn.apply(this, args).then((value) => {
      try {
        reducer ? cb(null, ...reducer(value)) : cb(null, value);
      } catch (err) {
        cb(err);
      }
    }, cb);
  } : fn;
};

const callbackify$1 = callbackify;

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  };

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return throttle(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
};

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};

const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));

const zlibOptions = {
  flush: zlib__default["default"].constants.Z_SYNC_FLUSH,
  finishFlush: zlib__default["default"].constants.Z_SYNC_FLUSH
};

const brotliOptions = {
  flush: zlib__default["default"].constants.BROTLI_OPERATION_FLUSH,
  finishFlush: zlib__default["default"].constants.BROTLI_OPERATION_FLUSH
};

const isBrotliSupported = utils$1.isFunction(zlib__default["default"].createBrotliDecompress);

const {http: httpFollow, https: httpsFollow} = followRedirects__default["default"];

const isHttps = /https:?/;

const supportedProtocols = platform.protocols.map(protocol => {
  return protocol + ':';
});

const flushOnFinish = (stream, [throttled, flush]) => {
  stream
    .on('end', flush)
    .on('error', flush);

  return throttled;
};

/**
 * If the proxy or config beforeRedirects functions are defined, call them with the options
 * object.
 *
 * @param {Object<string, any>} options - The options object that was passed to the request.
 *
 * @returns {Object<string, any>}
 */
function dispatchBeforeRedirect(options, responseDetails) {
  if (options.beforeRedirects.proxy) {
    options.beforeRedirects.proxy(options);
  }
  if (options.beforeRedirects.config) {
    options.beforeRedirects.config(options, responseDetails);
  }
}

/**
 * If the proxy or config afterRedirects functions are defined, call them with the options
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} configProxy configuration from Axios options object
 * @param {string} location
 *
 * @returns {http.ClientRequestArgs}
 */
function setProxy(options, configProxy, location) {
  let proxy = configProxy;
  if (!proxy && proxy !== false) {
    const proxyUrl = proxyFromEnv__default["default"].getProxyForUrl(location);
    if (proxyUrl) {
      proxy = new URL(proxyUrl);
    }
  }
  if (proxy) {
    // Basic proxy authorization
    if (proxy.username) {
      proxy.auth = (proxy.username || '') + ':' + (proxy.password || '');
    }

    if (proxy.auth) {
      // Support proxy auth object form
      if (proxy.auth.username || proxy.auth.password) {
        proxy.auth = (proxy.auth.username || '') + ':' + (proxy.auth.password || '');
      }
      const base64 = Buffer
        .from(proxy.auth, 'utf8')
        .toString('base64');
      options.headers['Proxy-Authorization'] = 'Basic ' + base64;
    }

    options.headers.host = options.hostname + (options.port ? ':' + options.port : '');
    const proxyHost = proxy.hostname || proxy.host;
    options.hostname = proxyHost;
    // Replace 'host' since options is not a URL object
    options.host = proxyHost;
    options.port = proxy.port;
    options.path = location;
    if (proxy.protocol) {
      options.protocol = proxy.protocol.includes(':') ? proxy.protocol : `${proxy.protocol}:`;
    }
  }

  options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
    // Configure proxy for redirected request, passing the original config proxy to apply
    // the exact same logic as if the redirected request was performed by axios directly.
    setProxy(redirectOptions, configProxy, redirectOptions.href);
  };
}

const isHttpAdapterSupported = typeof process !== 'undefined' && utils$1.kindOf(process) === 'process';

// temporary hotfix

const wrapAsync = (asyncExecutor) => {
  return new Promise((resolve, reject) => {
    let onDone;
    let isDone;

    const done = (value, isRejected) => {
      if (isDone) return;
      isDone = true;
      onDone && onDone(value, isRejected);
    };

    const _resolve = (value) => {
      done(value);
      resolve(value);
    };

    const _reject = (reason) => {
      done(reason, true);
      reject(reason);
    };

    asyncExecutor(_resolve, _reject, (onDoneHandler) => (onDone = onDoneHandler)).catch(_reject);
  })
};

const resolveFamily = ({address, family}) => {
  if (!utils$1.isString(address)) {
    throw TypeError('address must be a string');
  }
  return ({
    address,
    family: family || (address.indexOf('.') < 0 ? 6 : 4)
  });
};

const buildAddressEntry = (address, family) => resolveFamily(utils$1.isObject(address) ? address : {address, family});

/*eslint consistent-return:0*/
const httpAdapter = isHttpAdapterSupported && function httpAdapter(config) {
  return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
    let {data, lookup, family} = config;
    const {responseType, responseEncoding} = config;
    const method = config.method.toUpperCase();
    let isDone;
    let rejected = false;
    let req;

    if (lookup) {
      const _lookup = callbackify$1(lookup, (value) => utils$1.isArray(value) ? value : [value]);
      // hotfix to support opt.all option which is required for node 20.x
      lookup = (hostname, opt, cb) => {
        _lookup(hostname, opt, (err, arg0, arg1) => {
          if (err) {
            return cb(err);
          }

          const addresses = utils$1.isArray(arg0) ? arg0.map(addr => buildAddressEntry(addr)) : [buildAddressEntry(arg0, arg1)];

          opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
        });
      };
    }

    // temporary internal emitter until the AxiosRequest class will be implemented
    const emitter = new events.EventEmitter();

    const onFinished = () => {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(abort);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', abort);
      }

      emitter.removeAllListeners();
    };

    onDone((value, isRejected) => {
      isDone = true;
      if (isRejected) {
        rejected = true;
        onFinished();
      }
    });

    function abort(reason) {
      emitter.emit('abort', !reason || reason.type ? new CanceledError(null, config, req) : reason);
    }

    emitter.once('abort', reject);

    if (config.cancelToken || config.signal) {
      config.cancelToken && config.cancelToken.subscribe(abort);
      if (config.signal) {
        config.signal.aborted ? abort() : config.signal.addEventListener('abort', abort);
      }
    }

    // Parse url
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    const parsed = new URL(fullPath, platform.hasBrowserEnv ? platform.origin : undefined);
    const protocol = parsed.protocol || supportedProtocols[0];

    if (protocol === 'data:') {
      let convertedData;

      if (method !== 'GET') {
        return settle(resolve, reject, {
          status: 405,
          statusText: 'method not allowed',
          headers: {},
          config
        });
      }

      try {
        convertedData = fromDataURI(config.url, responseType === 'blob', {
          Blob: config.env && config.env.Blob
        });
      } catch (err) {
        throw AxiosError.from(err, AxiosError.ERR_BAD_REQUEST, config);
      }

      if (responseType === 'text') {
        convertedData = convertedData.toString(responseEncoding);

        if (!responseEncoding || responseEncoding === 'utf8') {
          convertedData = utils$1.stripBOM(convertedData);
        }
      } else if (responseType === 'stream') {
        convertedData = stream__default["default"].Readable.from(convertedData);
      }

      return settle(resolve, reject, {
        data: convertedData,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders$1(),
        config
      });
    }

    if (supportedProtocols.indexOf(protocol) === -1) {
      return reject(new AxiosError(
        'Unsupported protocol ' + protocol,
        AxiosError.ERR_BAD_REQUEST,
        config
      ));
    }

    const headers = AxiosHeaders$1.from(config.headers).normalize();

    // Set User-Agent (required by some servers)
    // See https://github.com/axios/axios/issues/69
    // User-Agent is specified; handle case where no UA header is desired
    // Only set header if it hasn't been set in config
    headers.set('User-Agent', 'axios/' + VERSION, false);

    const {onUploadProgress, onDownloadProgress} = config;
    const maxRate = config.maxRate;
    let maxUploadRate = undefined;
    let maxDownloadRate = undefined;

    // support for spec compliant FormData objects
    if (utils$1.isSpecCompliantForm(data)) {
      const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);

      data = formDataToStream$1(data, (formHeaders) => {
        headers.set(formHeaders);
      }, {
        tag: `axios-${VERSION}-boundary`,
        boundary: userBoundary && userBoundary[1] || undefined
      });
      // support for https://www.npmjs.com/package/form-data api
    } else if (utils$1.isFormData(data) && utils$1.isFunction(data.getHeaders)) {
      headers.set(data.getHeaders());

      if (!headers.hasContentLength()) {
        try {
          const knownLength = await util__default["default"].promisify(data.getLength).call(data);
          Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
          /*eslint no-empty:0*/
        } catch (e) {
        }
      }
    } else if (utils$1.isBlob(data) || utils$1.isFile(data)) {
      data.size && headers.setContentType(data.type || 'application/octet-stream');
      headers.setContentLength(data.size || 0);
      data = stream__default["default"].Readable.from(readBlob$1(data));
    } else if (data && !utils$1.isStream(data)) {
      if (Buffer.isBuffer(data)) ; else if (utils$1.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils$1.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(new AxiosError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          AxiosError.ERR_BAD_REQUEST,
          config
        ));
      }

      // Add Content-Length header if data exists
      headers.setContentLength(data.length, false);

      if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
        return reject(new AxiosError(
          'Request body larger than maxBodyLength limit',
          AxiosError.ERR_BAD_REQUEST,
          config
        ));
      }
    }

    const contentLength = utils$1.toFiniteNumber(headers.getContentLength());

    if (utils$1.isArray(maxRate)) {
      maxUploadRate = maxRate[0];
      maxDownloadRate = maxRate[1];
    } else {
      maxUploadRate = maxDownloadRate = maxRate;
    }

    if (data && (onUploadProgress || maxUploadRate)) {
      if (!utils$1.isStream(data)) {
        data = stream__default["default"].Readable.from(data, {objectMode: false});
      }

      data = stream__default["default"].pipeline([data, new AxiosTransformStream$1({
        maxRate: utils$1.toFiniteNumber(maxUploadRate)
      })], utils$1.noop);

      onUploadProgress && data.on('progress', flushOnFinish(
        data,
        progressEventDecorator(
          contentLength,
          progressEventReducer(asyncDecorator(onUploadProgress), false, 3)
        )
      ));
    }

    // HTTP basic authentication
    let auth = undefined;
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password || '';
      auth = username + ':' + password;
    }

    if (!auth && parsed.username) {
      const urlUsername = parsed.username;
      const urlPassword = parsed.password;
      auth = urlUsername + ':' + urlPassword;
    }

    auth && headers.delete('authorization');

    let path;

    try {
      path = buildURL(
        parsed.pathname + parsed.search,
        config.params,
        config.paramsSerializer
      ).replace(/^\?/, '');
    } catch (err) {
      const customErr = new Error(err.message);
      customErr.config = config;
      customErr.url = config.url;
      customErr.exists = true;
      return reject(customErr);
    }

    headers.set(
      'Accept-Encoding',
      'gzip, compress, deflate' + (isBrotliSupported ? ', br' : ''), false
      );

    const options = {
      path,
      method: method,
      headers: headers.toJSON(),
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth,
      protocol,
      family,
      beforeRedirect: dispatchBeforeRedirect,
      beforeRedirects: {}
    };

    // cacheable-lookup integration hotfix
    !utils$1.isUndefined(lookup) && (options.lookup = lookup);

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname.startsWith("[") ? parsed.hostname.slice(1, -1) : parsed.hostname;
      options.port = parsed.port;
      setProxy(options, config.proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    let transport;
    const isHttpsRequest = isHttps.test(options.protocol);
    options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsRequest ? https__default["default"] : http__default["default"];
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      if (config.beforeRedirect) {
        options.beforeRedirects.config = config.beforeRedirect;
      }
      transport = isHttpsRequest ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    } else {
      // follow-redirects does not skip comparison, so it should always succeed for axios -1 unlimited
      options.maxBodyLength = Infinity;
    }

    if (config.insecureHTTPParser) {
      options.insecureHTTPParser = config.insecureHTTPParser;
    }

    // Create the request
    req = transport.request(options, function handleResponse(res) {
      if (req.destroyed) return;

      const streams = [res];

      const responseLength = +res.headers['content-length'];

      if (onDownloadProgress || maxDownloadRate) {
        const transformStream = new AxiosTransformStream$1({
          maxRate: utils$1.toFiniteNumber(maxDownloadRate)
        });

        onDownloadProgress && transformStream.on('progress', flushOnFinish(
          transformStream,
          progressEventDecorator(
            responseLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true, 3)
          )
        ));

        streams.push(transformStream);
      }

      // decompress the response body transparently if required
      let responseStream = res;

      // return the last request in case of redirects
      const lastRequest = res.req || req;

      // if decompress disabled we should not decompress
      if (config.decompress !== false && res.headers['content-encoding']) {
        // if no content, but headers still say that it is encoded,
        // remove the header not confuse downstream operations
        if (method === 'HEAD' || res.statusCode === 204) {
          delete res.headers['content-encoding'];
        }

        switch ((res.headers['content-encoding'] || '').toLowerCase()) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'x-gzip':
        case 'compress':
        case 'x-compress':
          // add the unzipper to the body stream processing pipeline
          streams.push(zlib__default["default"].createUnzip(zlibOptions));

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        case 'deflate':
          streams.push(new ZlibHeaderTransformStream$1());

          // add the unzipper to the body stream processing pipeline
          streams.push(zlib__default["default"].createUnzip(zlibOptions));

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        case 'br':
          if (isBrotliSupported) {
            streams.push(zlib__default["default"].createBrotliDecompress(brotliOptions));
            delete res.headers['content-encoding'];
          }
        }
      }

      responseStream = streams.length > 1 ? stream__default["default"].pipeline(streams, utils$1.noop) : streams[0];

      const offListeners = stream__default["default"].finished(responseStream, () => {
        offListeners();
        onFinished();
      });

      const response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: new AxiosHeaders$1(res.headers),
        config,
        request: lastRequest
      };

      if (responseType === 'stream') {
        response.data = responseStream;
        settle(resolve, reject, response);
      } else {
        const responseBuffer = [];
        let totalResponseBytes = 0;

        responseStream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
            // stream.destroy() emit aborted event before calling reject() on Node.js v16
            rejected = true;
            responseStream.destroy();
            reject(new AxiosError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              AxiosError.ERR_BAD_RESPONSE, config, lastRequest));
          }
        });

        responseStream.on('aborted', function handlerStreamAborted() {
          if (rejected) {
            return;
          }

          const err = new AxiosError(
            'stream has been aborted',
            AxiosError.ERR_BAD_RESPONSE,
            config,
            lastRequest
          );
          responseStream.destroy(err);
          reject(err);
        });

        responseStream.on('error', function handleStreamError(err) {
          if (req.destroyed) return;
          reject(AxiosError.from(err, null, config, lastRequest));
        });

        responseStream.on('end', function handleStreamEnd() {
          try {
            let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
            if (responseType !== 'arraybuffer') {
              responseData = responseData.toString(responseEncoding);
              if (!responseEncoding || responseEncoding === 'utf8') {
                responseData = utils$1.stripBOM(responseData);
              }
            }
            response.data = responseData;
          } catch (err) {
            return reject(AxiosError.from(err, null, config, response.request, response));
          }
          settle(resolve, reject, response);
        });
      }

      emitter.once('abort', err => {
        if (!responseStream.destroyed) {
          responseStream.emit('error', err);
          responseStream.destroy();
        }
      });
    });

    emitter.once('abort', err => {
      reject(err);
      req.destroy(err);
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      // @todo remove
      // if (req.aborted && err.code !== AxiosError.ERR_FR_TOO_MANY_REDIRECTS) return;
      reject(AxiosError.from(err, null, config, req));
    });

    // set tcp keep alive to prevent drop connection by peer
    req.on('socket', function handleRequestSocket(socket) {
      // default interval of sending ack packet is 1 minute
      socket.setKeepAlive(true, 1000 * 60);
    });

    // Handle request timeout
    if (config.timeout) {
      // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
      const timeout = parseInt(config.timeout, 10);

      if (Number.isNaN(timeout)) {
        reject(new AxiosError(
          'error trying to parse `config.timeout` to int',
          AxiosError.ERR_BAD_OPTION_VALUE,
          config,
          req
        ));

        return;
      }

      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devouring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(timeout, function handleRequestTimeout() {
        if (isDone) return;
        let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
        const transitional = config.transitional || transitionalDefaults;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(new AxiosError(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
          config,
          req
        ));
        abort();
      });
    }


    // Send the request
    if (utils$1.isStream(data)) {
      let ended = false;
      let errored = false;

      data.on('end', () => {
        ended = true;
      });

      data.once('error', err => {
        errored = true;
        req.destroy(err);
      });

      data.on('close', () => {
        if (!ended && !errored) {
          abort(new CanceledError('Request stream has been aborted', config, req));
        }
      });

      data.pipe(req);
    } else {
      req.end(data);
    }
  });
};

const isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
  url = new URL(url, platform.origin);

  return (
    origin.protocol === url.protocol &&
    origin.host === url.host &&
    (isMSIE || origin.port === url.port)
  );
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true;

const cookies = platform.hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      utils$1.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      utils$1.isString(path) && cookie.push('path=' + path);

      utils$1.isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  };

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({caseless}, target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop , caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, prop , caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a, prop , caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
  };

  utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

const resolveConfig = (config) => {
  const newConfig = mergeConfig({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = AxiosHeaders$1.from(headers);

  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (utils$1.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
};

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

const xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils$1.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(_config.url);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
      }
    };

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
    }, timeout);

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    };

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => utils$1.asap(unsubscribe);

    return signal;
  }
};

const composeSignals$1 = composeSignals;

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
};

const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
};

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(platform.origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => utils$1.isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
      });
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(utils$1.isBlob(body)) {
    return body.size;
  }

  if(utils$1.isSpecCompliantForm(body)) {
    const _request = new Request(platform.origin, {
      method: 'POST',
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }

  if(utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(utils$1.isURLSearchParams(body)) {
    body = body + '';
  }

  if(utils$1.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};

const resolveBodyLength = async (headers, body) => {
  const length = utils$1.toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
};

const fetchAdapter = isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = resolveConfig(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = composeSignals$1([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader);
      }

      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );

        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!utils$1.isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];

      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders$1.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      });
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw AxiosError.from(err, err && err.code, config, request);
  }
});

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
};

utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

const adapters = {
  getAdapter: (adapters) => {
    adapters = utils$1.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new AxiosError(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new AxiosError(
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  }
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

const validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack;
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    validator.assertOptions(config, {
      baseUrl: validators.spelling('baseURL'),
      withXsrfToken: validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils$1.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils$1.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

const Axios$1 = Axios;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

const CancelToken$1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils$1.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

const HttpStatusCode$1 = HttpStatusCode;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils$1.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils$1.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults$1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;

// Expose AxiosError class
axios.AxiosError = AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

module.exports = axios;
//# sourceMappingURL=axios.cjs.map


/***/ }),

/***/ 6734:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"name":"@slack/web-api","version":"7.9.2","description":"Official library for using the Slack Platform\'s Web API","author":"Slack Technologies, LLC","license":"MIT","keywords":["slack","web-api","bot","client","http","api","proxy","rate-limiting","pagination"],"main":"dist/index.js","types":"./dist/index.d.ts","files":["dist/**/*"],"engines":{"node":">= 18","npm":">= 8.6.0"},"repository":"slackapi/node-slack-sdk","homepage":"https://tools.slack.dev/node-slack-sdk/web-api","publishConfig":{"access":"public"},"bugs":{"url":"https://github.com/slackapi/node-slack-sdk/issues"},"scripts":{"prepare":"npm run build","build":"npm run build:clean && tsc","build:clean":"shx rm -rf ./dist ./coverage","lint":"npx @biomejs/biome check .","lint:fix":"npx @biomejs/biome check --write .","mocha":"mocha --config ./test/.mocharc.json \\"./src/**/*.spec.ts\\"","test":"npm run lint && npm run test:types && npm run test:integration && npm run test:unit","test:integration":"npm run build && node test/integration/commonjs-project/index.js && node test/integration/esm-project/index.mjs && npm run test:integration:ts","test:integration:ts":"cd test/integration/ts-4.7-project && npm i && npm run build","test:unit":"npm run build && c8 --config ./test/.c8rc.json npm run mocha","test:types":"tsd","watch":"npx nodemon --watch \'src\' --ext \'ts\' --exec npm run build"},"dependencies":{"@slack/logger":"^4.0.0","@slack/types":"^2.9.0","@types/node":">=18.0.0","@types/retry":"0.12.0","axios":"^1.8.3","eventemitter3":"^5.0.1","form-data":"^4.0.0","is-electron":"2.2.2","is-stream":"^2","p-queue":"^6","p-retry":"^4","retry":"^0.13.1"},"devDependencies":{"@biomejs/biome":"^1.8.3","@tsconfig/recommended":"^1","@types/busboy":"^1.5.4","@types/chai":"^4","@types/mocha":"^10","@types/sinon":"^17","busboy":"^1","c8":"^10.1.2","chai":"^4","mocha":"^11","mocha-junit-reporter":"^2.2.1","mocha-multi-reporters":"^1.5.1","nock":"^14","shx":"^0.4.0","sinon":"^20","source-map-support":"^0.5.21","ts-node":"^10","tsd":"^0.32.0","typescript":"5.8.3"},"tsd":{"directory":"test/types"}}');

/***/ })

};

//# sourceMappingURL=105.index.js.map