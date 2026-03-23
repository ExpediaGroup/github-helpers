import {
  getChangedFilepaths
} from "./main-yvnzphn1.js";
import {
  require_lodash
} from "./main-kzxwm80c.js";
import {
  require_bluebird
} from "./main-ttmzs6m5.js";
import {
  octokit
} from "./main-4c5nddsb.js";
import {
  context
} from "./main-p94abnca.js";
import {
  setFailed
} from "./main-q70tmm6g.js";
import {
  __commonJS,
  __require,
  __toESM
} from "./main-wckvcay0.js";

// node_modules/p-try/index.js
var require_p_try = __commonJS((exports, module) => {
  var pTry = (fn, ...arguments_) => new Promise((resolve) => {
    resolve(fn(...arguments_));
  });
  module.exports = pTry;
  module.exports.default = pTry;
});

// node_modules/p-limit/index.js
var require_p_limit = __commonJS((exports, module) => {
  var pTry = require_p_try();
  var pLimit = (concurrency) => {
    if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
      return Promise.reject(new TypeError("Expected `concurrency` to be a number from 1 and up"));
    }
    const queue = [];
    let activeCount = 0;
    const next = () => {
      activeCount--;
      if (queue.length > 0) {
        queue.shift()();
      }
    };
    const run = (fn, resolve, ...args) => {
      activeCount++;
      const result = pTry(fn, ...args);
      resolve(result);
      result.then(next, next);
    };
    const enqueue = (fn, resolve, ...args) => {
      if (activeCount < concurrency) {
        run(fn, resolve, ...args);
      } else {
        queue.push(run.bind(null, fn, resolve, ...args));
      }
    };
    const generator = (fn, ...args) => new Promise((resolve) => enqueue(fn, resolve, ...args));
    Object.defineProperties(generator, {
      activeCount: {
        get: () => activeCount
      },
      pendingCount: {
        get: () => queue.length
      },
      clearQueue: {
        value: () => {
          queue.length = 0;
        }
      }
    });
    return generator;
  };
  module.exports = pLimit;
  module.exports.default = pLimit;
});

// node_modules/p-locate/index.js
var require_p_locate = __commonJS((exports, module) => {
  var pLimit = require_p_limit();

  class EndError extends Error {
    constructor(value) {
      super();
      this.value = value;
    }
  }
  var testElement = async (element, tester) => tester(await element);
  var finder = async (element) => {
    const values = await Promise.all(element);
    if (values[1] === true) {
      throw new EndError(values[0]);
    }
    return false;
  };
  var pLocate = async (iterable, tester, options) => {
    options = {
      concurrency: Infinity,
      preserveOrder: true,
      ...options
    };
    const limit = pLimit(options.concurrency);
    const items = [...iterable].map((element) => [element, limit(testElement, element, tester)]);
    const checkLimit = pLimit(options.preserveOrder ? 1 : Infinity);
    try {
      await Promise.all(items.map((element) => checkLimit(finder, element)));
    } catch (error) {
      if (error instanceof EndError) {
        return error.value;
      }
      throw error;
    }
  };
  module.exports = pLocate;
  module.exports.default = pLocate;
});

// node_modules/locate-path/index.js
var require_locate_path = __commonJS((exports, module) => {
  var path = __require("path");
  var fs = __require("fs");
  var { promisify } = __require("util");
  var pLocate = require_p_locate();
  var fsStat = promisify(fs.stat);
  var fsLStat = promisify(fs.lstat);
  var typeMappings = {
    directory: "isDirectory",
    file: "isFile"
  };
  function checkType({ type }) {
    if (type in typeMappings) {
      return;
    }
    throw new Error(`Invalid type specified: ${type}`);
  }
  var matchType = (type, stat) => type === undefined || stat[typeMappings[type]]();
  module.exports = async (paths, options) => {
    options = {
      cwd: process.cwd(),
      type: "file",
      allowSymlinks: true,
      ...options
    };
    checkType(options);
    const statFn = options.allowSymlinks ? fsStat : fsLStat;
    return pLocate(paths, async (path_) => {
      try {
        const stat = await statFn(path.resolve(options.cwd, path_));
        return matchType(options.type, stat);
      } catch (_) {
        return false;
      }
    }, options);
  };
  module.exports.sync = (paths, options) => {
    options = {
      cwd: process.cwd(),
      allowSymlinks: true,
      type: "file",
      ...options
    };
    checkType(options);
    const statFn = options.allowSymlinks ? fs.statSync : fs.lstatSync;
    for (const path_ of paths) {
      try {
        const stat = statFn(path.resolve(options.cwd, path_));
        if (matchType(options.type, stat)) {
          return path_;
        }
      } catch (_) {}
    }
  };
});

// node_modules/path-exists/index.js
var require_path_exists = __commonJS((exports, module) => {
  var fs = __require("fs");
  var { promisify } = __require("util");
  var pAccess = promisify(fs.access);
  module.exports = async (path) => {
    try {
      await pAccess(path);
      return true;
    } catch (_) {
      return false;
    }
  };
  module.exports.sync = (path) => {
    try {
      fs.accessSync(path);
      return true;
    } catch (_) {
      return false;
    }
  };
});

// node_modules/codeowners-utils/node_modules/find-up/index.js
var require_find_up = __commonJS((exports, module) => {
  var path = __require("path");
  var locatePath = require_locate_path();
  var pathExists = require_path_exists();
  var stop = Symbol("findUp.stop");
  module.exports = async (name, options = {}) => {
    let directory = path.resolve(options.cwd || "");
    const { root } = path.parse(directory);
    const paths = [].concat(name);
    const runMatcher = async (locateOptions) => {
      if (typeof name !== "function") {
        return locatePath(paths, locateOptions);
      }
      const foundPath = await name(locateOptions.cwd);
      if (typeof foundPath === "string") {
        return locatePath([foundPath], locateOptions);
      }
      return foundPath;
    };
    while (true) {
      const foundPath = await runMatcher({ ...options, cwd: directory });
      if (foundPath === stop) {
        return;
      }
      if (foundPath) {
        return path.resolve(directory, foundPath);
      }
      if (directory === root) {
        return;
      }
      directory = path.dirname(directory);
    }
  };
  module.exports.sync = (name, options = {}) => {
    let directory = path.resolve(options.cwd || "");
    const { root } = path.parse(directory);
    const paths = [].concat(name);
    const runMatcher = (locateOptions) => {
      if (typeof name !== "function") {
        return locatePath.sync(paths, locateOptions);
      }
      const foundPath = name(locateOptions.cwd);
      if (typeof foundPath === "string") {
        return locatePath.sync([foundPath], locateOptions);
      }
      return foundPath;
    };
    while (true) {
      const foundPath = runMatcher({ ...options, cwd: directory });
      if (foundPath === stop) {
        return;
      }
      if (foundPath) {
        return path.resolve(directory, foundPath);
      }
      if (directory === root) {
        return;
      }
      directory = path.dirname(directory);
    }
  };
  module.exports.exists = pathExists;
  module.exports.sync.exists = pathExists.sync;
  module.exports.stop = stop;
});

// node_modules/ignore/index.js
var require_ignore = __commonJS((exports, module) => {
  function makeArray(subject) {
    return Array.isArray(subject) ? subject : [subject];
  }
  var EMPTY = "";
  var SPACE = " ";
  var ESCAPE = "\\";
  var REGEX_TEST_BLANK_LINE = /^\s+$/;
  var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
  var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
  var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
  var REGEX_SPLITALL_CRLF = /\r?\n/g;
  var REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/;
  var SLASH = "/";
  var TMP_KEY_IGNORE = "node-ignore";
  if (typeof Symbol !== "undefined") {
    TMP_KEY_IGNORE = Symbol.for("node-ignore");
  }
  var KEY_IGNORE = TMP_KEY_IGNORE;
  var define = (object, key, value) => Object.defineProperty(object, key, { value });
  var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
  var RETURN_FALSE = () => false;
  var sanitizeRange = (range) => range.replace(REGEX_REGEXP_RANGE, (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY);
  var cleanRangeBackSlash = (slashes) => {
    const { length } = slashes;
    return slashes.slice(0, length - length % 2);
  };
  var REPLACERS = [
    [
      /^\uFEFF/,
      () => EMPTY
    ],
    [
      /\\?\s+$/,
      (match) => match.indexOf("\\") === 0 ? SPACE : EMPTY
    ],
    [
      /\\\s/g,
      () => SPACE
    ],
    [
      /[\\$.|*+(){^]/g,
      (match) => `\\${match}`
    ],
    [
      /(?!\\)\?/g,
      () => "[^/]"
    ],
    [
      /^\//,
      () => "^"
    ],
    [
      /\//g,
      () => "\\/"
    ],
    [
      /^\^*\\\*\\\*\\\//,
      () => "^(?:.*\\/)?"
    ],
    [
      /^(?=[^^])/,
      function startingReplacer() {
        return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
      }
    ],
    [
      /\\\/\\\*\\\*(?=\\\/|$)/g,
      (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
    ],
    [
      /(^|[^\\]+)(\\\*)+(?=.+)/g,
      (_, p1, p2) => {
        const unescaped = p2.replace(/\\\*/g, "[^\\/]*");
        return p1 + unescaped;
      }
    ],
    [
      /\\\\\\(?=[$.|*+(){^])/g,
      () => ESCAPE
    ],
    [
      /\\\\/g,
      () => ESCAPE
    ],
    [
      /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
      (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range)}${endEscape}]` : "[]" : "[]"
    ],
    [
      /(?:[^*])$/,
      (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`
    ],
    [
      /(\^|\\\/)?\\\*$/,
      (_, p1) => {
        const prefix = p1 ? `${p1}[^/]+` : "[^/]*";
        return `${prefix}(?=$|\\/$)`;
      }
    ]
  ];
  var regexCache = Object.create(null);
  var makeRegex = (pattern, ignoreCase) => {
    let source = regexCache[pattern];
    if (!source) {
      source = REPLACERS.reduce((prev, current) => prev.replace(current[0], current[1].bind(pattern)), pattern);
      regexCache[pattern] = source;
    }
    return ignoreCase ? new RegExp(source, "i") : new RegExp(source);
  };
  var isString = (subject) => typeof subject === "string";
  var checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0;
  var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF);

  class IgnoreRule {
    constructor(origin, pattern, negative, regex) {
      this.origin = origin;
      this.pattern = pattern;
      this.negative = negative;
      this.regex = regex;
    }
  }
  var createRule = (pattern, ignoreCase) => {
    const origin = pattern;
    let negative = false;
    if (pattern.indexOf("!") === 0) {
      negative = true;
      pattern = pattern.substr(1);
    }
    pattern = pattern.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
    const regex = makeRegex(pattern, ignoreCase);
    return new IgnoreRule(origin, pattern, negative, regex);
  };
  var throwError = (message, Ctor) => {
    throw new Ctor(message);
  };
  var checkPath = (path, originalPath, doThrow) => {
    if (!isString(path)) {
      return doThrow(`path must be a string, but got \`${originalPath}\``, TypeError);
    }
    if (!path) {
      return doThrow(`path must not be empty`, TypeError);
    }
    if (checkPath.isNotRelative(path)) {
      const r = "`path.relative()`d";
      return doThrow(`path should be a ${r} string, but got "${originalPath}"`, RangeError);
    }
    return true;
  };
  var isNotRelative = (path) => REGEX_TEST_INVALID_PATH.test(path);
  checkPath.isNotRelative = isNotRelative;
  checkPath.convert = (p) => p;

  class Ignore {
    constructor({
      ignorecase = true,
      ignoreCase = ignorecase,
      allowRelativePaths = false
    } = {}) {
      define(this, KEY_IGNORE, true);
      this._rules = [];
      this._ignoreCase = ignoreCase;
      this._allowRelativePaths = allowRelativePaths;
      this._initCache();
    }
    _initCache() {
      this._ignoreCache = Object.create(null);
      this._testCache = Object.create(null);
    }
    _addPattern(pattern) {
      if (pattern && pattern[KEY_IGNORE]) {
        this._rules = this._rules.concat(pattern._rules);
        this._added = true;
        return;
      }
      if (checkPattern(pattern)) {
        const rule = createRule(pattern, this._ignoreCase);
        this._added = true;
        this._rules.push(rule);
      }
    }
    add(pattern) {
      this._added = false;
      makeArray(isString(pattern) ? splitPattern(pattern) : pattern).forEach(this._addPattern, this);
      if (this._added) {
        this._initCache();
      }
      return this;
    }
    addPattern(pattern) {
      return this.add(pattern);
    }
    _testOne(path, checkUnignored) {
      let ignored = false;
      let unignored = false;
      this._rules.forEach((rule) => {
        const { negative } = rule;
        if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
          return;
        }
        const matched = rule.regex.test(path);
        if (matched) {
          ignored = !negative;
          unignored = negative;
        }
      });
      return {
        ignored,
        unignored
      };
    }
    _test(originalPath, cache, checkUnignored, slices) {
      const path = originalPath && checkPath.convert(originalPath);
      checkPath(path, originalPath, this._allowRelativePaths ? RETURN_FALSE : throwError);
      return this._t(path, cache, checkUnignored, slices);
    }
    _t(path, cache, checkUnignored, slices) {
      if (path in cache) {
        return cache[path];
      }
      if (!slices) {
        slices = path.split(SLASH);
      }
      slices.pop();
      if (!slices.length) {
        return cache[path] = this._testOne(path, checkUnignored);
      }
      const parent = this._t(slices.join(SLASH) + SLASH, cache, checkUnignored, slices);
      return cache[path] = parent.ignored ? parent : this._testOne(path, checkUnignored);
    }
    ignores(path) {
      return this._test(path, this._ignoreCache, false).ignored;
    }
    createFilter() {
      return (path) => !this.ignores(path);
    }
    filter(paths) {
      return makeArray(paths).filter(this.createFilter());
    }
    test(path) {
      return this._test(path, this._testCache, true);
    }
  }
  var factory = (options) => new Ignore(options);
  var isPathValid = (path) => checkPath(path && checkPath.convert(path), path, RETURN_FALSE);
  factory.isPathValid = isPathValid;
  factory.default = factory;
  module.exports = factory;
  if (typeof process !== "undefined" && (process.env && process.env.IGNORE_TEST_WIN32 || process.platform === "win32")) {
    const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
    checkPath.convert = makePosix;
    const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
    checkPath.isNotRelative = (path) => REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path) || isNotRelative(path);
  }
});

// node_modules/isexe/windows.js
var require_windows = __commonJS((exports, module) => {
  module.exports = isexe;
  isexe.sync = sync;
  var fs = __require("fs");
  function checkPathExt(path, options) {
    var pathext = options.pathExt !== undefined ? options.pathExt : process.env.PATHEXT;
    if (!pathext) {
      return true;
    }
    pathext = pathext.split(";");
    if (pathext.indexOf("") !== -1) {
      return true;
    }
    for (var i = 0;i < pathext.length; i++) {
      var p = pathext[i].toLowerCase();
      if (p && path.substr(-p.length).toLowerCase() === p) {
        return true;
      }
    }
    return false;
  }
  function checkStat(stat, path, options) {
    if (!stat.isSymbolicLink() && !stat.isFile()) {
      return false;
    }
    return checkPathExt(path, options);
  }
  function isexe(path, options, cb) {
    fs.stat(path, function(er, stat) {
      cb(er, er ? false : checkStat(stat, path, options));
    });
  }
  function sync(path, options) {
    return checkStat(fs.statSync(path), path, options);
  }
});

// node_modules/isexe/mode.js
var require_mode = __commonJS((exports, module) => {
  module.exports = isexe;
  isexe.sync = sync;
  var fs = __require("fs");
  function isexe(path, options, cb) {
    fs.stat(path, function(er, stat) {
      cb(er, er ? false : checkStat(stat, options));
    });
  }
  function sync(path, options) {
    return checkStat(fs.statSync(path), options);
  }
  function checkStat(stat, options) {
    return stat.isFile() && checkMode(stat, options);
  }
  function checkMode(stat, options) {
    var mod = stat.mode;
    var uid = stat.uid;
    var gid = stat.gid;
    var myUid = options.uid !== undefined ? options.uid : process.getuid && process.getuid();
    var myGid = options.gid !== undefined ? options.gid : process.getgid && process.getgid();
    var u = parseInt("100", 8);
    var g = parseInt("010", 8);
    var o = parseInt("001", 8);
    var ug = u | g;
    var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
    return ret;
  }
});

// node_modules/isexe/index.js
var require_isexe = __commonJS((exports, module) => {
  var fs = __require("fs");
  var core;
  if (process.platform === "win32" || global.TESTING_WINDOWS) {
    core = require_windows();
  } else {
    core = require_mode();
  }
  module.exports = isexe;
  isexe.sync = sync;
  function isexe(path, options, cb) {
    if (typeof options === "function") {
      cb = options;
      options = {};
    }
    if (!cb) {
      if (typeof Promise !== "function") {
        throw new TypeError("callback not provided");
      }
      return new Promise(function(resolve, reject) {
        isexe(path, options || {}, function(er, is) {
          if (er) {
            reject(er);
          } else {
            resolve(is);
          }
        });
      });
    }
    core(path, options || {}, function(er, is) {
      if (er) {
        if (er.code === "EACCES" || options && options.ignoreErrors) {
          er = null;
          is = false;
        }
      }
      cb(er, is);
    });
  }
  function sync(path, options) {
    try {
      return core.sync(path, options || {});
    } catch (er) {
      if (options && options.ignoreErrors || er.code === "EACCES") {
        return false;
      } else {
        throw er;
      }
    }
  }
});

// node_modules/which/which.js
var require_which = __commonJS((exports, module) => {
  var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
  var path = __require("path");
  var COLON = isWindows ? ";" : ":";
  var isexe = require_isexe();
  var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
  var getPathInfo = (cmd, opt) => {
    const colon = opt.colon || COLON;
    const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
      ...isWindows ? [process.cwd()] : [],
      ...(opt.path || process.env.PATH || "").split(colon)
    ];
    const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
    const pathExt = isWindows ? pathExtExe.split(colon) : [""];
    if (isWindows) {
      if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
        pathExt.unshift("");
    }
    return {
      pathEnv,
      pathExt,
      pathExtExe
    };
  };
  var which = (cmd, opt, cb) => {
    if (typeof opt === "function") {
      cb = opt;
      opt = {};
    }
    if (!opt)
      opt = {};
    const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
    const found = [];
    const step = (i) => new Promise((resolve, reject) => {
      if (i === pathEnv.length)
        return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
      const ppRaw = pathEnv[i];
      const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
      const pCmd = path.join(pathPart, cmd);
      const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
      resolve(subStep(p, i, 0));
    });
    const subStep = (p, i, ii) => new Promise((resolve, reject) => {
      if (ii === pathExt.length)
        return resolve(step(i + 1));
      const ext = pathExt[ii];
      isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
        if (!er && is) {
          if (opt.all)
            found.push(p + ext);
          else
            return resolve(p + ext);
        }
        return resolve(subStep(p, i, ii + 1));
      });
    });
    return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
  };
  var whichSync = (cmd, opt) => {
    opt = opt || {};
    const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
    const found = [];
    for (let i = 0;i < pathEnv.length; i++) {
      const ppRaw = pathEnv[i];
      const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
      const pCmd = path.join(pathPart, cmd);
      const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
      for (let j = 0;j < pathExt.length; j++) {
        const cur = p + pathExt[j];
        try {
          const is = isexe.sync(cur, { pathExt: pathExtExe });
          if (is) {
            if (opt.all)
              found.push(cur);
            else
              return cur;
          }
        } catch (ex) {}
      }
    }
    if (opt.all && found.length)
      return found;
    if (opt.nothrow)
      return null;
    throw getNotFoundError(cmd);
  };
  module.exports = which;
  which.sync = whichSync;
});

// node_modules/path-key/index.js
var require_path_key = __commonJS((exports, module) => {
  var pathKey = (options = {}) => {
    const environment = options.env || process.env;
    const platform = options.platform || process.platform;
    if (platform !== "win32") {
      return "PATH";
    }
    return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
  };
  module.exports = pathKey;
  module.exports.default = pathKey;
});

// node_modules/codeowners-utils/node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS((exports, module) => {
  var path = __require("path");
  var which = require_which();
  var getPathKey = require_path_key();
  function resolveCommandAttempt(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;
    if (shouldSwitchCwd) {
      try {
        process.chdir(parsed.options.cwd);
      } catch (err) {}
    }
    let resolved;
    try {
      resolved = which.sync(parsed.command, {
        path: env[getPathKey({ env })],
        pathExt: withoutPathExt ? path.delimiter : undefined
      });
    } catch (e) {} finally {
      if (shouldSwitchCwd) {
        process.chdir(cwd);
      }
    }
    if (resolved) {
      resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
    }
    return resolved;
  }
  function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
  }
  module.exports = resolveCommand;
});

// node_modules/codeowners-utils/node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS((exports, module) => {
  var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
  function escapeCommand(arg) {
    arg = arg.replace(metaCharsRegExp, "^$1");
    return arg;
  }
  function escapeArgument(arg, doubleEscapeMetaChars) {
    arg = `${arg}`;
    arg = arg.replace(/(\\*)"/g, "$1$1\\\"");
    arg = arg.replace(/(\\*)$/, "$1$1");
    arg = `"${arg}"`;
    arg = arg.replace(metaCharsRegExp, "^$1");
    if (doubleEscapeMetaChars) {
      arg = arg.replace(metaCharsRegExp, "^$1");
    }
    return arg;
  }
  exports.command = escapeCommand;
  exports.argument = escapeArgument;
});

// node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS((exports, module) => {
  module.exports = /^#!(.*)/;
});

// node_modules/shebang-command/index.js
var require_shebang_command = __commonJS((exports, module) => {
  var shebangRegex = require_shebang_regex();
  module.exports = (string = "") => {
    const match = string.match(shebangRegex);
    if (!match) {
      return null;
    }
    const [path, argument] = match[0].replace(/#! ?/, "").split(" ");
    const binary = path.split("/").pop();
    if (binary === "env") {
      return argument;
    }
    return argument ? `${binary} ${argument}` : binary;
  };
});

// node_modules/codeowners-utils/node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS((exports, module) => {
  var fs = __require("fs");
  var shebangCommand = require_shebang_command();
  function readShebang(command) {
    const size = 150;
    const buffer = Buffer.alloc(size);
    let fd;
    try {
      fd = fs.openSync(command, "r");
      fs.readSync(fd, buffer, 0, size, 0);
      fs.closeSync(fd);
    } catch (e) {}
    return shebangCommand(buffer.toString());
  }
  module.exports = readShebang;
});

// node_modules/codeowners-utils/node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS((exports, module) => {
  var path = __require("path");
  var resolveCommand = require_resolveCommand();
  var escape = require_escape();
  var readShebang = require_readShebang();
  var isWin = process.platform === "win32";
  var isExecutableRegExp = /\.(?:com|exe)$/i;
  var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
  function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);
    const shebang = parsed.file && readShebang(parsed.file);
    if (shebang) {
      parsed.args.unshift(parsed.file);
      parsed.command = shebang;
      return resolveCommand(parsed);
    }
    return parsed.file;
  }
  function parseNonShell(parsed) {
    if (!isWin) {
      return parsed;
    }
    const commandFile = detectShebang(parsed);
    const needsShell = !isExecutableRegExp.test(commandFile);
    if (parsed.options.forceShell || needsShell) {
      const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
      parsed.command = path.normalize(parsed.command);
      parsed.command = escape.command(parsed.command);
      parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
      const shellCommand = [parsed.command].concat(parsed.args).join(" ");
      parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
      parsed.command = process.env.comspec || "cmd.exe";
      parsed.options.windowsVerbatimArguments = true;
    }
    return parsed;
  }
  function parse(command, args, options) {
    if (args && !Array.isArray(args)) {
      options = args;
      args = null;
    }
    args = args ? args.slice(0) : [];
    options = Object.assign({}, options);
    const parsed = {
      command,
      args,
      options,
      file: undefined,
      original: {
        command,
        args
      }
    };
    return options.shell ? parsed : parseNonShell(parsed);
  }
  module.exports = parse;
});

// node_modules/codeowners-utils/node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS((exports, module) => {
  var isWin = process.platform === "win32";
  function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
      code: "ENOENT",
      errno: "ENOENT",
      syscall: `${syscall} ${original.command}`,
      path: original.command,
      spawnargs: original.args
    });
  }
  function hookChildProcess(cp, parsed) {
    if (!isWin) {
      return;
    }
    const originalEmit = cp.emit;
    cp.emit = function(name, arg1) {
      if (name === "exit") {
        const err = verifyENOENT(arg1, parsed, "spawn");
        if (err) {
          return originalEmit.call(cp, "error", err);
        }
      }
      return originalEmit.apply(cp, arguments);
    };
  }
  function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
      return notFoundError(parsed.original, "spawn");
    }
    return null;
  }
  function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
      return notFoundError(parsed.original, "spawnSync");
    }
    return null;
  }
  module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError
  };
});

// node_modules/codeowners-utils/node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS((exports, module) => {
  var cp = __require("child_process");
  var parse = require_parse();
  var enoent = require_enoent();
  function spawn(command, args, options) {
    const parsed = parse(command, args, options);
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
    enoent.hookChildProcess(spawned, parsed);
    return spawned;
  }
  function spawnSync(command, args, options) {
    const parsed = parse(command, args, options);
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
    return result;
  }
  module.exports = spawn;
  module.exports.spawn = spawn;
  module.exports.sync = spawnSync;
  module.exports._parse = parse;
  module.exports._enoent = enoent;
});

// node_modules/codeowners-utils/dist/codeowners-utils.js
var require_codeowners_utils = __commonJS((exports) => {
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var find_up_1 = __importDefault(require_find_up());
  var locate_path_1 = __importDefault(require_locate_path());
  var path_1 = __importDefault(__require("path"));
  var fs_1 = __importDefault(__require("fs"));
  var util_1 = __importDefault(__require("util"));
  var ignore_1 = __importDefault(require_ignore());
  var cross_spawn_1 = __importDefault(require_cross_spawn());
  var readFile = util_1.default.promisify(fs_1.default.readFile);
  function parse(str) {
    let entries = [];
    let lines = str.split(`
`);
    for (let line of lines) {
      let [content, comment] = line.split("#");
      let trimmed = content.trim();
      if (trimmed === "")
        continue;
      let [pattern, ...owners] = trimmed.split(/\s+/);
      entries.push({ pattern, owners });
    }
    return entries.reverse();
  }
  exports.parse = parse;
  exports.CODEOWNERS_PATHS = [
    ".github/CODEOWNERS",
    "docs/CODEOWNERS",
    "CODEOWNERS"
  ];
  async function findOwnersPath(cwd) {
    let git = await find_up_1.default(".git/", { cwd, type: "directory" });
    if (!git)
      return null;
    let root = path_1.default.dirname(git);
    let paths = exports.CODEOWNERS_PATHS.map((part) => path_1.default.join(root, part));
    let codeowners = await locate_path_1.default(paths, { cwd });
    return codeowners || null;
  }
  exports.findOwnersPath = findOwnersPath;
  async function loadOwners(cwd) {
    let file = await findOwnersPath(cwd);
    if (!file)
      return null;
    let contents = await readFile(file, "utf-8");
    let entries = parse(contents);
    return entries;
  }
  exports.loadOwners = loadOwners;
  function matchPattern(filename, pattern) {
    return ignore_1.default().add(pattern).ignores(filename);
  }
  exports.matchPattern = matchPattern;
  function matchFile(filename, entries) {
    for (let entry of entries) {
      if (matchPattern(filename, entry.pattern)) {
        return entry;
      }
    }
    return null;
  }
  exports.matchFile = matchFile;
  function filterUnmatchedFiles(files, entries) {
    return files.filter((file) => !matchFile(file, entries));
  }
  exports.filterUnmatchedFiles = filterUnmatchedFiles;
  function spawn(cmd, args, opts, onData) {
    return new Promise((resolve, reject) => {
      let proc = cross_spawn_1.default(cmd, args, opts);
      proc.stdout.on("data", onData);
      proc.on("error", reject);
      proc.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`"${cmd} ${args.join(" ")}" exited with non-zero exit code: ${code}`));
        } else {
          resolve();
        }
      });
    });
  }
  async function lsFiles(cwd, onFiles) {
    await spawn("git", ["ls-files", "--others", "--exclude-standard"], { cwd, stdio: ["ignore", "pipe", "inherit"] }, (data) => {
      let files = data.toString().trim().split(`
`);
      onFiles(files);
    });
  }
  async function findUnmatchedFilesFromEntries(entries, cwd) {
    let unmatched = [];
    await lsFiles(cwd, (files) => {
      unmatched = unmatched.concat(filterUnmatchedFiles(files, entries));
    });
    return unmatched;
  }
  exports.findUnmatchedFilesFromEntries = findUnmatchedFilesFromEntries;
  async function findUnmatchedFiles(cwd) {
    let entries = await loadOwners(cwd);
    if (!entries)
      return null;
    let unmatched = await findUnmatchedFilesFromEntries(entries, cwd);
    return unmatched;
  }
  exports.findUnmatchedFiles = findUnmatchedFiles;
});

// src/utils/convert-to-team-slug.ts
var convertToTeamSlug = (codeOwner) => codeOwner.substring(codeOwner.indexOf("/") + 1);

// src/utils/paginate-members-in-org.ts
var paginateMembersInOrg = async (team, page = 1) => {
  const response = await octokit.teams.listMembersInOrg({
    org: context.repo.owner,
    team_slug: convertToTeamSlug(team),
    per_page: 100,
    page
  });
  if (!response?.data?.length) {
    return [];
  }
  if (response.data.length < 100) {
    return response.data;
  }
  return [...response.data, ...await paginateMembersInOrg(team, page + 1)];
};

// src/utils/get-core-member-logins.ts
var import_codeowners_utils = __toESM(require_codeowners_utils(), 1);
var import_lodash = __toESM(require_lodash(), 1);
var import_bluebird = __toESM(require_bluebird(), 1);
var getCoreMemberLogins = async (params) => {
  const { pull_number, teams, codeowners_overrides } = params;
  const codeOwners = teams ?? getCodeOwnersFromEntries(await getRequiredCodeOwnersEntries(pull_number, codeowners_overrides));
  const teamsAndLogins = await getCoreTeamsAndLogins(codeOwners);
  return import_lodash.uniq(teamsAndLogins.map(({ login }) => login));
};
var getRequiredCodeOwnersEntries = async (pull_number, codeowners_overrides) => {
  let codeOwners = await import_codeowners_utils.loadOwners(process.cwd()) ?? [];
  if (codeowners_overrides) {
    const unmatchedOverrides = [];
    codeowners_overrides.split(",").forEach((overrideString) => {
      const [pattern, ...owners] = overrideString.split(/\s+/);
      if (!pattern) {
        setFailed('Invalid code_owners_override format. Please provide a comma-separated list of lines in GitHub CODEOWNERS format. For example, "/foo @owner1 @owner2,/bar @owner3".');
        throw new Error;
      }
      const patternMatched = codeOwners.some((originalEntry, index) => {
        if (originalEntry.pattern === pattern) {
          codeOwners[index] = { pattern, owners };
          return true;
        }
        return false;
      });
      if (!patternMatched) {
        unmatchedOverrides.push({ pattern, owners });
      }
    });
    codeOwners = unmatchedOverrides.toReversed().concat(codeOwners);
  }
  const changedFilePaths = await getChangedFilepaths(pull_number);
  return changedFilePaths.map((filePath) => import_codeowners_utils.matchFile(filePath, codeOwners)).filter(Boolean);
};
var getCoreTeamsAndLogins = async (codeOwners) => {
  if (!codeOwners?.length) {
    setFailed('No code owners found. Please provide a "teams" input or set up a CODEOWNERS file in your repo.');
    throw new Error;
  }
  const teamsAndLogins = await import_bluebird.map(codeOwners, async (team) => paginateMembersInOrg(team).then((members) => members.map(({ login }) => ({ team, login }))));
  return import_lodash.union(...teamsAndLogins);
};
var getCodeOwnersFromEntries = (codeOwnersEntries) => {
  return import_lodash.uniq(codeOwnersEntries.map((entry) => entry.owners).flat().filter(Boolean).map((codeOwner) => convertToTeamSlug(codeOwner)));
};

export { paginateMembersInOrg, getCoreMemberLogins, getRequiredCodeOwnersEntries };

//# debugId=4EBB88F55C26119464756E2164756E21
