"use strict";
/**
 * @fileoverview Various file path utility.
 * @license Apache-2.0
 */
exports.__esModule = true;
exports.dirname = exports.resolvePath = exports.normalizePath = void 0;
var common_1 = require("../common");
var separator = 47 /* CharCode.Slash */;
/**
 * Normalizes the specified path, removing interior placeholders.
 * Expects a posix-compatible relative path (not Windows compatible).
 */
function normalizePath(path) {
    var pos = 0;
    var len = path.length;
    // trim leading './'
    while (pos + 1 < len &&
        path.charCodeAt(pos) == 46 /* CharCode.Dot */ &&
        path.charCodeAt(pos + 1) == separator) {
        pos += 2;
    }
    if (pos > 0 || len < path.length) {
        path = path.substring(pos, len);
        len -= pos;
        pos = 0;
    }
    var atEnd;
    while (pos + 1 < len) {
        atEnd = false;
        // we are only interested in '/.' sequences ...
        if (path.charCodeAt(pos) == separator &&
            path.charCodeAt(pos + 1) == 46 /* CharCode.Dot */) {
            // '/.' ( '/' | $ )
            atEnd = pos + 2 == len;
            if (atEnd ||
                pos + 2 < len &&
                    path.charCodeAt(pos + 2) == separator) {
                path = atEnd
                    ? path.substring(0, pos)
                    : path.substring(0, pos) + path.substring(pos + 2);
                len -= 2;
                continue;
            }
            // '/.' ( './' | '.' $ )
            atEnd = pos + 3 == len;
            if (atEnd && path.charCodeAt(pos + 2) == 46 /* CharCode.Dot */ ||
                pos + 3 < len &&
                    path.charCodeAt(pos + 2) == 46 /* CharCode.Dot */ &&
                    path.charCodeAt(pos + 3) == separator) {
                // find preceeding '/'
                var ipos = pos;
                while (--ipos >= 0) {
                    if (path.charCodeAt(ipos) == separator) {
                        if (pos - ipos != 3 ||
                            path.charCodeAt(ipos + 1) != 46 /* CharCode.Dot */ ||
                            path.charCodeAt(ipos + 2) != 46 /* CharCode.Dot */) { // exclude '..' itself
                            path = atEnd
                                ? path.substring(0, ipos)
                                : path.substring(0, ipos) + path.substring(pos + 3);
                            len -= pos + 3 - ipos;
                            pos = ipos - 1; // incremented again at end of loop
                        }
                        break;
                    }
                }
                // if there's no preceeding '/', trim start if non-empty
                if (ipos < 0 && pos > 0) {
                    if (pos != 2 ||
                        path.charCodeAt(0) != 46 /* CharCode.Dot */ ||
                        path.charCodeAt(1) != 46 /* CharCode.Dot */) { // exclude '..' itself
                        path = path.substring(pos + 4);
                        len = path.length;
                        continue;
                    }
                }
            }
        }
        pos++;
    }
    return len > 0 ? path : ".";
}
exports.normalizePath = normalizePath;
/** Resolves the specified path relative to the specified origin. */
function resolvePath(normalizedPath, origin) {
    if (normalizedPath.startsWith("std/")) {
        return normalizedPath;
    }
    return normalizePath(dirname(origin) + common_1.PATH_DELIMITER + normalizedPath);
}
exports.resolvePath = resolvePath;
/** Obtains the directory portion of a normalized path. */
function dirname(normalizedPath) {
    var pos = normalizedPath.length;
    if (pos <= 1) {
        if (pos == 0)
            return ".";
        if (normalizedPath.charCodeAt(0) == separator) {
            return normalizedPath;
        }
    }
    while (--pos > 0) {
        if (normalizedPath.charCodeAt(pos) == separator) {
            return normalizedPath.substring(0, pos);
        }
    }
    return ".";
}
exports.dirname = dirname;
