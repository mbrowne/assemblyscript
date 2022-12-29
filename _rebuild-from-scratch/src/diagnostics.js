"use strict";
/**
 * @fileoverview Shared diagnostic handling.
 * @license Apache-2.0
 */
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
exports.__esModule = true;
exports.DiagnosticEmitter = exports.formatDiagnosticMessage = exports.DiagnosticMessage = exports.diagnosticCategoryToColor = exports.diagnosticCategoryToString = exports.Range = exports.diagnosticCodeToString = exports.DiagnosticCode = void 0;
var diagnosticMessages_generated_1 = require("./diagnosticMessages.generated");
var util_1 = require("./util");
var diagnosticMessages_generated_2 = require("./diagnosticMessages.generated");
__createBinding(exports, diagnosticMessages_generated_2, "DiagnosticCode");
__createBinding(exports, diagnosticMessages_generated_2, "diagnosticCodeToString");
var Range = /** @class */ (function () {
    function Range(start, end) {
        this.start = start;
        this.end = end;
        this.debugInfoRef = 0;
    }
    Range.join = function (a, b) {
        if (a.source != b.source)
            throw new Error("source mismatch");
        var range = new Range(a.start < b.start ? a.start : b.start, a.end > b.end ? a.end : b.end);
        range.source = a.source;
        return range;
    };
    Range.prototype.equals = function (other) {
        return (this.source == other.source &&
            this.start == other.start &&
            this.end == other.end);
    };
    Object.defineProperty(Range.prototype, "atStart", {
        get: function () {
            var range = new Range(this.start, this.start);
            range.source = this.source;
            return range;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Range.prototype, "atEnd", {
        get: function () {
            var range = new Range(this.end, this.end);
            range.source = this.source;
            return range;
        },
        enumerable: false,
        configurable: true
    });
    Range.prototype.toString = function () {
        return this.source.text.substring(this.start, this.end);
    };
    return Range;
}());
exports.Range = Range;
/** Returns the string representation of the specified diagnostic category. */
function diagnosticCategoryToString(category) {
    switch (category) {
        case 0 /* DiagnosticCategory.Pedantic */: return "PEDANTIC";
        case 1 /* DiagnosticCategory.Info */: return "INFO";
        case 2 /* DiagnosticCategory.Warning */: return "WARNING";
        case 3 /* DiagnosticCategory.Error */: return "ERROR";
        default: {
            assert(false);
            return "";
        }
    }
}
exports.diagnosticCategoryToString = diagnosticCategoryToString;
/** Returns the ANSI escape sequence for the specified category. */
function diagnosticCategoryToColor(category) {
    switch (category) {
        case 0 /* DiagnosticCategory.Pedantic */: return util_1.COLOR_MAGENTA;
        case 1 /* DiagnosticCategory.Info */: return util_1.COLOR_CYAN;
        case 2 /* DiagnosticCategory.Warning */: return util_1.COLOR_YELLOW;
        case 3 /* DiagnosticCategory.Error */: return util_1.COLOR_RED;
        default: {
            assert(false);
            return "";
        }
    }
}
exports.diagnosticCategoryToColor = diagnosticCategoryToColor;
/** Represents a diagnostic message. */
var DiagnosticMessage = /** @class */ (function () {
    /** Constructs a new diagnostic message. */
    function DiagnosticMessage(code, category, message) {
        /** Respective source range, if any. */
        this.range = null;
        /** Related range, if any. */
        this.relatedRange = null; // TODO: Make this a related message for chains?
        this.code = code;
        this.category = category;
        this.message = message;
    }
    /** Creates a new diagnostic message of the specified category. */
    DiagnosticMessage.create = function (code, category, arg0, arg1, arg2) {
        if (arg0 === void 0) { arg0 = null; }
        if (arg1 === void 0) { arg1 = null; }
        if (arg2 === void 0) { arg2 = null; }
        var message = (0, diagnosticMessages_generated_1.diagnosticCodeToString)(code);
        if (arg0 != null)
            message = message.replace("{0}", arg0);
        if (arg1 != null)
            message = message.replace("{1}", arg1);
        if (arg2 != null)
            message = message.replace("{2}", arg2);
        return new DiagnosticMessage(code, category, message);
    };
    /** Tests if this message equals the specified. */
    DiagnosticMessage.prototype.equals = function (other) {
        if (this.code != other.code)
            return false;
        var thisRange = this.range;
        var otherRange = other.range;
        if (thisRange) {
            if (!otherRange || !thisRange.equals(otherRange))
                return false;
        }
        else if (otherRange) {
            return false;
        }
        var thisRelatedRange = this.relatedRange;
        var otherRelatedRange = other.relatedRange;
        if (thisRelatedRange) {
            if (!otherRelatedRange || !thisRelatedRange.equals(otherRelatedRange))
                return false;
        }
        else if (otherRelatedRange) {
            return false;
        }
        return this.message == other.message;
    };
    /** Adds a source range to this message. */
    DiagnosticMessage.prototype.withRange = function (range) {
        this.range = range;
        return this;
    };
    /** Adds a related source range to this message. */
    DiagnosticMessage.prototype.withRelatedRange = function (range) {
        this.relatedRange = range;
        return this;
    };
    /** Converts this message to a string. */
    DiagnosticMessage.prototype.toString = function () {
        var category = diagnosticCategoryToString(this.category);
        var range = this.range;
        var code = this.code;
        var message = this.message;
        if (range) {
            var source = range.source;
            var path = source.normalizedPath;
            var line = source.lineAt(range.start);
            var column = source.columnAt();
            var len = range.end - range.start;
            return "".concat(category, " ").concat(code, ": \"").concat(message, "\" in ").concat(path, "(").concat(line, ",").concat(column, "+").concat(len, ")");
        }
        return "".concat(category, " ").concat(code, ": ").concat(message);
    };
    return DiagnosticMessage;
}());
exports.DiagnosticMessage = DiagnosticMessage;
/** Formats a diagnostic message, optionally with terminal colors and source context. */
function formatDiagnosticMessage(message, useColors, showContext) {
    if (useColors === void 0) { useColors = false; }
    if (showContext === void 0) { showContext = false; }
    var wasColorsEnabled = (0, util_1.setColorsEnabled)(useColors);
    // general information
    var sb = [];
    if ((0, util_1.isColorsEnabled)())
        sb.push(diagnosticCategoryToColor(message.category));
    sb.push(diagnosticCategoryToString(message.category));
    if ((0, util_1.isColorsEnabled)())
        sb.push(util_1.COLOR_RESET);
    sb.push(message.code < 1000 ? " AS" : " TS");
    sb.push(message.code.toString());
    sb.push(": ");
    sb.push(message.message);
    // include range information if available
    var range = message.range;
    if (range) {
        var source = range.source;
        var relatedRange = message.relatedRange;
        var minLine = 0;
        if (relatedRange) {
            // Justify context indentation when multiple ranges are present
            minLine = max(source.lineAt(range.start), relatedRange.source.lineAt(relatedRange.start));
        }
        // include context information if requested
        if (showContext) {
            sb.push("\n");
            sb.push(formatDiagnosticContext(range, minLine));
        }
        else {
            sb.push("\n in ");
            sb.push(source.normalizedPath);
        }
        sb.push("(");
        sb.push(source.lineAt(range.start).toString());
        sb.push(",");
        sb.push(source.columnAt().toString());
        sb.push(")");
        if (relatedRange) {
            var relatedSource = relatedRange.source;
            if (showContext) {
                sb.push("\n");
                sb.push(formatDiagnosticContext(relatedRange, minLine));
            }
            else {
                sb.push("\n in ");
                sb.push(relatedSource.normalizedPath);
            }
            sb.push("(");
            sb.push(relatedSource.lineAt(relatedRange.start).toString());
            sb.push(",");
            sb.push(relatedSource.columnAt().toString());
            sb.push(")");
        }
    }
    (0, util_1.setColorsEnabled)(wasColorsEnabled);
    return sb.join("");
}
exports.formatDiagnosticMessage = formatDiagnosticMessage;
/** Formats the diagnostic context for the specified range, optionally with terminal colors. */
function formatDiagnosticContext(range, minLine) {
    if (minLine === void 0) { minLine = 0; }
    var source = range.source;
    var text = source.text;
    var len = text.length;
    var start = range.start;
    var end = start;
    var lineNumber = source.lineAt(start).toString();
    var lineNumberLength = minLine
        ? max(minLine.toString().length, lineNumber.length)
        : lineNumber.length;
    var lineSpace = " ".repeat(lineNumberLength);
    // Find preceeding line break
    while (start > 0 && !(0, util_1.isLineBreak)(text.charCodeAt(start - 1)))
        start--;
    // Skip leading whitespace (assume no supplementary whitespaces)
    while (start < len && (0, util_1.isWhiteSpace)(text.charCodeAt(start)))
        start++;
    // Find next line break
    while (end < len && !(0, util_1.isLineBreak)(text.charCodeAt(end)))
        end++;
    var sb = [
        lineSpace,
        "  :\n ",
        " ".repeat(lineNumberLength - lineNumber.length),
        lineNumber,
        " │ ",
        text.substring(start, end).replaceAll("\t", "  "),
        "\n ",
        lineSpace,
        " │ "
    ];
    while (start < range.start) {
        if (text.charCodeAt(start) == 9 /* CharCode.Tab */) {
            sb.push("  ");
            start += 2;
        }
        else {
            sb.push(" ");
            start++;
        }
    }
    if ((0, util_1.isColorsEnabled)())
        sb.push(util_1.COLOR_RED);
    if (range.start == range.end) {
        sb.push("^");
    }
    else {
        while (start++ < range.end) {
            var cc = text.charCodeAt(start);
            if (cc == 9 /* CharCode.Tab */) {
                sb.push("~~");
            }
            else if ((0, util_1.isLineBreak)(cc)) {
                sb.push(start == range.start + 1 ? "^" : "~");
                break;
            }
            else {
                sb.push("~");
            }
        }
    }
    if ((0, util_1.isColorsEnabled)())
        sb.push(util_1.COLOR_RESET);
    sb.push("\n ");
    sb.push(lineSpace);
    sb.push(" └─ in ");
    sb.push(source.normalizedPath);
    return sb.join("");
}
/** Base class of all diagnostic emitters. */
var DiagnosticEmitter = /** @class */ (function () {
    /** Initializes this diagnostic emitter. */
    function DiagnosticEmitter(diagnostics) {
        if (diagnostics === void 0) { diagnostics = null; }
        /** Diagnostic messages already seen, by range. */
        this.seen = new Map();
        if (!diagnostics)
            diagnostics = [];
        this.diagnostics = diagnostics;
    }
    /** Emits a diagnostic message of the specified category. */
    DiagnosticEmitter.prototype.emitDiagnostic = function (code, category, range, relatedRange, arg0, arg1, arg2) {
        if (arg0 === void 0) { arg0 = null; }
        if (arg1 === void 0) { arg1 = null; }
        if (arg2 === void 0) { arg2 = null; }
        var message = DiagnosticMessage.create(code, category, arg0, arg1, arg2);
        if (range)
            message = message.withRange(range);
        if (relatedRange)
            message.relatedRange = relatedRange;
        // It is possible that the same diagnostic is emitted twice, for example
        // when compiling generics with different types or when recompiling a loop
        // because our initial assumptions didn't hold. It is even possible to get
        // multiple instances of the same range during parsing. Deduplicate these.
        if (range) {
            var seen = this.seen;
            if (seen.has(range.source)) {
                var seenInSource = assert(seen.get(range.source));
                if (seenInSource.has(range.start)) {
                    var seenMessagesAtPos = assert(seenInSource.get(range.start));
                    for (var i = 0, k = seenMessagesAtPos.length; i < k; ++i) {
                        if (seenMessagesAtPos[i].equals(message))
                            return;
                    }
                    seenMessagesAtPos.push(message);
                }
                else {
                    seenInSource.set(range.start, [message]);
                }
            }
            else {
                var seenInSource = new Map();
                seenInSource.set(range.start, [message]);
                seen.set(range.source, seenInSource);
            }
        }
        this.diagnostics.push(message);
        // console.log(formatDiagnosticMessage(message, true, true) + "\n"); // temporary
        // console.log(<string>new Error("stack").stack);
    };
    /** Emits an overly pedantic diagnostic message. */
    DiagnosticEmitter.prototype.pedantic = function (code, range, arg0, arg1, arg2) {
        if (arg0 === void 0) { arg0 = null; }
        if (arg1 === void 0) { arg1 = null; }
        if (arg2 === void 0) { arg2 = null; }
        this.emitDiagnostic(code, 0 /* DiagnosticCategory.Pedantic */, range, null, arg0, arg1, arg2);
    };
    /** Emits an overly pedantic diagnostic message with a related range. */
    DiagnosticEmitter.prototype.pedanticRelated = function (code, range, relatedRange, arg0, arg1, arg2) {
        if (arg0 === void 0) { arg0 = null; }
        if (arg1 === void 0) { arg1 = null; }
        if (arg2 === void 0) { arg2 = null; }
        this.emitDiagnostic(code, 0 /* DiagnosticCategory.Pedantic */, range, relatedRange, arg0, arg1, arg2);
    };
    /** Emits an informatory diagnostic message. */
    DiagnosticEmitter.prototype.info = function (code, range, arg0, arg1, arg2) {
        if (arg0 === void 0) { arg0 = null; }
        if (arg1 === void 0) { arg1 = null; }
        if (arg2 === void 0) { arg2 = null; }
        this.emitDiagnostic(code, 1 /* DiagnosticCategory.Info */, range, null, arg0, arg1, arg2);
    };
    /** Emits an informatory diagnostic message with a related range. */
    DiagnosticEmitter.prototype.infoRelated = function (code, range, relatedRange, arg0, arg1, arg2) {
        if (arg0 === void 0) { arg0 = null; }
        if (arg1 === void 0) { arg1 = null; }
        if (arg2 === void 0) { arg2 = null; }
        this.emitDiagnostic(code, 1 /* DiagnosticCategory.Info */, range, relatedRange, arg0, arg1, arg2);
    };
    /** Emits a warning diagnostic message. */
    DiagnosticEmitter.prototype.warning = function (code, range, arg0, arg1, arg2) {
        if (arg0 === void 0) { arg0 = null; }
        if (arg1 === void 0) { arg1 = null; }
        if (arg2 === void 0) { arg2 = null; }
        this.emitDiagnostic(code, 2 /* DiagnosticCategory.Warning */, range, null, arg0, arg1, arg2);
    };
    /** Emits a warning diagnostic message with a related range. */
    DiagnosticEmitter.prototype.warningRelated = function (code, range, relatedRange, arg0, arg1, arg2) {
        if (arg0 === void 0) { arg0 = null; }
        if (arg1 === void 0) { arg1 = null; }
        if (arg2 === void 0) { arg2 = null; }
        this.emitDiagnostic(code, 2 /* DiagnosticCategory.Warning */, range, relatedRange, arg0, arg1, arg2);
    };
    /** Emits an error diagnostic message. */
    DiagnosticEmitter.prototype.error = function (code, range, arg0, arg1, arg2) {
        if (arg0 === void 0) { arg0 = null; }
        if (arg1 === void 0) { arg1 = null; }
        if (arg2 === void 0) { arg2 = null; }
        this.emitDiagnostic(code, 3 /* DiagnosticCategory.Error */, range, null, arg0, arg1, arg2);
    };
    /** Emits an error diagnostic message with a related range. */
    DiagnosticEmitter.prototype.errorRelated = function (code, range, relatedRange, arg0, arg1, arg2) {
        if (arg0 === void 0) { arg0 = null; }
        if (arg1 === void 0) { arg1 = null; }
        if (arg2 === void 0) { arg2 = null; }
        this.emitDiagnostic(code, 3 /* DiagnosticCategory.Error */, range, relatedRange, arg0, arg1, arg2);
    };
    return DiagnosticEmitter;
}());
exports.DiagnosticEmitter = DiagnosticEmitter;
