"use strict";
/**
 * @fileoverview Abstract syntax tree representing a source file once parsed.
 *
 * Each node in the AST is represented by an instance of a subclass of `Node`,
 * with its `Node#kind` represented by one of the `NodeKind` constants, which
 * dependent code typically switches over. The intended way to create a node
 * is to use the respective `Node.createX` method instead of its constructor.
 *
 * Note that the AST does not contain any type information except type names.
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
exports.BreakStatement = exports.BlockStatement = exports.VariableLikeDeclarationStatement = exports.IndexSignatureNode = exports.DeclarationStatement = exports.Source = exports.Statement = exports.CompiledExpression = exports.UnaryPrefixExpression = exports.UnaryPostfixExpression = exports.UnaryExpression = exports.FalseExpression = exports.TrueExpression = exports.ThisExpression = exports.TemplateLiteralExpression = exports.SuperExpression = exports.StringLiteralExpression = exports.TernaryExpression = exports.RegexpLiteralExpression = exports.PropertyAccessExpression = exports.ParenthesizedExpression = exports.OmittedExpression = exports.ObjectLiteralExpression = exports.NullExpression = exports.NewExpression = exports.IntegerLiteralExpression = exports.InstanceOfExpression = exports.FunctionExpression = exports.FloatLiteralExpression = exports.ElementAccessExpression = exports.ConstructorExpression = exports.CommaExpression = exports.ClassExpression = exports.CallExpression = exports.BinaryExpression = exports.AssertionExpression = exports.ArrayLiteralExpression = exports.LiteralExpression = exports.IdentifierExpression = exports.Expression = exports.CommentNode = exports.DecoratorNode = exports.DecoratorKind = exports.ParameterNode = exports.TypeParameterNode = exports.FunctionTypeNode = exports.NamedTypeNode = exports.TypeName = exports.TypeNode = exports.Node = void 0;
exports.isTypeOmitted = exports.mangleInternalPath = exports.findDecorator = exports.WhileStatement = exports.VoidStatement = exports.VariableStatement = exports.VariableDeclaration = exports.TypeDeclaration = exports.ModuleDeclaration = exports.TryStatement = exports.ThrowStatement = exports.SwitchStatement = exports.SwitchCase = exports.ReturnStatement = exports.NamespaceDeclaration = exports.MethodDeclaration = exports.InterfaceDeclaration = exports.ImportStatement = exports.ImportDeclaration = exports.IfStatement = exports.FunctionDeclaration = exports.ForOfStatement = exports.ForStatement = exports.FieldDeclaration = exports.ExpressionStatement = exports.ExportDefaultStatement = exports.ExportStatement = exports.ExportMember = exports.ExportImportStatement = exports.EnumValueDeclaration = exports.EnumDeclaration = exports.EmptyStatement = exports.DoStatement = exports.ContinueStatement = exports.ClassDeclaration = void 0;
// TODO: Make the AST more easily serializable by refactoring `Node#range` so
// it doesn't reference the non-serializable `Source` object.
var common_1 = require("./common");
var diagnostics_1 = require("./diagnostics");
var util_1 = require("./util");
/** Base class of all nodes. */
var Node = /** @class */ (function () {
    function Node(
    /** Kind of this node. */
    kind, 
    /** Source range. */
    range) {
        this.kind = kind;
        this.range = range;
    }
    // types
    Node.createSimpleTypeName = function (name, range) {
        return new TypeName(Node.createIdentifierExpression(name, range), null, range);
    };
    Node.createNamedType = function (name, typeArguments, isNullable, range) {
        return new NamedTypeNode(name, typeArguments, isNullable, range);
    };
    Node.createFunctionType = function (parameters, returnType, explicitThisType, isNullable, range) {
        return new FunctionTypeNode(parameters, returnType, explicitThisType, isNullable, range);
    };
    Node.createOmittedType = function (range) {
        return new NamedTypeNode(Node.createSimpleTypeName("", range), null, false, range);
    };
    Node.createTypeParameter = function (name, extendsType, defaultType, range) {
        return new TypeParameterNode(name, extendsType, defaultType, range);
    };
    Node.createParameter = function (parameterKind, name, type, initializer, range) {
        return new ParameterNode(parameterKind, name, type, initializer, range);
    };
    // special
    Node.createDecorator = function (name, args, range) {
        return new DecoratorNode(DecoratorKind.fromNode(name), name, args, range);
    };
    Node.createComment = function (commentKind, text, range) {
        return new CommentNode(commentKind, text, range);
    };
    // expressions
    Node.createIdentifierExpression = function (text, range, isQuoted) {
        if (isQuoted === void 0) { isQuoted = false; }
        return new IdentifierExpression(text, isQuoted, range);
    };
    Node.createEmptyIdentifierExpression = function (range) {
        return new IdentifierExpression("", false, range);
    };
    Node.createArrayLiteralExpression = function (elementExpressions, range) {
        return new ArrayLiteralExpression(elementExpressions, range);
    };
    Node.createAssertionExpression = function (assertionKind, expression, toType, range) {
        return new AssertionExpression(assertionKind, expression, toType, range);
    };
    Node.createBinaryExpression = function (operator, left, right, range) {
        return new BinaryExpression(operator, left, right, range);
    };
    Node.createCallExpression = function (expression, typeArguments, args, range) {
        return new CallExpression(expression, typeArguments, args, range);
    };
    Node.createClassExpression = function (declaration) {
        return new ClassExpression(declaration);
    };
    Node.createCommaExpression = function (expressions, range) {
        return new CommaExpression(expressions, range);
    };
    Node.createConstructorExpression = function (range) {
        return new ConstructorExpression(range);
    };
    Node.createElementAccessExpression = function (expression, elementExpression, range) {
        return new ElementAccessExpression(expression, elementExpression, range);
    };
    Node.createFalseExpression = function (range) {
        return new FalseExpression(range);
    };
    Node.createFloatLiteralExpression = function (value, range) {
        return new FloatLiteralExpression(value, range);
    };
    Node.createFunctionExpression = function (declaration) {
        return new FunctionExpression(declaration);
    };
    Node.createInstanceOfExpression = function (expression, isType, range) {
        return new InstanceOfExpression(expression, isType, range);
    };
    Node.createIntegerLiteralExpression = function (value, range) {
        return new IntegerLiteralExpression(value, range);
    };
    Node.createNewExpression = function (typeName, typeArguments, args, range) {
        return new NewExpression(typeName, typeArguments, args, range);
    };
    Node.createNullExpression = function (range) {
        return new NullExpression(range);
    };
    Node.createObjectLiteralExpression = function (names, values, range) {
        return new ObjectLiteralExpression(names, values, range);
    };
    Node.createOmittedExpression = function (range) {
        return new OmittedExpression(range);
    };
    Node.createParenthesizedExpression = function (expression, range) {
        return new ParenthesizedExpression(expression, range);
    };
    Node.createPropertyAccessExpression = function (expression, property, range) {
        return new PropertyAccessExpression(expression, property, range);
    };
    Node.createRegexpLiteralExpression = function (pattern, patternFlags, range) {
        return new RegexpLiteralExpression(pattern, patternFlags, range);
    };
    Node.createTernaryExpression = function (condition, ifThen, ifElse, range) {
        return new TernaryExpression(condition, ifThen, ifElse, range);
    };
    Node.createStringLiteralExpression = function (value, range) {
        return new StringLiteralExpression(value, range);
    };
    Node.createSuperExpression = function (range) {
        return new SuperExpression(range);
    };
    Node.createTemplateLiteralExpression = function (tag, parts, rawParts, expressions, range) {
        return new TemplateLiteralExpression(tag, parts, rawParts, expressions, range);
    };
    Node.createThisExpression = function (range) {
        return new ThisExpression(range);
    };
    Node.createTrueExpression = function (range) {
        return new TrueExpression(range);
    };
    Node.createUnaryPostfixExpression = function (operator, operand, range) {
        return new UnaryPostfixExpression(operator, operand, range);
    };
    Node.createUnaryPrefixExpression = function (operator, operand, range) {
        return new UnaryPrefixExpression(operator, operand, range);
    };
    Node.createCompiledExpression = function (expr, type, range) {
        return new CompiledExpression(expr, type, range);
    };
    // statements
    Node.createBlockStatement = function (statements, range) {
        return new BlockStatement(statements, range);
    };
    Node.createBreakStatement = function (label, range) {
        return new BreakStatement(label, range);
    };
    Node.createClassDeclaration = function (name, decorators, flags, typeParameters, extendsType, implementsTypes, members, range) {
        return new ClassDeclaration(name, decorators, flags, typeParameters, extendsType, implementsTypes, members, range);
    };
    Node.createContinueStatement = function (label, range) {
        return new ContinueStatement(label, range);
    };
    Node.createDoStatement = function (body, condition, range) {
        return new DoStatement(body, condition, range);
    };
    Node.createEmptyStatement = function (range) {
        return new EmptyStatement(range);
    };
    Node.createEnumDeclaration = function (name, decorators, flags, values, range) {
        return new EnumDeclaration(name, decorators, flags, values, range);
    };
    Node.createEnumValueDeclaration = function (name, flags, initializer, range) {
        return new EnumValueDeclaration(name, flags, initializer, range);
    };
    Node.createExportStatement = function (members, path, isDeclare, range) {
        return new ExportStatement(members, path, isDeclare, range);
    };
    Node.createExportDefaultStatement = function (declaration, range) {
        return new ExportDefaultStatement(declaration, range);
    };
    Node.createExportImportStatement = function (name, externalName, range) {
        return new ExportImportStatement(name, externalName, range);
    };
    Node.createExportMember = function (localName, exportedName, range) {
        if (!exportedName)
            exportedName = localName;
        return new ExportMember(localName, exportedName, range);
    };
    Node.createExpressionStatement = function (expression) {
        return new ExpressionStatement(expression);
    };
    Node.createIfStatement = function (condition, ifTrue, ifFalse, range) {
        return new IfStatement(condition, ifTrue, ifFalse, range);
    };
    Node.createImportStatement = function (declarations, path, range) {
        return new ImportStatement(declarations, null, path, range);
    };
    Node.createWildcardImportStatement = function (namespaceName, path, range) {
        return new ImportStatement(null, namespaceName, path, range);
    };
    Node.createImportDeclaration = function (foreignName, name, range) {
        if (!name)
            name = foreignName;
        return new ImportDeclaration(name, foreignName, range);
    };
    Node.createInterfaceDeclaration = function (name, decorators, flags, typeParameters, extendsType, implementsTypes, members, range) {
        return new InterfaceDeclaration(name, decorators, flags, typeParameters, extendsType, implementsTypes, members, range);
    };
    Node.createFieldDeclaration = function (name, decorators, flags, type, initializer, range) {
        return new FieldDeclaration(name, decorators, flags, type, initializer, -1, range);
    };
    Node.createForStatement = function (initializer, condition, incrementor, body, range) {
        return new ForStatement(initializer, condition, incrementor, body, range);
    };
    Node.createForOfStatement = function (variable, iterable, body, range) {
        return new ForOfStatement(variable, iterable, body, range);
    };
    Node.createFunctionDeclaration = function (name, decorators, flags, typeParameters, signature, body, arrowKind, range) {
        return new FunctionDeclaration(name, decorators, flags, typeParameters, signature, body, arrowKind, range);
    };
    Node.createIndexSignature = function (keyType, valueType, flags, range) {
        return new IndexSignatureNode(keyType, valueType, flags, range);
    };
    Node.createMethodDeclaration = function (name, decorators, flags, typeParameters, signature, body, range) {
        return new MethodDeclaration(name, decorators, flags, typeParameters, signature, body, range);
    };
    Node.createNamespaceDeclaration = function (name, decorators, flags, members, range) {
        return new NamespaceDeclaration(name, decorators, flags, members, range);
    };
    Node.createReturnStatement = function (value, range) {
        return new ReturnStatement(value, range);
    };
    Node.createSwitchStatement = function (condition, cases, range) {
        return new SwitchStatement(condition, cases, range);
    };
    Node.createSwitchCase = function (label, statements, range) {
        return new SwitchCase(label, statements, range);
    };
    Node.createThrowStatement = function (value, range) {
        return new ThrowStatement(value, range);
    };
    Node.createTryStatement = function (bodyStatements, catchVariable, catchStatements, finallyStatements, range) {
        return new TryStatement(bodyStatements, catchVariable, catchStatements, finallyStatements, range);
    };
    Node.createTypeDeclaration = function (name, decorators, flags, typeParameters, type, range) {
        return new TypeDeclaration(name, decorators, flags, typeParameters, type, range);
    };
    Node.createModuleDeclaration = function (name, flags, range) {
        return new ModuleDeclaration(name, flags, range);
    };
    Node.createVariableStatement = function (decorators, declarations, range) {
        return new VariableStatement(decorators, declarations, range);
    };
    Node.createVariableDeclaration = function (name, decorators, flags, type, initializer, range) {
        return new VariableDeclaration(name, decorators, flags, type, initializer, range);
    };
    Node.createVoidStatement = function (expression, range) {
        return new VoidStatement(expression, range);
    };
    Node.createWhileStatement = function (condition, statement, range) {
        return new WhileStatement(condition, statement, range);
    };
    /** Tests if this node is a literal of the specified kind. */
    Node.prototype.isLiteralKind = function (literalKind) {
        return this.kind == 16 /* NodeKind.Literal */
            && changetype(this).literalKind == literalKind; // TS
    };
    Object.defineProperty(Node.prototype, "isNumericLiteral", {
        /** Tests if this node is a literal of a numeric kind (float or integer). */
        get: function () {
            if (this.kind == 16 /* NodeKind.Literal */) {
                switch (changetype(this).literalKind) { // TS
                    case 0 /* LiteralKind.Float */:
                    case 1 /* LiteralKind.Integer */: return true;
                }
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "compilesToConst", {
        /** Tests whether this node is guaranteed to compile to a constant value. */
        get: function () {
            switch (this.kind) {
                case 16 /* NodeKind.Literal */: {
                    switch (changetype(this).literalKind) { // TS
                        case 0 /* LiteralKind.Float */:
                        case 1 /* LiteralKind.Integer */:
                        case 2 /* LiteralKind.String */: return true;
                    }
                    break;
                }
                case 18 /* NodeKind.Null */:
                case 25 /* NodeKind.True */:
                case 13 /* NodeKind.False */: return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype.isAccessOn = function (kind) {
        var node = changetype(this);
        if (node.kind == 9 /* NodeKind.Call */) {
            node = node.expression;
        }
        if (node.kind == 21 /* NodeKind.PropertyAccess */) {
            var target = node.expression;
            if (target.kind == kind)
                return true;
        }
        return false;
    };
    Object.defineProperty(Node.prototype, "isAccessOnThis", {
        /** Checks if this node accesses a method or property on `this`. */
        get: function () {
            return this.isAccessOn(24 /* NodeKind.This */);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "isAccessOnSuper", {
        /** Checks if this node accesses a method or property on `super`. */
        get: function () {
            return this.isAccessOn(23 /* NodeKind.Super */);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "isEmpty", {
        get: function () {
            return this.kind == 34 /* NodeKind.Empty */;
        },
        enumerable: false,
        configurable: true
    });
    return Node;
}());
exports.Node = Node;
// types
var TypeNode = /** @class */ (function (_super) {
    __extends(TypeNode, _super);
    function TypeNode(
    /** Kind of the type node. */
    kind, 
    /** Whether nullable or not. */
    isNullable, 
    /** Source range. */
    range) {
        var _this = _super.call(this, kind, range) || this;
        _this.isNullable = isNullable;
        return _this;
    }
    /** Tests if this type has a generic component matching one of the given type parameters. */
    TypeNode.prototype.hasGenericComponent = function (typeParameterNodes) {
        if (this.kind == 1 /* NodeKind.NamedType */) {
            var namedTypeNode = changetype(this); // TS
            if (!namedTypeNode.name.next) {
                var typeArgumentNodes = namedTypeNode.typeArguments;
                if (typeArgumentNodes && typeArgumentNodes.length > 0) {
                    for (var i = 0, k = typeArgumentNodes.length; i < k; ++i) {
                        if (typeArgumentNodes[i].hasGenericComponent(typeParameterNodes))
                            return true;
                    }
                }
                else {
                    var name_1 = namedTypeNode.name.identifier.text;
                    for (var i = 0, k = typeParameterNodes.length; i < k; ++i) {
                        if (typeParameterNodes[i].name.text == name_1)
                            return true;
                    }
                }
            }
        }
        else if (this.kind == 2 /* NodeKind.FunctionType */) {
            var functionTypeNode = changetype(this); // TS
            var parameterNodes = functionTypeNode.parameters;
            for (var i = 0, k = parameterNodes.length; i < k; ++i) {
                if (parameterNodes[i].type.hasGenericComponent(typeParameterNodes))
                    return true;
            }
            if (functionTypeNode.returnType.hasGenericComponent(typeParameterNodes))
                return true;
            var explicitThisType = functionTypeNode.explicitThisType;
            if (explicitThisType && explicitThisType.hasGenericComponent(typeParameterNodes))
                return true;
        }
        else {
            assert(false);
        }
        return false;
    };
    return TypeNode;
}(Node));
exports.TypeNode = TypeNode;
/** Represents a type name. */
var TypeName = /** @class */ (function (_super) {
    __extends(TypeName, _super);
    function TypeName(
    /** Identifier of this part. */
    identifier, 
    /** Next part of the type name or `null` if this is the last part. */
    next, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 3 /* NodeKind.TypeName */, range) || this;
        _this.identifier = identifier;
        _this.next = next;
        return _this;
    }
    return TypeName;
}(Node));
exports.TypeName = TypeName;
/** Represents a named type. */
var NamedTypeNode = /** @class */ (function (_super) {
    __extends(NamedTypeNode, _super);
    function NamedTypeNode(
    /** Type name. */
    name, 
    /** Type argument references. */
    typeArguments, 
    /** Whether nullable or not. */
    isNullable, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 1 /* NodeKind.NamedType */, isNullable, range) || this;
        _this.name = name;
        _this.typeArguments = typeArguments;
        return _this;
    }
    Object.defineProperty(NamedTypeNode.prototype, "hasTypeArguments", {
        /** Checks if this type node has type arguments. */
        get: function () {
            var typeArguments = this.typeArguments;
            return typeArguments != null && typeArguments.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    return NamedTypeNode;
}(TypeNode));
exports.NamedTypeNode = NamedTypeNode;
/** Represents a function type. */
var FunctionTypeNode = /** @class */ (function (_super) {
    __extends(FunctionTypeNode, _super);
    function FunctionTypeNode(
    /** Function parameters. */
    parameters, 
    /** Return type. */
    returnType, 
    /** Explicitly provided this type, if any. */
    explicitThisType, // can't be a function
    /** Whether nullable or not. */
    isNullable, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 2 /* NodeKind.FunctionType */, isNullable, range) || this;
        _this.parameters = parameters;
        _this.returnType = returnType;
        _this.explicitThisType = explicitThisType;
        return _this;
    }
    return FunctionTypeNode;
}(TypeNode));
exports.FunctionTypeNode = FunctionTypeNode;
/** Represents a type parameter. */
var TypeParameterNode = /** @class */ (function (_super) {
    __extends(TypeParameterNode, _super);
    function TypeParameterNode(
    /** Identifier reference. */
    name, 
    /** Extended type reference, if any. */
    extendsType, // can't be a function
    /** Default type if omitted, if any. */
    defaultType, // can't be a function
    /** Source range. */
    range) {
        var _this = _super.call(this, 4 /* NodeKind.TypeParameter */, range) || this;
        _this.name = name;
        _this.extendsType = extendsType;
        _this.defaultType = defaultType;
        return _this;
    }
    return TypeParameterNode;
}(Node));
exports.TypeParameterNode = TypeParameterNode;
/** Represents a function parameter. */
var ParameterNode = /** @class */ (function (_super) {
    __extends(ParameterNode, _super);
    function ParameterNode(
    /** Parameter kind. */
    parameterKind, 
    /** Parameter name. */
    name, 
    /** Parameter type. */
    type, 
    /** Initializer expression, if any. */
    initializer, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 5 /* NodeKind.Parameter */, range) || this;
        _this.parameterKind = parameterKind;
        _this.name = name;
        _this.type = type;
        _this.initializer = initializer;
        /** Implicit field declaration, if applicable. */
        _this.implicitFieldDeclaration = null;
        /** Common flags indicating specific traits. */
        _this.flags = common_1.CommonFlags.None;
        return _this;
    }
    /** Tests if this node has the specified flag or flags. */
    ParameterNode.prototype.is = function (flag) { return (this.flags & flag) == flag; };
    /** Tests if this node has one of the specified flags. */
    ParameterNode.prototype.isAny = function (flag) { return (this.flags & flag) != 0; };
    /** Sets a specific flag or flags. */
    ParameterNode.prototype.set = function (flag) { this.flags |= flag; };
    return ParameterNode;
}(Node));
exports.ParameterNode = ParameterNode;
// special
/** Built-in decorator kinds. */
var DecoratorKind;
(function (DecoratorKind) {
    DecoratorKind[DecoratorKind["Custom"] = 0] = "Custom";
    DecoratorKind[DecoratorKind["Global"] = 1] = "Global";
    DecoratorKind[DecoratorKind["Operator"] = 2] = "Operator";
    DecoratorKind[DecoratorKind["OperatorBinary"] = 3] = "OperatorBinary";
    DecoratorKind[DecoratorKind["OperatorPrefix"] = 4] = "OperatorPrefix";
    DecoratorKind[DecoratorKind["OperatorPostfix"] = 5] = "OperatorPostfix";
    DecoratorKind[DecoratorKind["Unmanaged"] = 6] = "Unmanaged";
    DecoratorKind[DecoratorKind["Final"] = 7] = "Final";
    DecoratorKind[DecoratorKind["Inline"] = 8] = "Inline";
    DecoratorKind[DecoratorKind["External"] = 9] = "External";
    DecoratorKind[DecoratorKind["ExternalJs"] = 10] = "ExternalJs";
    DecoratorKind[DecoratorKind["Builtin"] = 11] = "Builtin";
    DecoratorKind[DecoratorKind["Lazy"] = 12] = "Lazy";
    DecoratorKind[DecoratorKind["Unsafe"] = 13] = "Unsafe";
})(DecoratorKind = exports.DecoratorKind || (exports.DecoratorKind = {}));
(function (DecoratorKind) {
    /** Returns the kind of the specified decorator name node. Defaults to {@link DecoratorKind.CUSTOM}. */
    function fromNode(nameNode) {
        if (nameNode.kind == 6 /* NodeKind.Identifier */) {
            var nameStr = nameNode.text;
            assert(nameStr.length);
            switch (nameStr.charCodeAt(0)) {
                case 98 /* CharCode.b */: {
                    if (nameStr == "builtin")
                        return DecoratorKind.Builtin;
                    break;
                }
                case 101 /* CharCode.e */: {
                    if (nameStr == "external")
                        return DecoratorKind.External;
                    break;
                }
                case 102 /* CharCode.f */: {
                    if (nameStr == "final")
                        return DecoratorKind.Final;
                    break;
                }
                case 103 /* CharCode.g */: {
                    if (nameStr == "global")
                        return DecoratorKind.Global;
                    break;
                }
                case 105 /* CharCode.i */: {
                    if (nameStr == "inline")
                        return DecoratorKind.Inline;
                    break;
                }
                case 108 /* CharCode.l */: {
                    if (nameStr == "lazy")
                        return DecoratorKind.Lazy;
                    break;
                }
                case 111 /* CharCode.o */: {
                    if (nameStr == "operator")
                        return DecoratorKind.Operator;
                    break;
                }
                case 117 /* CharCode.u */: {
                    if (nameStr == "unmanaged")
                        return DecoratorKind.Unmanaged;
                    if (nameStr == "unsafe")
                        return DecoratorKind.Unsafe;
                    break;
                }
            }
        }
        else if (nameNode.kind == 21 /* NodeKind.PropertyAccess */) {
            var propertyAccessNode = nameNode;
            var expression = propertyAccessNode.expression;
            if (expression.kind == 6 /* NodeKind.Identifier */) {
                var nameStr = expression.text;
                assert(nameStr.length);
                var propStr = propertyAccessNode.property.text;
                assert(propStr.length);
                if (nameStr == "operator") {
                    switch (propStr.charCodeAt(0)) {
                        case 98 /* CharCode.b */: {
                            if (propStr == "binary")
                                return DecoratorKind.OperatorBinary;
                            break;
                        }
                        case 112 /* CharCode.p */: {
                            if (propStr == "prefix")
                                return DecoratorKind.OperatorPrefix;
                            if (propStr == "postfix")
                                return DecoratorKind.OperatorPostfix;
                            break;
                        }
                    }
                }
                else if (nameStr == "external") {
                    switch (propStr.charCodeAt(0)) {
                        case 106 /* CharCode.j */: {
                            if (propStr == "js")
                                return DecoratorKind.ExternalJs;
                            break;
                        }
                    }
                }
            }
        }
        return DecoratorKind.Custom;
    }
    DecoratorKind.fromNode = fromNode;
})(DecoratorKind = exports.DecoratorKind || (exports.DecoratorKind = {}));
/** Represents a decorator. */
var DecoratorNode = /** @class */ (function (_super) {
    __extends(DecoratorNode, _super);
    function DecoratorNode(
    /** Built-in decorator kind, or custom. */
    decoratorKind, 
    /** Name expression. */
    name, 
    /** Argument expressions. */
    args, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 62 /* NodeKind.Decorator */, range) || this;
        _this.decoratorKind = decoratorKind;
        _this.name = name;
        _this.args = args;
        return _this;
    }
    return DecoratorNode;
}(Node));
exports.DecoratorNode = DecoratorNode;
/** Represents a comment. */
var CommentNode = /** @class */ (function (_super) {
    __extends(CommentNode, _super);
    function CommentNode(
    /** Comment kind. */
    commentKind, 
    /** Comment text. */
    text, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 66 /* NodeKind.Comment */, range) || this;
        _this.commentKind = commentKind;
        _this.text = text;
        return _this;
    }
    return CommentNode;
}(Node));
exports.CommentNode = CommentNode;
// expressions
/** Base class of all expression nodes. */
var Expression = /** @class */ (function (_super) {
    __extends(Expression, _super);
    function Expression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Expression;
}(Node));
exports.Expression = Expression;
/** Represents an identifier expression. */
var IdentifierExpression = /** @class */ (function (_super) {
    __extends(IdentifierExpression, _super);
    function IdentifierExpression(
    /** Textual name. */
    text, 
    /** Whether quoted or not. */
    isQuoted, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 6 /* NodeKind.Identifier */, range) || this;
        _this.text = text;
        _this.isQuoted = isQuoted;
        return _this;
    }
    return IdentifierExpression;
}(Expression));
exports.IdentifierExpression = IdentifierExpression;
/** Base class of all literal expressions. */
var LiteralExpression = /** @class */ (function (_super) {
    __extends(LiteralExpression, _super);
    function LiteralExpression(
    /** Specific literal kind. */
    literalKind, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 16 /* NodeKind.Literal */, range) || this;
        _this.literalKind = literalKind;
        return _this;
    }
    return LiteralExpression;
}(Expression));
exports.LiteralExpression = LiteralExpression;
/** Represents an `[]` literal expression. */
var ArrayLiteralExpression = /** @class */ (function (_super) {
    __extends(ArrayLiteralExpression, _super);
    function ArrayLiteralExpression(
    /** Nested element expressions. */
    elementExpressions, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 5 /* LiteralKind.Array */, range) || this;
        _this.elementExpressions = elementExpressions;
        return _this;
    }
    return ArrayLiteralExpression;
}(LiteralExpression));
exports.ArrayLiteralExpression = ArrayLiteralExpression;
/** Represents an assertion expression. */
var AssertionExpression = /** @class */ (function (_super) {
    __extends(AssertionExpression, _super);
    function AssertionExpression(
    /** Specific kind of this assertion. */
    assertionKind, 
    /** Expression being asserted. */
    expression, 
    /** Target type, if applicable. */
    toType, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 7 /* NodeKind.Assertion */, range) || this;
        _this.assertionKind = assertionKind;
        _this.expression = expression;
        _this.toType = toType;
        return _this;
    }
    return AssertionExpression;
}(Expression));
exports.AssertionExpression = AssertionExpression;
/** Represents a binary expression. */
var BinaryExpression = /** @class */ (function (_super) {
    __extends(BinaryExpression, _super);
    function BinaryExpression(
    /** Operator token. */
    operator, 
    /** Left-hand side expression */
    left, 
    /** Right-hand side expression. */
    right, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 8 /* NodeKind.Binary */, range) || this;
        _this.operator = operator;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    return BinaryExpression;
}(Expression));
exports.BinaryExpression = BinaryExpression;
/** Represents a call expression. */
var CallExpression = /** @class */ (function (_super) {
    __extends(CallExpression, _super);
    function CallExpression(
    /** Called expression. Usually an identifier or property access expression. */
    expression, 
    /** Provided type arguments. */
    typeArguments, 
    /** Provided arguments. */
    args, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 9 /* NodeKind.Call */, range) || this;
        _this.expression = expression;
        _this.typeArguments = typeArguments;
        _this.args = args;
        return _this;
    }
    Object.defineProperty(CallExpression.prototype, "typeArgumentsRange", {
        /** Gets the type arguments range for reporting. */
        get: function () {
            var typeArguments = this.typeArguments;
            var numTypeArguments;
            if (typeArguments) {
                if (numTypeArguments = typeArguments.length) {
                    return diagnostics_1.Range.join(typeArguments[0].range, typeArguments[numTypeArguments - 1].range);
                }
            }
            return this.expression.range;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CallExpression.prototype, "argumentsRange", {
        /** Gets the arguments range for reporting. */
        get: function () {
            var args = this.args;
            var numArguments = args.length;
            if (numArguments) {
                return diagnostics_1.Range.join(args[0].range, args[numArguments - 1].range);
            }
            return this.expression.range;
        },
        enumerable: false,
        configurable: true
    });
    return CallExpression;
}(Expression));
exports.CallExpression = CallExpression;
/** Represents a class expression using the 'class' keyword. */
var ClassExpression = /** @class */ (function (_super) {
    __extends(ClassExpression, _super);
    function ClassExpression(
    /** Inline class declaration. */
    declaration) {
        var _this = _super.call(this, 10 /* NodeKind.Class */, declaration.range) || this;
        _this.declaration = declaration;
        return _this;
    }
    return ClassExpression;
}(Expression));
exports.ClassExpression = ClassExpression;
/** Represents a comma expression composed of multiple expressions. */
var CommaExpression = /** @class */ (function (_super) {
    __extends(CommaExpression, _super);
    function CommaExpression(
    /** Sequential expressions. */
    expressions, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 11 /* NodeKind.Comma */, range) || this;
        _this.expressions = expressions;
        return _this;
    }
    return CommaExpression;
}(Expression));
exports.CommaExpression = CommaExpression;
/** Represents a `constructor` expression. */
var ConstructorExpression = /** @class */ (function (_super) {
    __extends(ConstructorExpression, _super);
    function ConstructorExpression(
    /** Source range. */
    range) {
        var _this = _super.call(this, "constructor", false, range) || this;
        _this.kind = 26 /* NodeKind.Constructor */;
        return _this;
    }
    return ConstructorExpression;
}(IdentifierExpression));
exports.ConstructorExpression = ConstructorExpression;
/** Represents an element access expression, e.g., array access. */
var ElementAccessExpression = /** @class */ (function (_super) {
    __extends(ElementAccessExpression, _super);
    function ElementAccessExpression(
    /** Expression being accessed. */
    expression, 
    /** Element of the expression being accessed. */
    elementExpression, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 12 /* NodeKind.ElementAccess */, range) || this;
        _this.expression = expression;
        _this.elementExpression = elementExpression;
        return _this;
    }
    return ElementAccessExpression;
}(Expression));
exports.ElementAccessExpression = ElementAccessExpression;
/** Represents a float literal expression. */
var FloatLiteralExpression = /** @class */ (function (_super) {
    __extends(FloatLiteralExpression, _super);
    function FloatLiteralExpression(
    /** Float value. */
    value, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 0 /* LiteralKind.Float */, range) || this;
        _this.value = value;
        return _this;
    }
    return FloatLiteralExpression;
}(LiteralExpression));
exports.FloatLiteralExpression = FloatLiteralExpression;
/** Represents a function expression using the 'function' keyword. */
var FunctionExpression = /** @class */ (function (_super) {
    __extends(FunctionExpression, _super);
    function FunctionExpression(
    /** Inline function declaration. */
    declaration) {
        var _this = _super.call(this, 14 /* NodeKind.Function */, declaration.range) || this;
        _this.declaration = declaration;
        return _this;
    }
    return FunctionExpression;
}(Expression));
exports.FunctionExpression = FunctionExpression;
/** Represents an `instanceof` expression. */
var InstanceOfExpression = /** @class */ (function (_super) {
    __extends(InstanceOfExpression, _super);
    function InstanceOfExpression(
    /** Expression being asserted. */
    expression, 
    /** Type to test for. */
    isType, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 15 /* NodeKind.InstanceOf */, range) || this;
        _this.expression = expression;
        _this.isType = isType;
        return _this;
    }
    return InstanceOfExpression;
}(Expression));
exports.InstanceOfExpression = InstanceOfExpression;
/** Represents an integer literal expression. */
var IntegerLiteralExpression = /** @class */ (function (_super) {
    __extends(IntegerLiteralExpression, _super);
    function IntegerLiteralExpression(
    /** Integer value. */
    value, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 1 /* LiteralKind.Integer */, range) || this;
        _this.value = value;
        return _this;
    }
    return IntegerLiteralExpression;
}(LiteralExpression));
exports.IntegerLiteralExpression = IntegerLiteralExpression;
/** Represents a `new` expression. Like a call but with its own kind. */
var NewExpression = /** @class */ (function (_super) {
    __extends(NewExpression, _super);
    function NewExpression(
    /** Type being constructed. */
    typeName, 
    /** Provided type arguments. */
    typeArguments, 
    /** Provided arguments. */
    args, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 17 /* NodeKind.New */, range) || this;
        _this.typeName = typeName;
        _this.typeArguments = typeArguments;
        _this.args = args;
        return _this;
    }
    Object.defineProperty(NewExpression.prototype, "typeArgumentsRange", {
        /** Gets the type arguments range for reporting. */
        get: function () {
            var typeArguments = this.typeArguments;
            var numTypeArguments;
            if (typeArguments && (numTypeArguments = typeArguments.length) > 0) {
                return diagnostics_1.Range.join(typeArguments[0].range, typeArguments[numTypeArguments - 1].range);
            }
            return this.typeName.range;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NewExpression.prototype, "argumentsRange", {
        /** Gets the arguments range for reporting. */
        get: function () {
            var args = this.args;
            var numArguments = args.length;
            if (numArguments) {
                return diagnostics_1.Range.join(args[0].range, args[numArguments - 1].range);
            }
            return this.typeName.range;
        },
        enumerable: false,
        configurable: true
    });
    return NewExpression;
}(Expression));
exports.NewExpression = NewExpression;
/** Represents a `null` expression. */
var NullExpression = /** @class */ (function (_super) {
    __extends(NullExpression, _super);
    function NullExpression(
    /** Source range. */
    range) {
        var _this = _super.call(this, "null", false, range) || this;
        _this.kind = 18 /* NodeKind.Null */;
        return _this;
    }
    return NullExpression;
}(IdentifierExpression));
exports.NullExpression = NullExpression;
/** Represents an object literal expression. */
var ObjectLiteralExpression = /** @class */ (function (_super) {
    __extends(ObjectLiteralExpression, _super);
    function ObjectLiteralExpression(
    /** Field names. */
    names, 
    /** Field values. */
    values, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 6 /* LiteralKind.Object */, range) || this;
        _this.names = names;
        _this.values = values;
        return _this;
    }
    return ObjectLiteralExpression;
}(LiteralExpression));
exports.ObjectLiteralExpression = ObjectLiteralExpression;
/** Represents an omitted expression, e.g. within an array literal. */
var OmittedExpression = /** @class */ (function (_super) {
    __extends(OmittedExpression, _super);
    function OmittedExpression(
    /** Source range. */
    range) {
        return _super.call(this, 19 /* NodeKind.Omitted */, range) || this;
    }
    return OmittedExpression;
}(Expression));
exports.OmittedExpression = OmittedExpression;
/** Represents a parenthesized expression. */
var ParenthesizedExpression = /** @class */ (function (_super) {
    __extends(ParenthesizedExpression, _super);
    function ParenthesizedExpression(
    /** Expression in parenthesis. */
    expression, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 20 /* NodeKind.Parenthesized */, range) || this;
        _this.expression = expression;
        return _this;
    }
    return ParenthesizedExpression;
}(Expression));
exports.ParenthesizedExpression = ParenthesizedExpression;
/** Represents a property access expression. */
var PropertyAccessExpression = /** @class */ (function (_super) {
    __extends(PropertyAccessExpression, _super);
    function PropertyAccessExpression(
    /** Expression being accessed. */
    expression, 
    /** Property of the expression being accessed. */
    property, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 21 /* NodeKind.PropertyAccess */, range) || this;
        _this.expression = expression;
        _this.property = property;
        return _this;
    }
    return PropertyAccessExpression;
}(Expression));
exports.PropertyAccessExpression = PropertyAccessExpression;
/** Represents a regular expression literal expression. */
var RegexpLiteralExpression = /** @class */ (function (_super) {
    __extends(RegexpLiteralExpression, _super);
    function RegexpLiteralExpression(
    /** Regular expression pattern. */
    pattern, 
    /** Regular expression flags. */
    patternFlags, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 4 /* LiteralKind.RegExp */, range) || this;
        _this.pattern = pattern;
        _this.patternFlags = patternFlags;
        return _this;
    }
    return RegexpLiteralExpression;
}(LiteralExpression));
exports.RegexpLiteralExpression = RegexpLiteralExpression;
/** Represents a ternary expression, i.e., short if notation. */
var TernaryExpression = /** @class */ (function (_super) {
    __extends(TernaryExpression, _super);
    function TernaryExpression(
    /** Condition expression. */
    condition, 
    /** Expression executed when condition is `true`. */
    ifThen, 
    /** Expression executed when condition is `false`. */
    ifElse, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 22 /* NodeKind.Ternary */, range) || this;
        _this.condition = condition;
        _this.ifThen = ifThen;
        _this.ifElse = ifElse;
        return _this;
    }
    return TernaryExpression;
}(Expression));
exports.TernaryExpression = TernaryExpression;
/** Represents a string literal expression. */
var StringLiteralExpression = /** @class */ (function (_super) {
    __extends(StringLiteralExpression, _super);
    function StringLiteralExpression(
    /** String value without quotes. */
    value, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 2 /* LiteralKind.String */, range) || this;
        _this.value = value;
        return _this;
    }
    return StringLiteralExpression;
}(LiteralExpression));
exports.StringLiteralExpression = StringLiteralExpression;
/** Represents a `super` expression. */
var SuperExpression = /** @class */ (function (_super) {
    __extends(SuperExpression, _super);
    function SuperExpression(
    /** Source range. */
    range) {
        var _this = _super.call(this, "super", false, range) || this;
        _this.kind = 23 /* NodeKind.Super */;
        return _this;
    }
    return SuperExpression;
}(IdentifierExpression));
exports.SuperExpression = SuperExpression;
/** Represents a template literal expression. */
var TemplateLiteralExpression = /** @class */ (function (_super) {
    __extends(TemplateLiteralExpression, _super);
    function TemplateLiteralExpression(
    /** Tag expression, if any. */
    tag, 
    /** String parts. */
    parts, 
    /** Raw string parts. */
    rawParts, 
    /** Expression parts. */
    expressions, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 3 /* LiteralKind.Template */, range) || this;
        _this.tag = tag;
        _this.parts = parts;
        _this.rawParts = rawParts;
        _this.expressions = expressions;
        return _this;
    }
    return TemplateLiteralExpression;
}(LiteralExpression));
exports.TemplateLiteralExpression = TemplateLiteralExpression;
/** Represents a `this` expression. */
var ThisExpression = /** @class */ (function (_super) {
    __extends(ThisExpression, _super);
    function ThisExpression(
    /** Source range. */
    range) {
        var _this = _super.call(this, "this", false, range) || this;
        _this.kind = 24 /* NodeKind.This */;
        return _this;
    }
    return ThisExpression;
}(IdentifierExpression));
exports.ThisExpression = ThisExpression;
/** Represents a `true` expression. */
var TrueExpression = /** @class */ (function (_super) {
    __extends(TrueExpression, _super);
    function TrueExpression(
    /** Source range. */
    range) {
        var _this = _super.call(this, "true", false, range) || this;
        _this.kind = 25 /* NodeKind.True */;
        return _this;
    }
    return TrueExpression;
}(IdentifierExpression));
exports.TrueExpression = TrueExpression;
/** Represents a `false` expression. */
var FalseExpression = /** @class */ (function (_super) {
    __extends(FalseExpression, _super);
    function FalseExpression(
    /** Source range. */
    range) {
        var _this = _super.call(this, "false", false, range) || this;
        _this.kind = 13 /* NodeKind.False */;
        return _this;
    }
    return FalseExpression;
}(IdentifierExpression));
exports.FalseExpression = FalseExpression;
/** Base class of all unary expressions. */
var UnaryExpression = /** @class */ (function (_super) {
    __extends(UnaryExpression, _super);
    function UnaryExpression(
    /** Unary expression kind. */
    kind, 
    /** Operator token. */
    operator, 
    /** Operand expression. */
    operand, 
    /** Source range. */
    range) {
        var _this = _super.call(this, kind, range) || this;
        _this.operator = operator;
        _this.operand = operand;
        return _this;
    }
    return UnaryExpression;
}(Expression));
exports.UnaryExpression = UnaryExpression;
/** Represents a unary postfix expression, e.g. a postfix increment. */
var UnaryPostfixExpression = /** @class */ (function (_super) {
    __extends(UnaryPostfixExpression, _super);
    function UnaryPostfixExpression(
    /** Operator token. */
    operator, 
    /** Operand expression. */
    operand, 
    /** Source range. */
    range) {
        return _super.call(this, 27 /* NodeKind.UnaryPostfix */, operator, operand, range) || this;
    }
    return UnaryPostfixExpression;
}(UnaryExpression));
exports.UnaryPostfixExpression = UnaryPostfixExpression;
/** Represents a unary prefix expression, e.g. a negation. */
var UnaryPrefixExpression = /** @class */ (function (_super) {
    __extends(UnaryPrefixExpression, _super);
    function UnaryPrefixExpression(
    /** Operator token. */
    operator, 
    /** Operand expression. */
    operand, 
    /** Source range. */
    range) {
        return _super.call(this, 28 /* NodeKind.UnaryPrefix */, operator, operand, range) || this;
    }
    return UnaryPrefixExpression;
}(UnaryExpression));
exports.UnaryPrefixExpression = UnaryPrefixExpression;
/** Represents a special pre-compiled expression. If the expression has side-effects, special care has to be taken. */
var CompiledExpression = /** @class */ (function (_super) {
    __extends(CompiledExpression, _super);
    function CompiledExpression(
    /** Compiled expression. */
    expr, 
    /** Type of the compiled expression. */
    type, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 29 /* NodeKind.Compiled */, range) || this;
        _this.expr = expr;
        _this.type = type;
        return _this;
    }
    return CompiledExpression;
}(Expression));
exports.CompiledExpression = CompiledExpression;
// statements
/** Base class of all statement nodes. */
var Statement = /** @class */ (function (_super) {
    __extends(Statement, _super);
    function Statement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Statement;
}(Node));
exports.Statement = Statement;
/** A top-level source node. */
var Source = /** @class */ (function (_super) {
    __extends(Source, _super);
    function Source(
    /** Source kind. */
    sourceKind, 
    /** Normalized path with file extension. */
    normalizedPath, 
    /** Full source text. */
    text) {
        var _this = _super.call(this, 0 /* NodeKind.Source */, new diagnostics_1.Range(0, text.length)) || this;
        _this.sourceKind = sourceKind;
        _this.normalizedPath = normalizedPath;
        _this.text = text;
        /** Contained statements. */
        _this.statements = new Array();
        /** Source map index. */
        _this.debugInfoIndex = -1;
        /** Re-exported sources. */
        _this.exportPaths = null;
        /** Cached line starts. */
        _this.lineCache = null;
        /** Remembered column number. */
        _this.lineColumn = 1;
        var internalPath = mangleInternalPath(normalizedPath);
        _this.internalPath = internalPath;
        var pos = internalPath.lastIndexOf(common_1.PATH_DELIMITER);
        _this.simplePath = pos >= 0 ? internalPath.substring(pos + 1) : internalPath;
        _this.range.source = _this;
        return _this;
    }
    Object.defineProperty(Source, "native", {
        /** Gets the special native source. */
        get: function () {
            var source = Source._native;
            if (!source)
                Source._native = source = new Source(3 /* SourceKind.LibraryEntry */, common_1.LIBRARY_PREFIX + "native.ts", "[native code]");
            return source;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "isNative", {
        /** Checks if this source represents native code. */
        get: function () {
            return this.internalPath == common_1.LIBRARY_SUBST;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "isLibrary", {
        /** Checks if this source is part of the (standard) library. */
        get: function () {
            var kind = this.sourceKind;
            return kind == 2 /* SourceKind.Library */ || kind == 3 /* SourceKind.LibraryEntry */;
        },
        enumerable: false,
        configurable: true
    });
    /** Determines the line number at the specified position. Starts at `1`. */
    Source.prototype.lineAt = function (pos) {
        assert(pos >= 0 && pos < 0x7fffffff);
        var lineCache = this.lineCache;
        if (!lineCache) {
            this.lineCache = lineCache = [0];
            var text = this.text;
            var off = 0;
            var end = text.length;
            while (off < end) {
                if (text.charCodeAt(off++) == 10 /* CharCode.LineFeed */)
                    lineCache.push(off);
            }
            lineCache.push(0x7fffffff);
        }
        var l = 0;
        var r = lineCache.length - 1;
        while (l < r) {
            var m = l + ((r - l) >> 1);
            var s = unchecked(lineCache[m]);
            if (pos < s)
                r = m;
            else if (pos < unchecked(lineCache[m + 1])) {
                this.lineColumn = pos - s + 1;
                return m + 1;
            }
            else
                l = m + 1;
        }
        return assert(0);
    };
    /** Gets the column number at the last position queried with `lineAt`. Starts at `1`. */
    Source.prototype.columnAt = function () {
        return this.lineColumn;
    };
    Source._native = null;
    return Source;
}(Node));
exports.Source = Source;
/** Base class of all declaration statements. */
var DeclarationStatement = /** @class */ (function (_super) {
    __extends(DeclarationStatement, _super);
    function DeclarationStatement(
    /** Declaration node kind. */
    kind, 
    /** Simple name being declared. */
    name, 
    /** Array of decorators, if any. */
    decorators, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Source range. */
    range) {
        var _this = _super.call(this, kind, range) || this;
        _this.name = name;
        _this.decorators = decorators;
        _this.flags = flags;
        /** Overridden module name from preceeding `module` statement. */
        _this.overriddenModuleName = null;
        return _this;
    }
    /** Tests if this node has the specified flag or flags. */
    DeclarationStatement.prototype.is = function (flag) { return (this.flags & flag) == flag; };
    /** Tests if this node has one of the specified flags. */
    DeclarationStatement.prototype.isAny = function (flag) { return (this.flags & flag) != 0; };
    /** Sets a specific flag or flags. */
    DeclarationStatement.prototype.set = function (flag) { this.flags |= flag; };
    return DeclarationStatement;
}(Statement));
exports.DeclarationStatement = DeclarationStatement;
/** Represents an index signature. */
var IndexSignatureNode = /** @class */ (function (_super) {
    __extends(IndexSignatureNode, _super);
    function IndexSignatureNode(
    /** Key type. */
    keyType, 
    /** Value type. */
    valueType, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 65 /* NodeKind.IndexSignature */, range) || this;
        _this.keyType = keyType;
        _this.valueType = valueType;
        _this.flags = flags;
        return _this;
    }
    return IndexSignatureNode;
}(Node));
exports.IndexSignatureNode = IndexSignatureNode;
/** Base class of all variable-like declaration statements. */
var VariableLikeDeclarationStatement = /** @class */ (function (_super) {
    __extends(VariableLikeDeclarationStatement, _super);
    function VariableLikeDeclarationStatement(
    /** Variable-like declaration node kind. */
    kind, 
    /** Simple name being declared. */
    name, 
    /** Array of decorators, if any. */
    decorators, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Annotated type node, if any. */
    type, 
    /** Initializer expression, if any. */
    initializer, 
    /** Source range. */
    range) {
        var _this = _super.call(this, kind, name, decorators, flags, range) || this;
        _this.type = type;
        _this.initializer = initializer;
        return _this;
    }
    return VariableLikeDeclarationStatement;
}(DeclarationStatement));
exports.VariableLikeDeclarationStatement = VariableLikeDeclarationStatement;
/** Represents a block statement. */
var BlockStatement = /** @class */ (function (_super) {
    __extends(BlockStatement, _super);
    function BlockStatement(
    /** Contained statements. */
    statements, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 30 /* NodeKind.Block */, range) || this;
        _this.statements = statements;
        return _this;
    }
    return BlockStatement;
}(Statement));
exports.BlockStatement = BlockStatement;
/** Represents a `break` statement. */
var BreakStatement = /** @class */ (function (_super) {
    __extends(BreakStatement, _super);
    function BreakStatement(
    /** Target label, if any. */
    label, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 31 /* NodeKind.Break */, range) || this;
        _this.label = label;
        return _this;
    }
    return BreakStatement;
}(Statement));
exports.BreakStatement = BreakStatement;
/** Represents a `class` declaration. */
var ClassDeclaration = /** @class */ (function (_super) {
    __extends(ClassDeclaration, _super);
    function ClassDeclaration(
    /** Simple name being declared. */
    name, 
    /** Array of decorators, if any. */
    decorators, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Accepted type parameters. */
    typeParameters, 
    /** Base class type being extended, if any. */
    extendsType, // can't be a function
    /** Interface types being implemented, if any. */
    implementsTypes, // can't be functions
    /** Class member declarations. */
    members, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 51 /* NodeKind.ClassDeclaration */, name, decorators, flags, range) || this;
        _this.typeParameters = typeParameters;
        _this.extendsType = extendsType;
        _this.implementsTypes = implementsTypes;
        _this.members = members;
        /** Index signature, if present. */
        _this.indexSignature = null;
        return _this;
    }
    Object.defineProperty(ClassDeclaration.prototype, "isGeneric", {
        get: function () {
            var typeParameters = this.typeParameters;
            return typeParameters != null && typeParameters.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    return ClassDeclaration;
}(DeclarationStatement));
exports.ClassDeclaration = ClassDeclaration;
/** Represents a `continue` statement. */
var ContinueStatement = /** @class */ (function (_super) {
    __extends(ContinueStatement, _super);
    function ContinueStatement(
    /** Target label, if applicable. */
    label, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 32 /* NodeKind.Continue */, range) || this;
        _this.label = label;
        return _this;
    }
    return ContinueStatement;
}(Statement));
exports.ContinueStatement = ContinueStatement;
/** Represents a `do` statement. */
var DoStatement = /** @class */ (function (_super) {
    __extends(DoStatement, _super);
    function DoStatement(
    /** Body statement being looped over. */
    body, 
    /** Condition when to repeat. */
    condition, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 33 /* NodeKind.Do */, range) || this;
        _this.body = body;
        _this.condition = condition;
        return _this;
    }
    return DoStatement;
}(Statement));
exports.DoStatement = DoStatement;
/** Represents an empty statement, i.e., a semicolon terminating nothing. */
var EmptyStatement = /** @class */ (function (_super) {
    __extends(EmptyStatement, _super);
    function EmptyStatement(
    /** Source range. */
    range) {
        return _super.call(this, 34 /* NodeKind.Empty */, range) || this;
    }
    return EmptyStatement;
}(Statement));
exports.EmptyStatement = EmptyStatement;
/** Represents an `enum` declaration. */
var EnumDeclaration = /** @class */ (function (_super) {
    __extends(EnumDeclaration, _super);
    function EnumDeclaration(
    /** Simple name being declared. */
    name, 
    /** Array of decorators, if any. */
    decorators, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Enum value declarations. */
    values, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 52 /* NodeKind.EnumDeclaration */, name, decorators, flags, range) || this;
        _this.values = values;
        return _this;
    }
    return EnumDeclaration;
}(DeclarationStatement));
exports.EnumDeclaration = EnumDeclaration;
/** Represents a value of an `enum` declaration. */
var EnumValueDeclaration = /** @class */ (function (_super) {
    __extends(EnumValueDeclaration, _super);
    function EnumValueDeclaration(
    /** Simple name being declared. */
    name, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Initializer expression, if any. */
    initializer, 
    /** Source range. */
    range) {
        return _super.call(this, 53 /* NodeKind.EnumValueDeclaration */, name, null, flags, null, initializer, range) || this;
    }
    return EnumValueDeclaration;
}(VariableLikeDeclarationStatement));
exports.EnumValueDeclaration = EnumValueDeclaration;
/** Represents an `export import` statement of an interface. */
var ExportImportStatement = /** @class */ (function (_super) {
    __extends(ExportImportStatement, _super);
    function ExportImportStatement(
    /** Identifier being imported. */
    name, 
    /** Identifier being exported. */
    externalName, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 37 /* NodeKind.ExportImport */, range) || this;
        _this.name = name;
        _this.externalName = externalName;
        return _this;
    }
    return ExportImportStatement;
}(Statement));
exports.ExportImportStatement = ExportImportStatement;
/** Represents a member of an `export` statement. */
var ExportMember = /** @class */ (function (_super) {
    __extends(ExportMember, _super);
    function ExportMember(
    /** Local identifier. */
    localName, 
    /** Exported identifier. */
    exportedName, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 63 /* NodeKind.ExportMember */, range) || this;
        _this.localName = localName;
        _this.exportedName = exportedName;
        return _this;
    }
    return ExportMember;
}(Node));
exports.ExportMember = ExportMember;
/** Represents an `export` statement. */
var ExportStatement = /** @class */ (function (_super) {
    __extends(ExportStatement, _super);
    function ExportStatement(
    /** Array of members if a set of named exports, or `null` if a file export. */
    members, 
    /** Path being exported from, if applicable. */
    path, 
    /** Whether this is a declared export. */
    isDeclare, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 35 /* NodeKind.Export */, range) || this;
        _this.members = members;
        _this.path = path;
        _this.isDeclare = isDeclare;
        if (path) {
            var normalizedPath = (0, util_1.normalizePath)(path.value);
            if (path.value.startsWith(".")) { // relative
                normalizedPath = (0, util_1.resolvePath)(normalizedPath, range.source.internalPath);
            }
            else { // absolute
                if (!normalizedPath.startsWith(common_1.LIBRARY_PREFIX))
                    normalizedPath = common_1.LIBRARY_PREFIX + normalizedPath;
            }
            _this.internalPath = normalizedPath;
        }
        else {
            _this.internalPath = null;
        }
        return _this;
    }
    return ExportStatement;
}(Statement));
exports.ExportStatement = ExportStatement;
/** Represents an `export default` statement. */
var ExportDefaultStatement = /** @class */ (function (_super) {
    __extends(ExportDefaultStatement, _super);
    function ExportDefaultStatement(
    /** Declaration being exported as default. */
    declaration, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 36 /* NodeKind.ExportDefault */, range) || this;
        _this.declaration = declaration;
        return _this;
    }
    return ExportDefaultStatement;
}(Statement));
exports.ExportDefaultStatement = ExportDefaultStatement;
/** Represents an expression that is used as a statement. */
var ExpressionStatement = /** @class */ (function (_super) {
    __extends(ExpressionStatement, _super);
    function ExpressionStatement(
    /** Expression being used as a statement.*/
    expression) {
        var _this = _super.call(this, 38 /* NodeKind.Expression */, expression.range) || this;
        _this.expression = expression;
        return _this;
    }
    return ExpressionStatement;
}(Statement));
exports.ExpressionStatement = ExpressionStatement;
/** Represents a field declaration within a `class`. */
var FieldDeclaration = /** @class */ (function (_super) {
    __extends(FieldDeclaration, _super);
    function FieldDeclaration(
    /** Simple name being declared. */
    name, 
    /** Array of decorators, if any. */
    decorators, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Annotated type node, if any. */
    type, 
    /** Initializer expression, if any. */
    initializer, 
    /** Parameter index if declared as a constructor parameter, otherwise `-1`. */
    parameterIndex, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 54 /* NodeKind.FieldDeclaration */, name, decorators, flags, type, initializer, range) || this;
        _this.parameterIndex = parameterIndex;
        return _this;
    }
    return FieldDeclaration;
}(VariableLikeDeclarationStatement));
exports.FieldDeclaration = FieldDeclaration;
/** Represents a `for` statement. */
var ForStatement = /** @class */ (function (_super) {
    __extends(ForStatement, _super);
    function ForStatement(
    /** Initializer statement, if present. Either a `VariableStatement` or `ExpressionStatement`. */
    initializer, 
    /** Condition expression, if present. */
    condition, 
    /** Incrementor expression, if present. */
    incrementor, 
    /** Body statement being looped over. */
    body, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 39 /* NodeKind.For */, range) || this;
        _this.initializer = initializer;
        _this.condition = condition;
        _this.incrementor = incrementor;
        _this.body = body;
        return _this;
    }
    return ForStatement;
}(Statement));
exports.ForStatement = ForStatement;
/** Represents a `for..of` statement. */
var ForOfStatement = /** @class */ (function (_super) {
    __extends(ForOfStatement, _super);
    function ForOfStatement(
    /** Variable statement. Either a `VariableStatement` or `ExpressionStatement` of `IdentifierExpression`. */
    variable, 
    /** Iterable expression being iterated. */
    iterable, 
    /** Body statement being looped over. */
    body, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 40 /* NodeKind.ForOf */, range) || this;
        _this.variable = variable;
        _this.iterable = iterable;
        _this.body = body;
        return _this;
    }
    return ForOfStatement;
}(Statement));
exports.ForOfStatement = ForOfStatement;
/** Represents a `function` declaration. */
var FunctionDeclaration = /** @class */ (function (_super) {
    __extends(FunctionDeclaration, _super);
    function FunctionDeclaration(
    /** Simple name being declared. */
    name, 
    /** Array of decorators, if any. */
    decorators, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Type parameters, if any. */
    typeParameters, 
    /** Function signature. */
    signature, 
    /** Body statement. Usually a block. */
    body, 
    /** Arrow function kind, if applicable. */
    arrowKind, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 55 /* NodeKind.FunctionDeclaration */, name, decorators, flags, range) || this;
        _this.typeParameters = typeParameters;
        _this.signature = signature;
        _this.body = body;
        _this.arrowKind = arrowKind;
        return _this;
    }
    Object.defineProperty(FunctionDeclaration.prototype, "isGeneric", {
        /** Gets if this function is generic. */
        get: function () {
            var typeParameters = this.typeParameters;
            return typeParameters != null && typeParameters.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    /** Clones this function declaration. */
    FunctionDeclaration.prototype.clone = function () {
        return new FunctionDeclaration(this.name, this.decorators, this.flags, this.typeParameters, this.signature, this.body, this.arrowKind, this.range);
    };
    return FunctionDeclaration;
}(DeclarationStatement));
exports.FunctionDeclaration = FunctionDeclaration;
/** Represents an `if` statement. */
var IfStatement = /** @class */ (function (_super) {
    __extends(IfStatement, _super);
    function IfStatement(
    /** Condition. */
    condition, 
    /** Statement executed when condition is `true`. */
    ifTrue, 
    /** Statement executed when condition is `false`. */
    ifFalse, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 41 /* NodeKind.If */, range) || this;
        _this.condition = condition;
        _this.ifTrue = ifTrue;
        _this.ifFalse = ifFalse;
        return _this;
    }
    return IfStatement;
}(Statement));
exports.IfStatement = IfStatement;
/** Represents an `import` declaration part of an {@link ImportStatement}. */
var ImportDeclaration = /** @class */ (function (_super) {
    __extends(ImportDeclaration, _super);
    function ImportDeclaration(
    /** Simple name being declared. */
    name, 
    /** Identifier being imported. */
    foreignName, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 56 /* NodeKind.ImportDeclaration */, name, null, common_1.CommonFlags.None, range) || this;
        _this.foreignName = foreignName;
        return _this;
    }
    return ImportDeclaration;
}(DeclarationStatement));
exports.ImportDeclaration = ImportDeclaration;
/** Represents an `import` statement. */
var ImportStatement = /** @class */ (function (_super) {
    __extends(ImportStatement, _super);
    function ImportStatement(
    /** Array of member declarations or `null` if an asterisk import. */
    declarations, 
    /** Name of the local namespace, if an asterisk import. */
    namespaceName, 
    /** Path being imported from. */
    path, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 42 /* NodeKind.Import */, range) || this;
        _this.declarations = declarations;
        _this.namespaceName = namespaceName;
        _this.path = path;
        var normalizedPath = (0, util_1.normalizePath)(path.value);
        if (path.value.startsWith(".")) { // relative in project
            normalizedPath = (0, util_1.resolvePath)(normalizedPath, range.source.internalPath);
        }
        else { // absolute in library
            if (!normalizedPath.startsWith(common_1.LIBRARY_PREFIX))
                normalizedPath = common_1.LIBRARY_PREFIX + normalizedPath;
        }
        _this.internalPath = mangleInternalPath(normalizedPath);
        return _this;
    }
    return ImportStatement;
}(Statement));
exports.ImportStatement = ImportStatement;
/** Represents an `interfarce` declaration. */
var InterfaceDeclaration = /** @class */ (function (_super) {
    __extends(InterfaceDeclaration, _super);
    function InterfaceDeclaration(
    /** Simple name being declared. */
    name, 
    /** Array of decorators, if any. */
    decorators, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Accepted type parameters. */
    typeParameters, 
    /** Base class type being extended, if any. */
    extendsType, // can't be a function
    /** Interface types being implemented, if any. */
    implementsTypes, // can't be functions
    /** Class member declarations. */
    members, 
    /** Source range. */
    range) {
        var _this = _super.call(this, name, decorators, flags, typeParameters, extendsType, implementsTypes, members, range) || this;
        _this.kind = 57 /* NodeKind.InterfaceDeclaration */;
        return _this;
    }
    return InterfaceDeclaration;
}(ClassDeclaration));
exports.InterfaceDeclaration = InterfaceDeclaration;
/** Represents a method declaration within a `class`. */
var MethodDeclaration = /** @class */ (function (_super) {
    __extends(MethodDeclaration, _super);
    function MethodDeclaration(
    /** Simple name being declared. */
    name, 
    /** Array of decorators, if any. */
    decorators, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Type parameters, if any. */
    typeParameters, 
    /** Function signature. */
    signature, 
    /** Body statement. Usually a block. */
    body, 
    /** Source range. */
    range) {
        var _this = _super.call(this, name, decorators, flags, typeParameters, signature, body, 0 /* ArrowKind.None */, range) || this;
        _this.kind = 58 /* NodeKind.MethodDeclaration */;
        return _this;
    }
    return MethodDeclaration;
}(FunctionDeclaration));
exports.MethodDeclaration = MethodDeclaration;
/** Represents a `namespace` declaration. */
var NamespaceDeclaration = /** @class */ (function (_super) {
    __extends(NamespaceDeclaration, _super);
    function NamespaceDeclaration(
    /** Simple name being declared. */
    name, 
    /** Array of decorators, if any. */
    decorators, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Array of namespace members. */
    members, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 59 /* NodeKind.NamespaceDeclaration */, name, decorators, flags, range) || this;
        _this.members = members;
        return _this;
    }
    return NamespaceDeclaration;
}(DeclarationStatement));
exports.NamespaceDeclaration = NamespaceDeclaration;
/** Represents a `return` statement. */
var ReturnStatement = /** @class */ (function (_super) {
    __extends(ReturnStatement, _super);
    function ReturnStatement(
    /** Value expression being returned, if present. */
    value, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 43 /* NodeKind.Return */, range) || this;
        _this.value = value;
        return _this;
    }
    return ReturnStatement;
}(Statement));
exports.ReturnStatement = ReturnStatement;
/** Represents a single `case` within a `switch` statement. */
var SwitchCase = /** @class */ (function (_super) {
    __extends(SwitchCase, _super);
    function SwitchCase(
    /** Label expression. `null` indicates the default case. */
    label, 
    /** Contained statements. */
    statements, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 64 /* NodeKind.SwitchCase */, range) || this;
        _this.label = label;
        _this.statements = statements;
        return _this;
    }
    Object.defineProperty(SwitchCase.prototype, "isDefault", {
        get: function () {
            return this.label == null;
        },
        enumerable: false,
        configurable: true
    });
    return SwitchCase;
}(Node));
exports.SwitchCase = SwitchCase;
/** Represents a `switch` statement. */
var SwitchStatement = /** @class */ (function (_super) {
    __extends(SwitchStatement, _super);
    function SwitchStatement(
    /** Condition expression. */
    condition, 
    /** Contained cases. */
    cases, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 44 /* NodeKind.Switch */, range) || this;
        _this.condition = condition;
        _this.cases = cases;
        return _this;
    }
    return SwitchStatement;
}(Statement));
exports.SwitchStatement = SwitchStatement;
/** Represents a `throw` statement. */
var ThrowStatement = /** @class */ (function (_super) {
    __extends(ThrowStatement, _super);
    function ThrowStatement(
    /** Value expression being thrown. */
    value, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 45 /* NodeKind.Throw */, range) || this;
        _this.value = value;
        return _this;
    }
    return ThrowStatement;
}(Statement));
exports.ThrowStatement = ThrowStatement;
/** Represents a `try` statement. */
var TryStatement = /** @class */ (function (_super) {
    __extends(TryStatement, _super);
    function TryStatement(
    /** Contained statements. */
    bodyStatements, 
    /** Exception variable name, if a `catch` clause is present. */
    catchVariable, 
    /** Statements being executed on catch, if a `catch` clause is present. */
    catchStatements, 
    /** Statements being executed afterwards, if a `finally` clause is present. */
    finallyStatements, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 46 /* NodeKind.Try */, range) || this;
        _this.bodyStatements = bodyStatements;
        _this.catchVariable = catchVariable;
        _this.catchStatements = catchStatements;
        _this.finallyStatements = finallyStatements;
        return _this;
    }
    return TryStatement;
}(Statement));
exports.TryStatement = TryStatement;
/** Represents a `module` statement. */
var ModuleDeclaration = /** @class */ (function (_super) {
    __extends(ModuleDeclaration, _super);
    function ModuleDeclaration(
    /** Module name. */
    moduleName, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 50 /* NodeKind.Module */, range) || this;
        _this.moduleName = moduleName;
        _this.flags = flags;
        return _this;
    }
    return ModuleDeclaration;
}(Statement));
exports.ModuleDeclaration = ModuleDeclaration;
/** Represents a `type` declaration. */
var TypeDeclaration = /** @class */ (function (_super) {
    __extends(TypeDeclaration, _super);
    function TypeDeclaration(
    /** Simple name being declared. */
    name, 
    /** Array of decorators, if any. */
    decorators, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Type parameters, if any. */
    typeParameters, 
    /** Type being aliased. */
    type, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 60 /* NodeKind.TypeDeclaration */, name, decorators, flags, range) || this;
        _this.typeParameters = typeParameters;
        _this.type = type;
        return _this;
    }
    return TypeDeclaration;
}(DeclarationStatement));
exports.TypeDeclaration = TypeDeclaration;
/** Represents a variable declaration part of a {@link VariableStatement}. */
var VariableDeclaration = /** @class */ (function (_super) {
    __extends(VariableDeclaration, _super);
    function VariableDeclaration(
    /** Simple name being declared. */
    name, 
    /** Array of decorators, if any. */
    decorators, 
    /** Common flags indicating specific traits. */
    flags, 
    /** Annotated type node, if any. */
    type, 
    /** Initializer expression, if any. */
    initializer, 
    /** Source range. */
    range) {
        return _super.call(this, 61 /* NodeKind.VariableDeclaration */, name, decorators, flags, type, initializer, range) || this;
    }
    return VariableDeclaration;
}(VariableLikeDeclarationStatement));
exports.VariableDeclaration = VariableDeclaration;
/** Represents a variable statement wrapping {@link VariableDeclaration}s. */
var VariableStatement = /** @class */ (function (_super) {
    __extends(VariableStatement, _super);
    function VariableStatement(
    /** Array of decorators. */
    decorators, 
    /** Array of member declarations. */
    declarations, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 47 /* NodeKind.Variable */, range) || this;
        _this.decorators = decorators;
        _this.declarations = declarations;
        return _this;
    }
    return VariableStatement;
}(Statement));
exports.VariableStatement = VariableStatement;
/** Represents a void statement dropping an expression's value. */
var VoidStatement = /** @class */ (function (_super) {
    __extends(VoidStatement, _super);
    function VoidStatement(
    /** Expression being dropped. */
    expression, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 48 /* NodeKind.Void */, range) || this;
        _this.expression = expression;
        return _this;
    }
    return VoidStatement;
}(Statement));
exports.VoidStatement = VoidStatement;
/** Represents a `while` statement. */
var WhileStatement = /** @class */ (function (_super) {
    __extends(WhileStatement, _super);
    function WhileStatement(
    /** Condition expression. */
    condition, 
    /** Body statement being looped over. */
    body, 
    /** Source range. */
    range) {
        var _this = _super.call(this, 49 /* NodeKind.While */, range) || this;
        _this.condition = condition;
        _this.body = body;
        return _this;
    }
    return WhileStatement;
}(Statement));
exports.WhileStatement = WhileStatement;
/** Finds the first decorator matching the specified kind. */
function findDecorator(kind, decorators) {
    if (decorators) {
        for (var i = 0, k = decorators.length; i < k; ++i) {
            var decorator = decorators[i];
            if (decorator.decoratorKind == kind)
                return decorator;
        }
    }
    return null;
}
exports.findDecorator = findDecorator;
/** Mangles an external to an internal path. */
function mangleInternalPath(path) {
    if (path.endsWith("/")) {
        path += "index";
    }
    else if (path.endsWith(".ts")) {
        path = path.substring(0, path.length - 3);
    }
    return path;
}
exports.mangleInternalPath = mangleInternalPath;
/** Tests if the specified type node represents an omitted type. */
function isTypeOmitted(type) {
    if (type.kind == 1 /* NodeKind.NamedType */) {
        var name_2 = type.name;
        return !(name_2.next || name_2.identifier.text.length > 0);
    }
    return false;
}
exports.isTypeOmitted = isTypeOmitted;
