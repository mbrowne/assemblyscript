"use strict";
/**
 * @fileoverview A TypeScript tokenizer modified for AssemblyScript.
 *
 * The `Tokenizer` scans over a source file and returns one syntactic token
 * at a time that the parser will combine to an abstract syntax tree.
 *
 * It skips over trivia like comments and whitespace and provides a general
 * mark/reset mechanism for the parser to utilize on ambiguous tokens, with
 * one token of lookahead otherwise.
 *
 * @license Apache-2.0
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.State = exports.Tokenizer = exports.operatorTokenToString = exports.isIllegalVariableIdentifier = exports.tokenIsAlsoIdentifier = exports.tokenFromKeyword = void 0;
var diagnostics_1 = require("./diagnostics");
var util_1 = require("./util");
function tokenFromKeyword(text) {
    var len = text.length;
    assert(len);
    switch (text.charCodeAt(0)) {
        case 97 /* CharCode.a */: {
            if (len == 5) {
                if (text == "async")
                    return 2 /* Token.Async */;
                if (text == "await")
                    return 3 /* Token.Await */;
                break;
            }
            if (text == "as")
                return 1 /* Token.As */;
            if (text == "abstract")
                return 0 /* Token.Abstract */;
            break;
        }
        case 98 /* CharCode.b */: {
            if (text == "break")
                return 4 /* Token.Break */;
            break;
        }
        case 99 /* CharCode.c */: {
            if (len == 5) {
                if (text == "const")
                    return 8 /* Token.Const */;
                if (text == "class")
                    return 7 /* Token.Class */;
                if (text == "catch")
                    return 6 /* Token.Catch */;
                break;
            }
            if (text == "case")
                return 5 /* Token.Case */;
            if (text == "continue")
                return 9 /* Token.Continue */;
            if (text == "constructor")
                return 10 /* Token.Constructor */;
            break;
        }
        case 100 /* CharCode.d */: {
            if (len == 7) {
                if (text == "default")
                    return 13 /* Token.Default */;
                if (text == "declare")
                    return 12 /* Token.Declare */;
                break;
            }
            if (text == "do")
                return 15 /* Token.Do */;
            if (text == "delete")
                return 14 /* Token.Delete */;
            if (text == "debugger")
                return 11 /* Token.Debugger */;
            break;
        }
        case 101 /* CharCode.e */: {
            if (len == 4) {
                if (text == "else")
                    return 16 /* Token.Else */;
                if (text == "enum")
                    return 17 /* Token.Enum */;
                break;
            }
            if (text == "export")
                return 18 /* Token.Export */;
            if (text == "extends")
                return 19 /* Token.Extends */;
            break;
        }
        case 102 /* CharCode.f */: {
            if (len <= 5) {
                if (text == "false")
                    return 20 /* Token.False */;
                if (text == "for")
                    return 22 /* Token.For */;
                if (text == "from")
                    return 23 /* Token.From */;
                break;
            }
            if (text == "function")
                return 24 /* Token.Function */;
            if (text == "finally")
                return 21 /* Token.Finally */;
            break;
        }
        case 103 /* CharCode.g */: {
            if (text == "get")
                return 25 /* Token.Get */;
            break;
        }
        case 105 /* CharCode.i */: {
            if (len == 2) {
                if (text == "if")
                    return 26 /* Token.If */;
                if (text == "in")
                    return 29 /* Token.In */;
                if (text == "is")
                    return 32 /* Token.Is */;
                break;
            }
            switch (text.charCodeAt(3)) {
                case 108 /* CharCode.l */: {
                    if (text == "implements")
                        return 27 /* Token.Implements */;
                    break;
                }
                case 111 /* CharCode.o */: {
                    if (text == "import")
                        return 28 /* Token.Import */;
                    break;
                }
                case 116 /* CharCode.t */: {
                    if (text == "instanceof")
                        return 30 /* Token.InstanceOf */;
                    break;
                }
                case 101 /* CharCode.e */: {
                    if (text == "interface")
                        return 31 /* Token.Interface */;
                    break;
                }
            }
            break;
        }
        case 107 /* CharCode.k */: {
            if (text == "keyof")
                return 33 /* Token.KeyOf */;
            break;
        }
        case 108 /* CharCode.l */: {
            if (text == "let")
                return 34 /* Token.Let */;
            break;
        }
        case 109 /* CharCode.m */: {
            if (text == "module")
                return 35 /* Token.Module */;
            break;
        }
        case 110 /* CharCode.n */: {
            if (text == "new")
                return 37 /* Token.New */;
            if (text == "null")
                return 38 /* Token.Null */;
            if (text == "namespace")
                return 36 /* Token.Namespace */;
            break;
        }
        case 111 /* CharCode.o */: {
            if (text == "of")
                return 39 /* Token.Of */;
            if (text == "override")
                return 40 /* Token.Override */;
            break;
        }
        case 112 /* CharCode.p */: {
            if (len == 7) {
                if (text == "private")
                    return 42 /* Token.Private */;
                if (text == "package")
                    return 41 /* Token.Package */;
                break;
            }
            if (text == "public")
                return 44 /* Token.Public */;
            if (text == "protected")
                return 43 /* Token.Protected */;
            break;
        }
        case 114 /* CharCode.r */: {
            if (text == "return")
                return 46 /* Token.Return */;
            if (text == "readonly")
                return 45 /* Token.Readonly */;
            break;
        }
        case 115 /* CharCode.s */: {
            if (len == 6) {
                if (text == "switch")
                    return 50 /* Token.Switch */;
                if (text == "static")
                    return 48 /* Token.Static */;
                break;
            }
            if (text == "set")
                return 47 /* Token.Set */;
            if (text == "super")
                return 49 /* Token.Super */;
            break;
        }
        case 116 /* CharCode.t */: {
            if (len == 4) {
                if (text == "true")
                    return 53 /* Token.True */;
                if (text == "this")
                    return 51 /* Token.This */;
                if (text == "type")
                    return 55 /* Token.Type */;
                break;
            }
            if (text == "try")
                return 54 /* Token.Try */;
            if (text == "throw")
                return 52 /* Token.Throw */;
            if (text == "typeof")
                return 56 /* Token.TypeOf */;
            break;
        }
        case 118 /* CharCode.v */: {
            if (text == "var")
                return 57 /* Token.Var */;
            if (text == "void")
                return 58 /* Token.Void */;
            break;
        }
        case 119 /* CharCode.w */: {
            if (text == "while")
                return 59 /* Token.While */;
            if (text == "with")
                return 60 /* Token.With */;
            break;
        }
        case 121 /* CharCode.y */: {
            if (text == "yield")
                return 61 /* Token.Yield */;
            break;
        }
    }
    return 120 /* Token.Invalid */;
}
exports.tokenFromKeyword = tokenFromKeyword;
function tokenIsAlsoIdentifier(token) {
    switch (token) {
        case 0 /* Token.Abstract */:
        case 1 /* Token.As */:
        case 10 /* Token.Constructor */:
        case 12 /* Token.Declare */:
        case 14 /* Token.Delete */:
        case 23 /* Token.From */:
        case 22 /* Token.For */:
        case 25 /* Token.Get */:
        case 30 /* Token.InstanceOf */:
        case 32 /* Token.Is */:
        case 33 /* Token.KeyOf */:
        case 35 /* Token.Module */:
        case 36 /* Token.Namespace */:
        case 38 /* Token.Null */:
        case 45 /* Token.Readonly */:
        case 47 /* Token.Set */:
        case 55 /* Token.Type */:
        case 58 /* Token.Void */: return true;
        default: return false;
    }
}
exports.tokenIsAlsoIdentifier = tokenIsAlsoIdentifier;
function isIllegalVariableIdentifier(name) {
    assert(name.length);
    switch (name.charCodeAt(0)) {
        case 100 /* CharCode.d */: return name == "delete";
        case 102 /* CharCode.f */: return name == "for";
        case 105 /* CharCode.i */: return name == "instanceof";
        case 110 /* CharCode.n */: return name == "null";
        case 118 /* CharCode.v */: return name == "void";
    }
    return false;
}
exports.isIllegalVariableIdentifier = isIllegalVariableIdentifier;
function operatorTokenToString(token) {
    switch (token) {
        case 14 /* Token.Delete */: return "delete";
        case 29 /* Token.In */: return "in";
        case 30 /* Token.InstanceOf */: return "instanceof";
        case 37 /* Token.New */: return "new";
        case 56 /* Token.TypeOf */: return "typeof";
        case 58 /* Token.Void */: return "void";
        case 61 /* Token.Yield */: return "yield";
        case 69 /* Token.Dot_Dot_Dot */: return "...";
        case 71 /* Token.Comma */: return ",";
        case 72 /* Token.LessThan */: return "<";
        case 73 /* Token.GreaterThan */: return ">";
        case 74 /* Token.LessThan_Equals */: return "<=";
        case 75 /* Token.GreaterThan_Equals */: return ">=";
        case 76 /* Token.Equals_Equals */: return "==";
        case 77 /* Token.Exclamation_Equals */: return "!=";
        case 78 /* Token.Equals_Equals_Equals */: return "===";
        case 79 /* Token.Exclamation_Equals_Equals */: return "!==";
        case 81 /* Token.Plus */: return "+";
        case 82 /* Token.Minus */: return "-";
        case 83 /* Token.Asterisk_Asterisk */: return "**";
        case 84 /* Token.Asterisk */: return "*";
        case 85 /* Token.Slash */: return "/";
        case 86 /* Token.Percent */: return "%";
        case 87 /* Token.Plus_Plus */: return "++";
        case 88 /* Token.Minus_Minus */: return "--";
        case 89 /* Token.LessThan_LessThan */: return "<<";
        case 90 /* Token.GreaterThan_GreaterThan */: return ">>";
        case 91 /* Token.GreaterThan_GreaterThan_GreaterThan */: return ">>>";
        case 92 /* Token.Ampersand */: return "&";
        case 93 /* Token.Bar */: return "|";
        case 94 /* Token.Caret */: return "^";
        case 95 /* Token.Exclamation */: return "!";
        case 96 /* Token.Tilde */: return "~";
        case 97 /* Token.Ampersand_Ampersand */: return "&&";
        case 98 /* Token.Bar_Bar */: return "||";
        case 101 /* Token.Equals */: return "=";
        case 102 /* Token.Plus_Equals */: return "+=";
        case 103 /* Token.Minus_Equals */: return "-=";
        case 104 /* Token.Asterisk_Equals */: return "*=";
        case 105 /* Token.Asterisk_Asterisk_Equals */: return "**=";
        case 106 /* Token.Slash_Equals */: return "/=";
        case 107 /* Token.Percent_Equals */: return "%=";
        case 108 /* Token.LessThan_LessThan_Equals */: return "<<=";
        case 109 /* Token.GreaterThan_GreaterThan_Equals */: return ">>=";
        case 110 /* Token.GreaterThan_GreaterThan_GreaterThan_Equals */: return ">>>=";
        case 111 /* Token.Ampersand_Equals */: return "&=";
        case 112 /* Token.Bar_Equals */: return "|=";
        case 113 /* Token.Caret_Equals */: return "^=";
        default: {
            assert(false);
            return "";
        }
    }
}
exports.operatorTokenToString = operatorTokenToString;
/** Tokenizes a source to individual {@link Token}s. */
var Tokenizer = /** @class */ (function (_super) {
    __extends(Tokenizer, _super);
    /** Constructs a new tokenizer. */
    function Tokenizer(source, diagnostics) {
        if (diagnostics === void 0) { diagnostics = null; }
        var _this = _super.call(this, diagnostics) || this;
        _this.end = 0;
        _this.pos = 0;
        _this.token = -1;
        _this.tokenPos = 0;
        _this.nextToken = -1;
        _this.nextTokenPos = 0;
        _this.nextTokenOnNewLine = false;
        _this.onComment = null;
        _this.readingTemplateString = false;
        _this.readStringStart = 0;
        _this.readStringEnd = 0;
        if (!diagnostics)
            diagnostics = [];
        _this.diagnostics = diagnostics;
        _this.source = source;
        var text = source.text;
        var end = text.length;
        var pos = 0;
        // skip bom
        if (pos < end &&
            text.charCodeAt(pos) == 65279 /* CharCode.ByteOrderMark */) {
            ++pos;
        }
        // skip shebang
        if (pos + 1 < end &&
            text.charCodeAt(pos) == 35 /* CharCode.Hash */ &&
            text.charCodeAt(pos + 1) == 33 /* CharCode.Exclamation */) {
            pos += 2;
            while (pos < end &&
                text.charCodeAt(pos) != 10 /* CharCode.LineFeed */) {
                ++pos;
            }
            // 'next' now starts at lf or eof
        }
        _this.pos = pos;
        _this.end = end;
        return _this;
    }
    Tokenizer.prototype.next = function (identifierHandling) {
        if (identifierHandling === void 0) { identifierHandling = 0 /* IdentifierHandling.Default */; }
        this.nextToken = -1;
        var token;
        do
            token = this.unsafeNext(identifierHandling);
        while (token == 120 /* Token.Invalid */);
        this.token = token;
        return token;
    };
    Tokenizer.prototype.unsafeNext = function (identifierHandling, maxTokenLength) {
        if (identifierHandling === void 0) { identifierHandling = 0 /* IdentifierHandling.Default */; }
        if (maxTokenLength === void 0) { maxTokenLength = i32.MAX_VALUE; }
        var text = this.source.text;
        var end = this.end;
        var pos = this.pos;
        while (pos < end) {
            this.tokenPos = pos;
            var c = text.charCodeAt(pos);
            switch (c) {
                case 13 /* CharCode.CarriageReturn */: {
                    if (!(++pos < end &&
                        text.charCodeAt(pos) == 10 /* CharCode.LineFeed */))
                        break;
                    // otherwise fall-through
                }
                case 10 /* CharCode.LineFeed */:
                case 9 /* CharCode.Tab */:
                case 11 /* CharCode.VerticalTab */:
                case 12 /* CharCode.FormFeed */:
                case 32 /* CharCode.Space */: {
                    ++pos;
                    break;
                }
                case 33 /* CharCode.Exclamation */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end &&
                        text.charCodeAt(pos) == 61 /* CharCode.Equals */) {
                        ++pos;
                        if (maxTokenLength > 2 && pos < end &&
                            text.charCodeAt(pos) == 61 /* CharCode.Equals */) {
                            this.pos = pos + 1;
                            return 79 /* Token.Exclamation_Equals_Equals */;
                        }
                        this.pos = pos;
                        return 77 /* Token.Exclamation_Equals */;
                    }
                    this.pos = pos;
                    return 95 /* Token.Exclamation */;
                }
                case 34 /* CharCode.DoubleQuote */:
                case 39 /* CharCode.SingleQuote */: {
                    this.pos = pos;
                    return 116 /* Token.StringLiteral */;
                }
                case 96 /* CharCode.Backtick */: {
                    this.pos = pos;
                    return 119 /* Token.TemplateLiteral */;
                }
                case 37 /* CharCode.Percent */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end &&
                        text.charCodeAt(pos) == 61 /* CharCode.Equals */) {
                        this.pos = pos + 1;
                        return 107 /* Token.Percent_Equals */;
                    }
                    this.pos = pos;
                    return 86 /* Token.Percent */;
                }
                case 38 /* CharCode.Ampersand */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end) {
                        var chr = text.charCodeAt(pos);
                        if (chr == 38 /* CharCode.Ampersand */) {
                            this.pos = pos + 1;
                            return 97 /* Token.Ampersand_Ampersand */;
                        }
                        if (chr == 61 /* CharCode.Equals */) {
                            this.pos = pos + 1;
                            return 111 /* Token.Ampersand_Equals */;
                        }
                    }
                    this.pos = pos;
                    return 92 /* Token.Ampersand */;
                }
                case 40 /* CharCode.OpenParen */: {
                    this.pos = pos + 1;
                    return 64 /* Token.OpenParen */;
                }
                case 41 /* CharCode.CloseParen */: {
                    this.pos = pos + 1;
                    return 65 /* Token.CloseParen */;
                }
                case 42 /* CharCode.Asterisk */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end) {
                        var chr = text.charCodeAt(pos);
                        if (chr == 61 /* CharCode.Equals */) {
                            this.pos = pos + 1;
                            return 104 /* Token.Asterisk_Equals */;
                        }
                        if (chr == 42 /* CharCode.Asterisk */) {
                            ++pos;
                            if (maxTokenLength > 2 && pos < end &&
                                text.charCodeAt(pos) == 61 /* CharCode.Equals */) {
                                this.pos = pos + 1;
                                return 105 /* Token.Asterisk_Asterisk_Equals */;
                            }
                            this.pos = pos;
                            return 83 /* Token.Asterisk_Asterisk */;
                        }
                    }
                    this.pos = pos;
                    return 84 /* Token.Asterisk */;
                }
                case 43 /* CharCode.Plus */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end) {
                        var chr = text.charCodeAt(pos);
                        if (chr == 43 /* CharCode.Plus */) {
                            this.pos = pos + 1;
                            return 87 /* Token.Plus_Plus */;
                        }
                        if (chr == 61 /* CharCode.Equals */) {
                            this.pos = pos + 1;
                            return 102 /* Token.Plus_Equals */;
                        }
                    }
                    this.pos = pos;
                    return 81 /* Token.Plus */;
                }
                case 44 /* CharCode.Comma */: {
                    this.pos = pos + 1;
                    return 71 /* Token.Comma */;
                }
                case 45 /* CharCode.Minus */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end) {
                        var chr = text.charCodeAt(pos);
                        if (chr == 45 /* CharCode.Minus */) {
                            this.pos = pos + 1;
                            return 88 /* Token.Minus_Minus */;
                        }
                        if (chr == 61 /* CharCode.Equals */) {
                            this.pos = pos + 1;
                            return 103 /* Token.Minus_Equals */;
                        }
                    }
                    this.pos = pos;
                    return 82 /* Token.Minus */;
                }
                case 46 /* CharCode.Dot */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end) {
                        var chr = text.charCodeAt(pos);
                        if ((0, util_1.isDecimal)(chr)) {
                            this.pos = pos - 1;
                            return 118 /* Token.FloatLiteral */; // expects a call to readFloat
                        }
                        if (maxTokenLength > 2 && pos + 1 < end &&
                            chr == 46 /* CharCode.Dot */ &&
                            text.charCodeAt(pos + 1) == 46 /* CharCode.Dot */) {
                            this.pos = pos + 2;
                            return 69 /* Token.Dot_Dot_Dot */;
                        }
                    }
                    this.pos = pos;
                    return 68 /* Token.Dot */;
                }
                case 47 /* CharCode.Slash */: {
                    var commentStartPos = pos;
                    ++pos;
                    if (maxTokenLength > 1 && pos < end) {
                        var chr = text.charCodeAt(pos);
                        if (chr == 47 /* CharCode.Slash */) { // single-line
                            var commentKind = 0 /* CommentKind.Line */;
                            if (pos + 1 < end &&
                                text.charCodeAt(pos + 1) == 47 /* CharCode.Slash */) {
                                ++pos;
                                commentKind = 1 /* CommentKind.Triple */;
                            }
                            while (++pos < end) {
                                if (text.charCodeAt(pos) == 10 /* CharCode.LineFeed */) {
                                    ++pos;
                                    break;
                                }
                            }
                            if (this.onComment) {
                                this.onComment(commentKind, text.substring(commentStartPos, pos), this.range(commentStartPos, pos));
                            }
                            break;
                        }
                        if (chr == 42 /* CharCode.Asterisk */) { // multi-line
                            var closed_1 = false;
                            while (++pos < end) {
                                c = text.charCodeAt(pos);
                                if (c == 42 /* CharCode.Asterisk */ &&
                                    pos + 1 < end &&
                                    text.charCodeAt(pos + 1) == 47 /* CharCode.Slash */) {
                                    pos += 2;
                                    closed_1 = true;
                                    break;
                                }
                            }
                            if (!closed_1) {
                                this.error(diagnostics_1.DiagnosticCode._0_expected, this.range(pos), "*/");
                            }
                            else if (this.onComment) {
                                this.onComment(2 /* CommentKind.Block */, text.substring(commentStartPos, pos), this.range(commentStartPos, pos));
                            }
                            break;
                        }
                        if (chr == 61 /* CharCode.Equals */) {
                            this.pos = pos + 1;
                            return 106 /* Token.Slash_Equals */;
                        }
                    }
                    this.pos = pos;
                    return 85 /* Token.Slash */;
                }
                case 48 /* CharCode._0 */:
                case 49 /* CharCode._1 */:
                case 50 /* CharCode._2 */:
                case 51 /* CharCode._3 */:
                case 52 /* CharCode._4 */:
                case 53 /* CharCode._5 */:
                case 54 /* CharCode._6 */:
                case 55 /* CharCode._7 */:
                case 56 /* CharCode._8 */:
                case 57 /* CharCode._9 */: {
                    this.pos = pos;
                    return this.testInteger()
                        ? 117 /* Token.IntegerLiteral */
                        : 118 /* Token.FloatLiteral */; // expects a call to readFloat
                }
                case 58 /* CharCode.Colon */: {
                    this.pos = pos + 1;
                    return 100 /* Token.Colon */;
                }
                case 59 /* CharCode.Semicolon */: {
                    this.pos = pos + 1;
                    return 70 /* Token.Semicolon */;
                }
                case 60 /* CharCode.LessThan */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end) {
                        var chr = text.charCodeAt(pos);
                        if (chr == 60 /* CharCode.LessThan */) {
                            ++pos;
                            if (maxTokenLength > 2 &&
                                pos < end &&
                                text.charCodeAt(pos) == 61 /* CharCode.Equals */) {
                                this.pos = pos + 1;
                                return 108 /* Token.LessThan_LessThan_Equals */;
                            }
                            this.pos = pos;
                            return 89 /* Token.LessThan_LessThan */;
                        }
                        if (chr == 61 /* CharCode.Equals */) {
                            this.pos = pos + 1;
                            return 74 /* Token.LessThan_Equals */;
                        }
                    }
                    this.pos = pos;
                    return 72 /* Token.LessThan */;
                }
                case 61 /* CharCode.Equals */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end) {
                        var chr = text.charCodeAt(pos);
                        if (chr == 61 /* CharCode.Equals */) {
                            ++pos;
                            if (maxTokenLength > 2 &&
                                pos < end &&
                                text.charCodeAt(pos) == 61 /* CharCode.Equals */) {
                                this.pos = pos + 1;
                                return 78 /* Token.Equals_Equals_Equals */;
                            }
                            this.pos = pos;
                            return 76 /* Token.Equals_Equals */;
                        }
                        if (chr == 62 /* CharCode.GreaterThan */) {
                            this.pos = pos + 1;
                            return 80 /* Token.Equals_GreaterThan */;
                        }
                    }
                    this.pos = pos;
                    return 101 /* Token.Equals */;
                }
                case 62 /* CharCode.GreaterThan */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end) {
                        var chr = text.charCodeAt(pos);
                        if (chr == 62 /* CharCode.GreaterThan */) {
                            ++pos;
                            if (maxTokenLength > 2 && pos < end) {
                                chr = text.charCodeAt(pos);
                                if (chr == 62 /* CharCode.GreaterThan */) {
                                    ++pos;
                                    if (maxTokenLength > 3 && pos < end &&
                                        text.charCodeAt(pos) == 61 /* CharCode.Equals */) {
                                        this.pos = pos + 1;
                                        return 110 /* Token.GreaterThan_GreaterThan_GreaterThan_Equals */;
                                    }
                                    this.pos = pos;
                                    return 91 /* Token.GreaterThan_GreaterThan_GreaterThan */;
                                }
                                if (chr == 61 /* CharCode.Equals */) {
                                    this.pos = pos + 1;
                                    return 109 /* Token.GreaterThan_GreaterThan_Equals */;
                                }
                            }
                            this.pos = pos;
                            return 90 /* Token.GreaterThan_GreaterThan */;
                        }
                        if (chr == 61 /* CharCode.Equals */) {
                            this.pos = pos + 1;
                            return 75 /* Token.GreaterThan_Equals */;
                        }
                    }
                    this.pos = pos;
                    return 73 /* Token.GreaterThan */;
                }
                case 63 /* CharCode.Question */: {
                    this.pos = pos + 1;
                    return 99 /* Token.Question */;
                }
                case 91 /* CharCode.OpenBracket */: {
                    this.pos = pos + 1;
                    return 66 /* Token.OpenBracket */;
                }
                case 93 /* CharCode.CloseBracket */: {
                    this.pos = pos + 1;
                    return 67 /* Token.CloseBracket */;
                }
                case 94 /* CharCode.Caret */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end &&
                        text.charCodeAt(pos) == 61 /* CharCode.Equals */) {
                        this.pos = pos + 1;
                        return 113 /* Token.Caret_Equals */;
                    }
                    this.pos = pos;
                    return 94 /* Token.Caret */;
                }
                case 123 /* CharCode.OpenBrace */: {
                    this.pos = pos + 1;
                    return 62 /* Token.OpenBrace */;
                }
                case 124 /* CharCode.Bar */: {
                    ++pos;
                    if (maxTokenLength > 1 && pos < end) {
                        var chr = text.charCodeAt(pos);
                        if (chr == 124 /* CharCode.Bar */) {
                            this.pos = pos + 1;
                            return 98 /* Token.Bar_Bar */;
                        }
                        if (chr == 61 /* CharCode.Equals */) {
                            this.pos = pos + 1;
                            return 112 /* Token.Bar_Equals */;
                        }
                    }
                    this.pos = pos;
                    return 93 /* Token.Bar */;
                }
                case 125 /* CharCode.CloseBrace */: {
                    this.pos = pos + 1;
                    return 63 /* Token.CloseBrace */;
                }
                case 126 /* CharCode.Tilde */: {
                    this.pos = pos + 1;
                    return 96 /* Token.Tilde */;
                }
                case 64 /* CharCode.At */: {
                    this.pos = pos + 1;
                    return 114 /* Token.At */;
                }
                default: {
                    // Unicode-aware from here on
                    if ((0, util_1.isHighSurrogate)(c) && pos + 1 < end) {
                        c = (0, util_1.combineSurrogates)(c, text.charCodeAt(pos + 1));
                    }
                    if ((0, util_1.isIdentifierStart)(c)) {
                        var posBefore = pos;
                        while ((pos += (0, util_1.numCodeUnits)(c)) < end &&
                            (0, util_1.isIdentifierPart)(c = text.codePointAt(pos))) { /* nop */ }
                        if (identifierHandling != 2 /* IdentifierHandling.Always */) {
                            var maybeKeywordToken = tokenFromKeyword(text.substring(posBefore, pos));
                            if (maybeKeywordToken != 120 /* Token.Invalid */ &&
                                !(identifierHandling == 1 /* IdentifierHandling.Prefer */ &&
                                    tokenIsAlsoIdentifier(maybeKeywordToken))) {
                                this.pos = pos;
                                return maybeKeywordToken;
                            }
                        }
                        this.pos = posBefore;
                        return 115 /* Token.Identifier */;
                    }
                    else if ((0, util_1.isWhiteSpace)(c)) {
                        ++pos; // assume no supplementary whitespaces
                        break;
                    }
                    var start = pos;
                    pos += (0, util_1.numCodeUnits)(c);
                    this.error(diagnostics_1.DiagnosticCode.Invalid_character, this.range(start, pos));
                    this.pos = pos;
                    return 120 /* Token.Invalid */;
                }
            }
        }
        this.pos = pos;
        return 121 /* Token.EndOfFile */;
    };
    Tokenizer.prototype.peek = function (checkOnNewLine, identifierHandling, maxCompoundLength) {
        if (checkOnNewLine === void 0) { checkOnNewLine = false; }
        if (identifierHandling === void 0) { identifierHandling = 0 /* IdentifierHandling.Default */; }
        if (maxCompoundLength === void 0) { maxCompoundLength = i32.MAX_VALUE; }
        var text = this.source.text;
        if (this.nextToken < 0) {
            var posBefore = this.pos;
            var tokenBefore = this.token;
            var tokenPosBefore = this.tokenPos;
            var nextToken = void 0;
            do
                nextToken = this.unsafeNext(identifierHandling, maxCompoundLength);
            while (nextToken == 120 /* Token.Invalid */);
            this.nextToken = nextToken;
            this.nextTokenPos = this.tokenPos;
            if (checkOnNewLine) {
                this.nextTokenOnNewLine = false;
                for (var pos = posBefore, end = this.nextTokenPos; pos < end; ++pos) {
                    if ((0, util_1.isLineBreak)(text.charCodeAt(pos))) {
                        this.nextTokenOnNewLine = true;
                        break;
                    }
                }
            }
            this.pos = posBefore;
            this.token = tokenBefore;
            this.tokenPos = tokenPosBefore;
        }
        return this.nextToken;
    };
    Tokenizer.prototype.skipIdentifier = function (identifierHandling) {
        if (identifierHandling === void 0) { identifierHandling = 1 /* IdentifierHandling.Prefer */; }
        return this.skip(115 /* Token.Identifier */, identifierHandling);
    };
    Tokenizer.prototype.skip = function (token, identifierHandling) {
        if (identifierHandling === void 0) { identifierHandling = 0 /* IdentifierHandling.Default */; }
        var posBefore = this.pos;
        var tokenBefore = this.token;
        var tokenPosBefore = this.tokenPos;
        var maxCompoundLength = i32.MAX_VALUE;
        if (token == 73 /* Token.GreaterThan */) { // where parsing type arguments
            maxCompoundLength = 1;
        }
        var nextToken;
        do
            nextToken = this.unsafeNext(identifierHandling, maxCompoundLength);
        while (nextToken == 120 /* Token.Invalid */);
        if (nextToken == token) {
            this.token = token;
            this.nextToken = -1;
            return true;
        }
        else {
            this.pos = posBefore;
            this.token = tokenBefore;
            this.tokenPos = tokenPosBefore;
            return false;
        }
    };
    Tokenizer.prototype.mark = function () {
        var state = reusableState;
        if (state) {
            reusableState = null;
            state.pos = this.pos;
            state.token = this.token;
            state.tokenPos = this.tokenPos;
        }
        else {
            state = new State(this.pos, this.token, this.tokenPos);
        }
        return state;
    };
    Tokenizer.prototype.discard = function (state) {
        reusableState = state;
    };
    Tokenizer.prototype.reset = function (state) {
        this.pos = state.pos;
        this.token = state.token;
        this.tokenPos = state.tokenPos;
        this.nextToken = -1;
    };
    Tokenizer.prototype.range = function (start, end) {
        if (start === void 0) { start = -1; }
        if (end === void 0) { end = -1; }
        if (start < 0) {
            start = this.tokenPos;
            end = this.pos;
        }
        else if (end < 0) {
            end = start;
        }
        var range = new diagnostics_1.Range(start, end);
        range.source = this.source;
        return range;
    };
    Tokenizer.prototype.readIdentifier = function () {
        var text = this.source.text;
        var end = this.end;
        var pos = this.pos;
        var start = pos;
        var c = text.codePointAt(pos);
        assert((0, util_1.isIdentifierStart)(c));
        while ((pos += (0, util_1.numCodeUnits)(c)) < end &&
            (0, util_1.isIdentifierPart)(c = text.codePointAt(pos)))
            ;
        this.pos = pos;
        return text.substring(start, pos);
    };
    Tokenizer.prototype.readString = function (quote, isTaggedTemplate) {
        if (quote === void 0) { quote = 0; }
        if (isTaggedTemplate === void 0) { isTaggedTemplate = false; }
        var text = this.source.text;
        var end = this.end;
        var pos = this.pos;
        if (!quote)
            quote = text.charCodeAt(pos++);
        var start = pos;
        this.readStringStart = start;
        var result = "";
        while (true) {
            if (pos >= end) {
                result += text.substring(start, pos);
                this.error(diagnostics_1.DiagnosticCode.Unterminated_string_literal, this.range(start - 1, end));
                this.readStringEnd = end;
                break;
            }
            var c = text.charCodeAt(pos);
            if (c == quote) {
                this.readStringEnd = pos;
                result += text.substring(start, pos++);
                break;
            }
            if (c == 92 /* CharCode.Backslash */) {
                result += text.substring(start, pos);
                this.pos = pos; // save
                result += this.readEscapeSequence(isTaggedTemplate);
                pos = this.pos; // restore
                start = pos;
                continue;
            }
            if (quote == 96 /* CharCode.Backtick */) {
                if (c == 36 /* CharCode.Dollar */ && pos + 1 < end && text.charCodeAt(pos + 1) == 123 /* CharCode.OpenBrace */) {
                    result += text.substring(start, pos);
                    this.readStringEnd = pos;
                    this.pos = pos + 2;
                    this.readingTemplateString = true;
                    return result;
                }
            }
            else if ((0, util_1.isLineBreak)(c)) {
                result += text.substring(start, pos);
                this.error(diagnostics_1.DiagnosticCode.Unterminated_string_literal, this.range(start - 1, pos));
                this.readStringEnd = pos;
                break;
            }
            ++pos;
        }
        this.pos = pos;
        this.readingTemplateString = false;
        return result;
    };
    Tokenizer.prototype.readEscapeSequence = function (isTaggedTemplate) {
        if (isTaggedTemplate === void 0) { isTaggedTemplate = false; }
        // for context on isTaggedTemplate, see: https://tc39.es/proposal-template-literal-revision/
        var start = this.pos;
        var end = this.end;
        if (++this.pos >= end) {
            this.error(diagnostics_1.DiagnosticCode.Unexpected_end_of_text, this.range(end));
            return "";
        }
        var text = this.source.text;
        var c = text.charCodeAt(this.pos++);
        switch (c) {
            case 48 /* CharCode._0 */: {
                if (isTaggedTemplate && this.pos < end && (0, util_1.isDecimal)(text.charCodeAt(this.pos))) {
                    ++this.pos;
                    return text.substring(start, this.pos);
                }
                return "\0";
            }
            case 98 /* CharCode.b */: return "\b";
            case 116 /* CharCode.t */: return "\t";
            case 110 /* CharCode.n */: return "\n";
            case 118 /* CharCode.v */: return "\v";
            case 102 /* CharCode.f */: return "\f";
            case 114 /* CharCode.r */: return "\r";
            case 39 /* CharCode.SingleQuote */: return "'";
            case 34 /* CharCode.DoubleQuote */: return "\"";
            case 117 /* CharCode.u */: {
                if (this.pos < end &&
                    text.charCodeAt(this.pos) == 123 /* CharCode.OpenBrace */) {
                    ++this.pos;
                    return this.readExtendedUnicodeEscape(isTaggedTemplate ? start : -1); // \u{DDDDDDDD}
                }
                return this.readUnicodeEscape(isTaggedTemplate ? start : -1); // \uDDDD
            }
            case 120 /* CharCode.x */: {
                return this.readHexadecimalEscape(2, isTaggedTemplate ? start : -1); // \xDD
            }
            case 13 /* CharCode.CarriageReturn */: {
                if (this.pos < end &&
                    text.charCodeAt(this.pos) == 10 /* CharCode.LineFeed */) {
                    ++this.pos;
                }
                // fall through
            }
            case 10 /* CharCode.LineFeed */:
            case 8232 /* CharCode.LineSeparator */:
            case 8233 /* CharCode.ParagraphSeparator */: return "";
            default: return String.fromCodePoint(c);
        }
    };
    Tokenizer.prototype.readRegexpPattern = function () {
        var text = this.source.text;
        var start = this.pos;
        var end = this.end;
        var escaped = false;
        while (true) {
            if (this.pos >= end) {
                this.error(diagnostics_1.DiagnosticCode.Unterminated_regular_expression_literal, this.range(start, end));
                break;
            }
            if (text.charCodeAt(this.pos) == 92 /* CharCode.Backslash */) {
                ++this.pos;
                escaped = true;
                continue;
            }
            var c = text.charCodeAt(this.pos);
            if (!escaped && c == 47 /* CharCode.Slash */)
                break;
            if ((0, util_1.isLineBreak)(c)) {
                this.error(diagnostics_1.DiagnosticCode.Unterminated_regular_expression_literal, this.range(start, this.pos));
                break;
            }
            ++this.pos;
            escaped = false;
        }
        return text.substring(start, this.pos);
    };
    Tokenizer.prototype.readRegexpFlags = function () {
        var text = this.source.text;
        var start = this.pos;
        var end = this.end;
        var flags = 0;
        while (this.pos < end) {
            var c = text.charCodeAt(this.pos);
            if (!(0, util_1.isIdentifierPart)(c))
                break;
            ++this.pos;
            // make sure each supported flag is unique
            switch (c) {
                case 103 /* CharCode.g */: {
                    flags |= flags & 1 ? -1 : 1;
                    break;
                }
                case 105 /* CharCode.i */: {
                    flags |= flags & 2 ? -1 : 2;
                    break;
                }
                case 109 /* CharCode.m */: {
                    flags |= flags & 4 ? -1 : 4;
                    break;
                }
                default: {
                    flags = -1;
                    break;
                }
            }
        }
        if (flags == -1) {
            this.error(diagnostics_1.DiagnosticCode.Invalid_regular_expression_flags, this.range(start, this.pos));
        }
        return text.substring(start, this.pos);
    };
    Tokenizer.prototype.testInteger = function () {
        var text = this.source.text;
        var pos = this.pos;
        var end = this.end;
        if (pos + 1 < end && text.charCodeAt(pos) == 48 /* CharCode._0 */) {
            switch (text.charCodeAt(pos + 2) | 32) {
                case 120 /* CharCode.x */:
                case 98 /* CharCode.b */:
                case 111 /* CharCode.o */: return true;
            }
        }
        while (pos < end) {
            var c = text.charCodeAt(pos);
            if (c == 46 /* CharCode.Dot */ || (c | 32) == 101 /* CharCode.e */)
                return false;
            if (c != 95 /* CharCode._ */ && (c < 48 /* CharCode._0 */ || c > 57 /* CharCode._9 */))
                break;
            // does not validate separator placement (this is done in readXYInteger)
            pos++;
        }
        return true;
    };
    Tokenizer.prototype.readInteger = function () {
        var text = this.source.text;
        var pos = this.pos;
        if (pos + 2 < this.end && text.charCodeAt(pos) == 48 /* CharCode._0 */) {
            switch (text.charCodeAt(pos + 1) | 32) {
                case 120 /* CharCode.x */: {
                    this.pos = pos + 2;
                    return this.readHexInteger();
                }
                case 98 /* CharCode.b */: {
                    this.pos = pos + 2;
                    return this.readBinaryInteger();
                }
                case 111 /* CharCode.o */: {
                    this.pos = pos + 2;
                    return this.readOctalInteger();
                }
            }
            if ((0, util_1.isOctal)(text.charCodeAt(pos + 1))) {
                var start = pos;
                this.pos = pos + 1;
                var value = this.readOctalInteger();
                this.error(diagnostics_1.DiagnosticCode.Octal_literals_are_not_allowed_in_strict_mode, this.range(start, this.pos));
                return value;
            }
        }
        return this.readDecimalInteger();
    };
    Tokenizer.prototype.readHexInteger = function () {
        var text = this.source.text;
        var pos = this.pos;
        var end = this.end;
        var start = pos;
        var sepEnd = start;
        var value = i64_zero;
        var i64_4 = i64_new(4);
        var nextValue = value;
        var overflowOccurred = false;
        while (pos < end) {
            var c = text.charCodeAt(pos);
            if ((0, util_1.isDecimal)(c)) {
                // (value << 4) + c - CharCode._0
                nextValue = i64_add(i64_shl(value, i64_4), i64_new(c - 48 /* CharCode._0 */));
            }
            else if ((0, util_1.isHexBase)(c)) {
                // (value << 4) + (c | 32) + (10 - CharCode.a)
                nextValue = i64_add(i64_shl(value, i64_4), i64_new((c | 32) + (10 - 97 /* CharCode.a */)));
            }
            else if (c == 95 /* CharCode._ */) {
                if (sepEnd == pos) {
                    this.error(sepEnd == start
                        ? diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here
                        : diagnostics_1.DiagnosticCode.Multiple_consecutive_numeric_separators_are_not_permitted, this.range(pos));
                }
                sepEnd = pos + 1;
            }
            else {
                break;
            }
            if (i64_gt_u(value, nextValue)) {
                // Unsigned overflow occurred
                overflowOccurred = true;
            }
            value = nextValue;
            ++pos;
        }
        if (pos == start) {
            this.error(diagnostics_1.DiagnosticCode.Hexadecimal_digit_expected, this.range(start));
        }
        else if (sepEnd == pos) {
            this.error(diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here, this.range(sepEnd - 1));
        }
        if (overflowOccurred) {
            this.error(diagnostics_1.DiagnosticCode.Literal_0_does_not_fit_into_i64_or_u64_types, this.range(start - 2, pos), this.source.text.substring(start - 2, pos));
        }
        this.pos = pos;
        return value;
    };
    Tokenizer.prototype.readDecimalInteger = function () {
        var text = this.source.text;
        var pos = this.pos;
        var end = this.end;
        var start = pos;
        var sepEnd = start;
        var value = i64_zero;
        var i64_10 = i64_new(10);
        var nextValue = value;
        var overflowOccurred = false;
        while (pos < end) {
            var c = text.charCodeAt(pos);
            if ((0, util_1.isDecimal)(c)) {
                // value = value * 10 + c - CharCode._0;
                nextValue = i64_add(i64_mul(value, i64_10), i64_new(c - 48 /* CharCode._0 */));
            }
            else if (c == 95 /* CharCode._ */) {
                if (sepEnd == pos) {
                    this.error(sepEnd == start
                        ? diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here
                        : diagnostics_1.DiagnosticCode.Multiple_consecutive_numeric_separators_are_not_permitted, this.range(pos));
                }
                else if (pos - 1 == start && text.charCodeAt(pos - 1) == 48 /* CharCode._0 */) {
                    this.error(diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here, this.range(pos));
                }
                sepEnd = pos + 1;
            }
            else {
                break;
            }
            if (i64_gt_u(value, nextValue)) {
                // Unsigned overflow occurred
                overflowOccurred = true;
            }
            value = nextValue;
            ++pos;
        }
        if (pos == start) {
            this.error(diagnostics_1.DiagnosticCode.Digit_expected, this.range(start));
        }
        else if (sepEnd == pos) {
            this.error(diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here, this.range(sepEnd - 1));
        }
        else if (overflowOccurred) {
            this.error(diagnostics_1.DiagnosticCode.Literal_0_does_not_fit_into_i64_or_u64_types, this.range(start, pos), this.source.text.substring(start, pos));
        }
        this.pos = pos;
        return value;
    };
    Tokenizer.prototype.readOctalInteger = function () {
        var text = this.source.text;
        var pos = this.pos;
        var end = this.end;
        var start = pos;
        var sepEnd = start;
        var value = i64_zero;
        var i64_3 = i64_new(3);
        var nextValue = value;
        var overflowOccurred = false;
        while (pos < end) {
            var c = text.charCodeAt(pos);
            if ((0, util_1.isOctal)(c)) {
                // (value << 3) + c - CharCode._0
                nextValue = i64_add(i64_shl(value, i64_3), i64_new(c - 48 /* CharCode._0 */));
            }
            else if (c == 95 /* CharCode._ */) {
                if (sepEnd == pos) {
                    this.error(sepEnd == start
                        ? diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here
                        : diagnostics_1.DiagnosticCode.Multiple_consecutive_numeric_separators_are_not_permitted, this.range(pos));
                }
                sepEnd = pos + 1;
            }
            else {
                break;
            }
            if (i64_gt_u(value, nextValue)) {
                // Unsigned overflow occurred
                overflowOccurred = true;
            }
            value = nextValue;
            ++pos;
        }
        if (pos == start) {
            this.error(diagnostics_1.DiagnosticCode.Octal_digit_expected, this.range(start));
        }
        else if (sepEnd == pos) {
            this.error(diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here, this.range(sepEnd - 1));
        }
        else if (overflowOccurred) {
            this.error(diagnostics_1.DiagnosticCode.Literal_0_does_not_fit_into_i64_or_u64_types, this.range(start - 2, pos), this.source.text.substring(start - 2, pos));
        }
        this.pos = pos;
        return value;
    };
    Tokenizer.prototype.readBinaryInteger = function () {
        var text = this.source.text;
        var pos = this.pos;
        var end = this.end;
        var start = pos;
        var sepEnd = start;
        var value = i64_zero;
        var nextValue = value;
        var overflowOccurred = false;
        while (pos < end) {
            var c = text.charCodeAt(pos);
            if (c == 48 /* CharCode._0 */) {
                // value << 1 | 0
                nextValue = i64_shl(value, i64_one);
            }
            else if (c == 49 /* CharCode._1 */) {
                // value << 1 | 1
                nextValue = i64_or(i64_shl(value, i64_one), i64_one);
            }
            else if (c == 95 /* CharCode._ */) {
                if (sepEnd == pos) {
                    this.error(sepEnd == start
                        ? diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here
                        : diagnostics_1.DiagnosticCode.Multiple_consecutive_numeric_separators_are_not_permitted, this.range(pos));
                }
                sepEnd = pos + 1;
            }
            else {
                break;
            }
            if (i64_gt(value, nextValue)) {
                // Overflow occurred
                overflowOccurred = true;
            }
            value = nextValue;
            ++pos;
        }
        if (pos == start) {
            this.error(diagnostics_1.DiagnosticCode.Binary_digit_expected, this.range(start));
        }
        else if (sepEnd == pos) {
            this.error(diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here, this.range(sepEnd - 1));
        }
        else if (overflowOccurred) {
            this.error(diagnostics_1.DiagnosticCode.Literal_0_does_not_fit_into_i64_or_u64_types, this.range(start - 2, pos), this.source.text.substring(start - 2, pos));
        }
        this.pos = pos;
        return value;
    };
    Tokenizer.prototype.readFloat = function () {
        // let text = this.source.text;
        // if (text.charCodeAt(this.pos) == CharCode._0 && this.pos + 2 < this.end) {
        //   switch (text.charCodeAt(this.pos + 1)) {
        //     case CharCode.X:
        //     case CharCode.x: {
        //       this.pos += 2;
        //       return this.readHexFloat();
        //     }
        //   }
        // }
        return this.readDecimalFloat();
    };
    Tokenizer.prototype.readDecimalFloat = function () {
        var text = this.source.text;
        var end = this.end;
        var start = this.pos;
        var sepCount = this.readDecimalFloatPartial(false);
        if (this.pos < end && text.charCodeAt(this.pos) == 46 /* CharCode.Dot */) {
            ++this.pos;
            sepCount += this.readDecimalFloatPartial();
        }
        if (this.pos < end) {
            var c = text.charCodeAt(this.pos);
            if ((c | 32) == 101 /* CharCode.e */) {
                if (++this.pos < end &&
                    (c = text.charCodeAt(this.pos)) == 45 /* CharCode.Minus */ || c == 43 /* CharCode.Plus */ &&
                    (0, util_1.isDecimal)(text.charCodeAt(this.pos + 1))) {
                    ++this.pos;
                }
                sepCount += this.readDecimalFloatPartial();
            }
        }
        var result = text.substring(start, this.pos);
        if (sepCount)
            result = result.replaceAll("_", "");
        return parseFloat(result);
    };
    /** Reads past one section of a decimal float literal. Returns the number of separators encountered. */
    Tokenizer.prototype.readDecimalFloatPartial = function (allowLeadingZeroSep) {
        if (allowLeadingZeroSep === void 0) { allowLeadingZeroSep = true; }
        var text = this.source.text;
        var pos = this.pos;
        var start = pos;
        var end = this.end;
        var sepEnd = start;
        var sepCount = 0;
        while (pos < end) {
            var c = text.charCodeAt(pos);
            if (c == 95 /* CharCode._ */) {
                if (sepEnd == pos) {
                    this.error(sepEnd == start
                        ? diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here
                        : diagnostics_1.DiagnosticCode.Multiple_consecutive_numeric_separators_are_not_permitted, this.range(pos));
                }
                else if (!allowLeadingZeroSep && pos - 1 == start && text.charCodeAt(pos - 1) == 48 /* CharCode._0 */) {
                    this.error(diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here, this.range(pos));
                }
                sepEnd = pos + 1;
                ++sepCount;
            }
            else if (!(0, util_1.isDecimal)(c)) {
                break;
            }
            ++pos;
        }
        if (pos != start && sepEnd == pos) {
            this.error(diagnostics_1.DiagnosticCode.Numeric_separators_are_not_allowed_here, this.range(sepEnd - 1));
        }
        this.pos = pos;
        return sepCount;
    };
    Tokenizer.prototype.readHexFloat = function () {
        throw new Error("not implemented"); // TBD
    };
    Tokenizer.prototype.readHexadecimalEscape = function (remain, startIfTaggedTemplate) {
        if (remain === void 0) { remain = 2; }
        if (startIfTaggedTemplate === void 0) { startIfTaggedTemplate = -1; }
        var value = 0;
        var text = this.source.text;
        var pos = this.pos;
        var end = this.end;
        while (pos < end) {
            var c = text.charCodeAt(pos++);
            if ((0, util_1.isDecimal)(c)) {
                value = (value << 4) + c - 48 /* CharCode._0 */;
            }
            else if ((0, util_1.isHexBase)(c)) {
                value = (value << 4) + (c | 32) + (10 - 97 /* CharCode.a */);
            }
            else if (~startIfTaggedTemplate) {
                this.pos = --pos;
                return text.substring(startIfTaggedTemplate, pos);
            }
            else {
                this.pos = pos;
                this.error(diagnostics_1.DiagnosticCode.Hexadecimal_digit_expected, this.range(pos - 1, pos));
                return "";
            }
            if (--remain == 0)
                break;
        }
        if (remain) { // invalid
            this.pos = pos;
            if (~startIfTaggedTemplate) {
                return text.substring(startIfTaggedTemplate, pos);
            }
            this.error(diagnostics_1.DiagnosticCode.Unexpected_end_of_text, this.range(pos));
            return "";
        }
        this.pos = pos;
        return String.fromCodePoint(value);
    };
    Tokenizer.prototype.checkForIdentifierStartAfterNumericLiteral = function () {
        // TODO: BigInt n
        var pos = this.pos;
        if (pos < this.end && (0, util_1.isIdentifierStart)(this.source.text.charCodeAt(pos))) {
            this.error(diagnostics_1.DiagnosticCode.An_identifier_or_keyword_cannot_immediately_follow_a_numeric_literal, this.range(pos));
        }
    };
    Tokenizer.prototype.readUnicodeEscape = function (startIfTaggedTemplate) {
        if (startIfTaggedTemplate === void 0) { startIfTaggedTemplate = -1; }
        return this.readHexadecimalEscape(4, startIfTaggedTemplate);
    };
    Tokenizer.prototype.readExtendedUnicodeEscape = function (startIfTaggedTemplate) {
        if (startIfTaggedTemplate === void 0) { startIfTaggedTemplate = -1; }
        var start = this.pos;
        var value = this.readHexInteger();
        var value32 = i64_low(value);
        var invalid = false;
        assert(!i64_high(value));
        if (value32 > 0x10FFFF) {
            if (startIfTaggedTemplate == -1) {
                this.error(diagnostics_1.DiagnosticCode.An_extended_Unicode_escape_value_must_be_between_0x0_and_0x10FFFF_inclusive, this.range(start, this.pos));
            }
            invalid = true;
        }
        var end = this.end;
        var text = this.source.text;
        if (this.pos >= end) {
            if (startIfTaggedTemplate == -1) {
                this.error(diagnostics_1.DiagnosticCode.Unexpected_end_of_text, this.range(start, end));
            }
            invalid = true;
        }
        else if (text.charCodeAt(this.pos) == 125 /* CharCode.CloseBrace */) {
            ++this.pos;
        }
        else {
            if (startIfTaggedTemplate == -1) {
                this.error(diagnostics_1.DiagnosticCode.Unterminated_Unicode_escape_sequence, this.range(start, this.pos));
            }
            invalid = true;
        }
        if (invalid) {
            return ~startIfTaggedTemplate
                ? text.substring(startIfTaggedTemplate, this.pos)
                : "";
        }
        return String.fromCodePoint(value32);
    };
    return Tokenizer;
}(diagnostics_1.DiagnosticEmitter));
exports.Tokenizer = Tokenizer;
/** Tokenizer state as returned by {@link Tokenizer#mark} and consumed by {@link Tokenizer#reset}. */
var State = /** @class */ (function () {
    function State(
    /** Current position. */
    pos, 
    /** Current token. */
    token, 
    /** Current token's position. */
    tokenPos) {
        this.pos = pos;
        this.token = token;
        this.tokenPos = tokenPos;
    }
    return State;
}());
exports.State = State;
// Reusable state object to reduce allocations
var reusableState = null;
