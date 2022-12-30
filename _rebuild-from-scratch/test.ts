// import './src/glue/js/index.ts';

import { Tokenizer, Token } from './src/tokenizer';
import { DecoratorNode, FunctionDeclaration, IdentifierExpression, NamespaceDeclaration, Node, Source, SourceKind, Statement } from './src/ast';
import { CharCode } from "./src/util";
import { DiagnosticCode, DiagnosticEmitter, DiagnosticMessage } from "./src/diagnostics";
import { CommonFlags } from './src/common';

// const CODE = `export func add(a: i32, b: i32): i32 { return a + b; }`;
const CODE = `export define Foo { }`;

class Parser extends DiagnosticEmitter {
  /** Constructs a new parser. */
  constructor(
    diagnostics: DiagnosticMessage[] | null = null,
    sources: Source[] = []
  ) {
    super(diagnostics);
    // this.sources = sources;
  }

  parseFile(
    /** Source text of the file, or `null` to indicate not found. */
    text: string | null,
    /** Normalized path of the file. */
    path: string,
    /** Whether this is an entry file. */
    isEntry: bool
  ) {
    if (text === null) {
      throw Error('not implemented');
    }

    let source = new Source(
      SourceKind.User,
      path,
      text,
    );

    let tn = new Tokenizer(source);
    let statements = source.statements;

    // const r = tn.skip(Token.At);
    // console.log('r: ', r);

    while (!tn.skip(Token.EndOfFile)) {
      let statement = this.parseTopLevelStatement(tn, null);
      if (statement) {
        statements.push(statement);
      } else {
        this.skipStatement(tn);
      }
    }
  }

  /** Parses a top-level statement. */
  parseTopLevelStatement(
    tn: Tokenizer,
    namespace: NamespaceDeclaration | null = null
  ): Statement | null {
    let flags = namespace ? namespace.flags & CommonFlags.Ambient : CommonFlags.None;
    let startPos = -1;

    // check decorators
    let decorators: DecoratorNode[] | null = null;
    // TODO
    // while (tn.skip(Token.At)) {
    //   if (startPos < 0) startPos = tn.tokenPos;
    //   let decorator = this.parseDecorator(tn);
    //   if (!decorator) {
    //     this.skipStatement(tn);
    //     continue;
    //   }
    //   if (!decorators) decorators = [decorator];
    //   else decorators.push(decorator);
    // }

    // check modifiers
    let exportStart = 0;
    let exportEnd = 0;
    let defaultStart = 0;
    let defaultEnd = 0;
    if (tn.skip(Token.Export)) {
      if (startPos < 0) startPos = tn.tokenPos;
      flags |= CommonFlags.Export;
      exportStart = tn.tokenPos;
      exportEnd = tn.pos;
      if (tn.skip(Token.Default)) {
        defaultStart = tn.tokenPos;
        defaultEnd = tn.pos;
      }
    }

    let declareStart = 0;
    let declareEnd = 0;
    let contextIsAmbient = namespace != null && namespace.is(CommonFlags.Ambient);
    if (tn.skip(Token.Declare)) {
      if (contextIsAmbient) {
        this.error(
          DiagnosticCode.A_declare_modifier_cannot_be_used_in_an_already_ambient_context,
          tn.range()
        ); // recoverable
      } else {
        if (startPos < 0) startPos = tn.tokenPos;
        declareStart = startPos;
        declareEnd = tn.pos;
        flags |= CommonFlags.Declare | CommonFlags.Ambient;
      }
    } else if (contextIsAmbient) {
      flags |= CommonFlags.Ambient;
    }

    // parse the statement
    let statement: Statement | null = null;

    // handle declarations
    let first = tn.peek();
    if (startPos < 0) startPos = tn.nextTokenPos;
    console.log('first', first);
    switch (first) {
      case Token.Func:
        tn.next();
        statement = this.parseFunction(tn, flags, decorators, startPos);
        decorators = null;
        break;
      case Token.Define:
      case Token.Interface: {
        tn.next();
        statement = this.parseDefineOrInterface(tn, flags, decorators, startPos);
        decorators = null;
        break;
      }
    }

    return null;
  }

  parseFunction(
    tn: Tokenizer,
    flags: CommonFlags,
    decorators: DecoratorNode[] | null,
    startPos: i32
  ): FunctionDeclaration | null {

    // at 'func':
    //  Identifier
    //  ('<' TypeParameters)?
    //  '(' Parameters (':' Type)?
    //  '{' Statement* '}'
    //  ';'?

    if (!tn.skipIdentifier()) {
      this.error(
        DiagnosticCode.Identifier_expected,
        tn.range(tn.pos)
      );
      return null;
    }

    let name = Node.createIdentifierExpression(tn.readIdentifier(), tn.range());
    let signatureStart = -1;

    console.log('name', name);

    return null;
  }

  parseDefineOrInterface(
    tn: Tokenizer,
    flags: CommonFlags,
    decorators: DecoratorNode[] | null,
    startPos: i32
  ): DefineDeclaration | null {

    // at ('define' | 'interface'):
    //   Identifier
    //   ('<' TypeParameters)?
    //   ('extends' Type)?
    //   ('implements' Type (',' Type)*)?
    //   '{' DefineMember* '}'

    let isInterface = tn.token == Token.Interface;

    if (!tn.skipIdentifier()) {
      this.error(
        DiagnosticCode.Identifier_expected,
        tn.range()
      );
      return null;
    }

    let identifier = Node.createIdentifierExpression(
      tn.readIdentifier(),
      tn.range()
    );

    console.log('identifier', identifier);

    return null;
  }

  /** Skips over a statement on errors in an attempt to reduce unnecessary diagnostic noise. */
  skipStatement(tn: Tokenizer): void {
    tn.peek(true);
    if (tn.nextTokenOnNewLine) tn.next(); // if reset() to the previous line
    do {
      let nextToken = tn.peek(true);
      if (
        nextToken == Token.EndOfFile ||   // next step should handle this
        nextToken == Token.Semicolon      // end of the statement for sure
      ) {
        tn.next();
        break;
      }
      if (tn.nextTokenOnNewLine) break;   // end of the statement maybe
      switch (tn.next()) {
        case Token.Identifier: {
          tn.readIdentifier();
          break;
        }
        case Token.StringLiteral:
        case Token.TemplateLiteral: {
          tn.readString();
          break;
        }
        case Token.IntegerLiteral: {
          tn.readInteger();
          tn.checkForIdentifierStartAfterNumericLiteral();
          break;
        }
        case Token.FloatLiteral: {
          tn.readFloat();
          tn.checkForIdentifierStartAfterNumericLiteral();
          break;
        }
        case Token.OpenBrace: {
          this.skipBlock(tn);
          break;
        }
      }
    } while (true);
    tn.readingTemplateString = false;
  }

  /** Skips over a block on errors in an attempt to reduce unnecessary diagnostic noise. */
  skipBlock(tn: Tokenizer): void {
    // at '{': ... '}'
    let depth = 1;
    let again = true;
    do {
      switch (tn.next()) {
        case Token.EndOfFile: {
          this.error(
            DiagnosticCode._0_expected,
            tn.range(), "}"
          );
          again = false;
          break;
        }
        case Token.OpenBrace: {
          ++depth;
          break;
        }
        case Token.CloseBrace: {
          --depth;
          if (!depth) again = false;
          break;
        }
        case Token.Identifier: {
          tn.readIdentifier();
          break;
        }
        case Token.StringLiteral:{
          tn.readString();
          break;
        }
        case Token.TemplateLiteral: {
          tn.readString();
          while(tn.readingTemplateString){
            this.skipBlock(tn);
            tn.readString(CharCode.Backtick);
          }
          break;
        }
        case Token.IntegerLiteral: {
          tn.readInteger();
          tn.checkForIdentifierStartAfterNumericLiteral();
          break;
        }
        case Token.FloatLiteral: {
          tn.readFloat();
          tn.checkForIdentifierStartAfterNumericLiteral();
          break;
        }
      }
    } while (again);
  }
}

new Parser().parseFile(CODE, '', false);
