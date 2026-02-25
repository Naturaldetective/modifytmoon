'use strict';

const version = "1.0.13";

const hasDocs = [
  "consistent-list-newline",
  "if-newline",
  "import-dedupe",
  "top-level-function"
];
const blobUrl = "https://github.com/antfu/eslint-plugin-antfu/blob/main/src/rules/";
function RuleCreator(urlCreator) {
  return function createNamedRule({
    name,
    meta,
    ...rule
  }) {
    return createRule({
      meta: {
        ...meta,
        docs: {
          ...meta.docs,
          url: urlCreator(name)
        }
      },
      ...rule
    });
  };
}
function createRule({
  create,
  defaultOptions,
  meta
}) {
  return {
    create: (context) => {
      const optionsWithDefault = context.options.map((options, index) => {
        return {
          ...defaultOptions[index] || {},
          ...options || {}
        };
      });
      return create(context, optionsWithDefault);
    },
    defaultOptions,
    meta
  };
}
const createEslintRule = RuleCreator(
  (ruleName) => hasDocs.includes(ruleName) ? `${blobUrl}${ruleName}.md` : `${blobUrl}${ruleName}.test.ts`
);

const RULE_NAME$b = "generic-spacing";
const PRESERVE_PREFIX_SPACE_BEFORE_GENERIC = /* @__PURE__ */ new Set([
  "TSCallSignatureDeclaration",
  "ArrowFunctionExpression",
  "TSFunctionType",
  "FunctionExpression"
]);
const genericSpacing = createEslintRule({
  name: RULE_NAME$b,
  meta: {
    type: "layout",
    docs: {
      description: "Spaces around generic type parameters",
      recommended: "stylistic"
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      genericSpacingMismatch: "Generic spaces mismatch"
    }
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode();
    return {
      TSTypeParameterDeclaration: (node) => {
        if (!PRESERVE_PREFIX_SPACE_BEFORE_GENERIC.has(node.parent.type)) {
          const pre = sourceCode.text.slice(0, node.range[0]);
          const preSpace = pre.match(/(\s+)$/)?.[0];
          if (preSpace && preSpace.length) {
            context.report({
              node,
              messageId: "genericSpacingMismatch",
              *fix(fixer) {
                yield fixer.replaceTextRange([node.range[0] - preSpace.length, node.range[0]], "");
              }
            });
          }
        }
        const params = node.params;
        for (let i = 1; i < params.length; i++) {
          const prev = params[i - 1];
          const current = params[i];
          const from = prev.range[1];
          const to = current.range[0];
          const span = sourceCode.text.slice(from, to);
          if (span !== ", " && !span.match(/,\s*\r?\n/)) {
            context.report({
              *fix(fixer) {
                yield fixer.replaceTextRange([from, to], ", ");
              },
              loc: {
                start: prev.loc.end,
                end: current.loc.start
              },
              messageId: "genericSpacingMismatch",
              node
            });
          }
        }
      },
      // add space around = in type Foo<T = true>
      TSTypeParameter: (node) => {
        if (!node.default)
          return;
        const endNode = node.constraint || node.name;
        const from = endNode.range[1];
        const to = node.default.range[0];
        if (sourceCode.text.slice(from, to) !== " = ") {
          context.report({
            *fix(fixer) {
              yield fixer.replaceTextRange([from, to], " = ");
            },
            loc: {
              start: endNode.loc.end,
              end: node.default.loc.start
            },
            messageId: "genericSpacingMismatch",
            node
          });
        }
      }
    };
  }
});

const RULE_NAME$a = "if-newline";
const ifNewline = createEslintRule({
  name: RULE_NAME$a,
  meta: {
    type: "layout",
    docs: {
      description: "Newline after if",
      recommended: "stylistic"
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      missingIfNewline: "Expect newline after if"
    }
  },
  defaultOptions: [],
  create: (context) => {
    return {
      IfStatement(node) {
        if (!node.consequent)
          return;
        if (node.consequent.type === "BlockStatement")
          return;
        if (node.test.loc.end.line === node.consequent.loc.start.line) {
          context.report({
            node,
            loc: {
              start: node.test.loc.end,
              end: node.consequent.loc.start
            },
            messageId: "missingIfNewline",
            fix(fixer) {
              return fixer.replaceTextRange([node.consequent.range[0], node.consequent.range[0]], "\n");
            }
          });
        }
      }
    };
  }
});

const RULE_NAME$9 = "import-dedupe";
const importDedupe = createEslintRule({
  name: RULE_NAME$9,
  meta: {
    type: "problem",
    docs: {
      description: "Fix duplication in imports",
      recommended: "strict"
    },
    fixable: "code",
    schema: [],
    messages: {
      importDedupe: "Expect no duplication in imports"
    }
  },
  defaultOptions: [],
  create: (context) => {
    return {
      ImportDeclaration(node) {
        if (node.specifiers.length <= 1)
          return;
        const names = /* @__PURE__ */ new Set();
        node.specifiers.forEach((n) => {
          const id = n.local.name;
          if (names.has(id)) {
            context.report({
              node,
              loc: {
                start: n.loc.end,
                end: n.loc.start
              },
              messageId: "importDedupe",
              fix(fixer) {
                const s = n.range[0];
                let e = n.range[1];
                if (context.getSourceCode().text[e] === ",")
                  e += 1;
                return fixer.removeRange([s, e]);
              }
            });
          }
          names.add(id);
        });
      }
    };
  }
});

const RULE_NAME$8 = "prefer-inline-type-import";
const preferInlineTypeImport = createEslintRule({
  name: RULE_NAME$8,
  meta: {
    type: "suggestion",
    docs: {
      description: "Inline type import"
    },
    fixable: "code",
    schema: [],
    messages: {
      preferInlineTypeImport: "Prefer inline type import"
    }
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode();
    return {
      ImportDeclaration: (node) => {
        if (node.specifiers.length === 1 && ["ImportNamespaceSpecifier", "ImportDefaultSpecifier"].includes(node.specifiers[0].type))
          return;
        if (node.importKind === "type" && node.specifiers.length > 0) {
          context.report({
            *fix(fixer) {
              yield* removeTypeSpecifier(fixer, sourceCode, node);
              for (const specifier of node.specifiers)
                yield fixer.insertTextBefore(specifier, "type ");
            },
            loc: node.loc,
            messageId: "preferInlineTypeImport",
            node
          });
        }
      }
    };
  }
});
function* removeTypeSpecifier(fixer, sourceCode, node) {
  const importKeyword = sourceCode.getFirstToken(node);
  if (!importKeyword)
    return;
  const typeIdentifier = sourceCode.getTokenAfter(importKeyword);
  if (!typeIdentifier)
    return;
  yield fixer.remove(typeIdentifier);
  if (importKeyword.loc.end.column + 1 === typeIdentifier.loc.start.column) {
    yield fixer.removeRange([
      importKeyword.range[1],
      importKeyword.range[1] + 1
    ]);
  }
}

const RULE_NAME$7 = "top-level-function";
const topLevelFunction = createEslintRule({
  name: RULE_NAME$7,
  meta: {
    type: "problem",
    docs: {
      description: "Enforce top-level functions to be declared with function keyword",
      recommended: "stylistic"
    },
    fixable: "code",
    schema: [],
    messages: {
      topLevelFunctionDeclaration: "Top-level functions should be declared with function keyword"
    }
  },
  defaultOptions: [],
  create: (context) => {
    return {
      VariableDeclaration(node) {
        if (node.parent.type !== "Program" && node.parent.type !== "ExportNamedDeclaration")
          return;
        if (node.declarations.length !== 1)
          return;
        if (node.kind !== "const")
          return;
        if (node.declare)
          return;
        const declaration = node.declarations[0];
        if (declaration.init?.type !== "ArrowFunctionExpression")
          return;
        if (declaration.id?.type !== "Identifier")
          return;
        if (declaration.id.typeAnnotation)
          return;
        if (declaration.init.body.type !== "BlockStatement" && declaration.id?.loc.start.line === declaration.init?.body.loc.end.line)
          return;
        const arrowFn = declaration.init;
        const body = declaration.init.body;
        const id = declaration.id;
        context.report({
          node,
          loc: {
            start: id.loc.start,
            end: body.loc.start
          },
          messageId: "topLevelFunctionDeclaration",
          fix(fixer) {
            const code = context.getSourceCode().text;
            const textName = code.slice(id.range[0], id.range[1]);
            const textArgs = arrowFn.params.length ? code.slice(arrowFn.params[0].range[0], arrowFn.params[arrowFn.params.length - 1].range[1]) : "";
            const textBody = body.type === "BlockStatement" ? code.slice(body.range[0], body.range[1]) : `{
  return ${code.slice(body.range[0], body.range[1])}
}`;
            const textGeneric = arrowFn.typeParameters ? code.slice(arrowFn.typeParameters.range[0], arrowFn.typeParameters.range[1]) : "";
            const textTypeReturn = arrowFn.returnType ? code.slice(arrowFn.returnType.range[0], arrowFn.returnType.range[1]) : "";
            const textAsync = arrowFn.async ? "async " : "";
            const final = `${textAsync}function ${textName} ${textGeneric}(${textArgs})${textTypeReturn} ${textBody}`;
            return fixer.replaceTextRange([node.range[0], node.range[1]], final);
          }
        });
      }
    };
  }
});

const RULE_NAME$6 = "no-import-node-modules-by-path";
const noImportNodeModulesByPath = createEslintRule({
  name: RULE_NAME$6,
  meta: {
    type: "problem",
    docs: {
      description: "Prevent importing modules in `node_modules` folder by relative or absolute path",
      recommended: "recommended"
    },
    schema: [],
    messages: {
      noImportNodeModulesByPath: "Do not import modules in `node_modules` folder by path"
    }
  },
  defaultOptions: [],
  create: (context) => {
    return {
      "ImportDeclaration": (node) => {
        if (node.source.value.includes("/node_modules/")) {
          context.report({
            node,
            messageId: "noImportNodeModulesByPath"
          });
        }
      },
      'CallExpression[callee.name="require"]': (node) => {
        const value = node.arguments[0]?.value;
        if (typeof value === "string" && value.includes("/node_modules/")) {
          context.report({
            node,
            messageId: "noImportNodeModulesByPath"
          });
        }
      }
    };
  }
});

const RULE_NAME$5 = "no-ts-export-equal";
const noTsExportEqual = createEslintRule({
  name: RULE_NAME$5,
  meta: {
    type: "problem",
    docs: {
      description: "Do not use `exports =`",
      recommended: "recommended"
    },
    schema: [],
    messages: {
      noTsExportEqual: "Use ESM `export default` instead"
    }
  },
  defaultOptions: [],
  create: (context) => {
    const extension = context.getFilename().split(".").pop();
    if (!extension)
      return {};
    if (!["ts", "tsx", "mts", "cts"].includes(extension))
      return {};
    return {
      TSExportAssignment(node) {
        context.report({
          node,
          messageId: "noTsExportEqual"
        });
      }
    };
  }
});

const RULE_NAME$4 = "no-cjs-exports";
const noCjsExports = createEslintRule({
  name: RULE_NAME$4,
  meta: {
    type: "problem",
    docs: {
      description: "Do not use CJS exports"
    },
    schema: [],
    messages: {
      noCjsExports: "Use ESM export instead"
    }
  },
  defaultOptions: [],
  create: (context) => {
    const extension = context.getFilename().split(".").pop();
    if (!extension)
      return {};
    if (!["ts", "tsx", "mts", "cts"].includes(extension))
      return {};
    return {
      'MemberExpression[object.name="exports"]': function(node) {
        context.report({
          node,
          messageId: "noCjsExports"
        });
      },
      'MemberExpression[object.name="module"][property.name="exports"]': function(node) {
        context.report({
          node,
          messageId: "noCjsExports"
        });
      }
    };
  }
});

const RULE_NAME$3 = "no-const-enum";
const noConstEnum = createEslintRule({
  name: RULE_NAME$3,
  meta: {
    type: "problem",
    docs: {
      description: `Deprecated. Use \`'no-restricted-syntax': ['error', 'TSEnumDeclaration[const=true]']\` instead.`
    },
    schema: [],
    messages: {
      noConstEnum: "Do not use `const enum` expression"
    },
    deprecated: true
  },
  defaultOptions: [],
  create: (context) => {
    return {
      TSEnumDeclaration: (node) => {
        if (node.const) {
          context.report({
            node,
            messageId: "noConstEnum"
          });
        }
      }
    };
  }
});

const RULE_NAME$2 = "named-tuple-spacing";
const RE = /^([\w_$]+)(\s*)(\?\s*)?:(\s*)(.*)$/;
const namedTupleSpacing = createEslintRule({
  name: RULE_NAME$2,
  meta: {
    type: "layout",
    docs: {
      description: "Expect space before type declaration in named tuple",
      recommended: "stylistic"
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      expectedSpaceAfter: "Expected a space after the ':'.",
      unexpectedSpaceBetween: "Unexpected space between '?' and the ':'.",
      unexpectedSpaceBefore: "Unexpected space before the ':'."
    }
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode();
    return {
      TSNamedTupleMember: (node) => {
        const code = sourceCode.text.slice(node.range[0], node.range[1]);
        const match = code.match(RE);
        if (!match)
          return;
        const labelName = node.label.name;
        const spaceBeforeColon = match[2];
        const optionalMark = match[3];
        const spacesAfterColon = match[4];
        const elementType = match[5];
        function getReplaceValue() {
          let ret = labelName;
          if (node.optional)
            ret += "?";
          ret += ": ";
          ret += elementType;
          return ret;
        }
        if (optionalMark?.length > 1) {
          context.report({
            node,
            messageId: "unexpectedSpaceBetween",
            *fix(fixer) {
              yield fixer.replaceTextRange(node.range, code.replace(RE, getReplaceValue()));
            }
          });
        }
        if (spaceBeforeColon?.length) {
          context.report({
            node,
            messageId: "unexpectedSpaceBefore",
            *fix(fixer) {
              yield fixer.replaceTextRange(node.range, code.replace(RE, getReplaceValue()));
            }
          });
        }
        if (spacesAfterColon != null && spacesAfterColon.length !== 1) {
          context.report({
            node,
            messageId: "expectedSpaceAfter",
            *fix(fixer) {
              yield fixer.replaceTextRange(node.range, code.replace(RE, getReplaceValue()));
            }
          });
        }
      }
    };
  }
});

const RULE_NAME$1 = "consistent-list-newline";
const consistentListNewline = createEslintRule({
  name: RULE_NAME$1,
  meta: {
    type: "layout",
    docs: {
      description: "Having line breaks styles to object, array and named imports",
      recommended: "stylistic"
    },
    fixable: "whitespace",
    schema: [{
      type: "object",
      properties: {
        ArrayExpression: { type: "boolean" },
        ArrowFunctionExpression: { type: "boolean" },
        CallExpression: { type: "boolean" },
        ExportNamedDeclaration: { type: "boolean" },
        FunctionDeclaration: { type: "boolean" },
        FunctionExpression: { type: "boolean" },
        ImportDeclaration: { type: "boolean" },
        NewExpression: { type: "boolean" },
        ObjectExpression: { type: "boolean" },
        TSInterfaceDeclaration: { type: "boolean" },
        TSTupleType: { type: "boolean" },
        TSTypeLiteral: { type: "boolean" },
        TSTypeParameterDeclaration: { type: "boolean" },
        TSTypeParameterInstantiation: { type: "boolean" },
        ObjectPattern: { type: "boolean" },
        ArrayPattern: { type: "boolean" }
      },
      additionalProperties: false
    }],
    messages: {
      shouldWrap: "Should have line breaks between items, in node {{name}}",
      shouldNotWrap: "Should not have line breaks between items, in node {{name}}"
    }
  },
  defaultOptions: [{}],
  create: (context, [options = {}] = [{}]) => {
    function removeLines(fixer, start, end) {
      const range = [start, end];
      const code = context.sourceCode.text.slice(...range);
      return fixer.replaceTextRange(range, code.replace(/(\r\n|\n)/g, ""));
    }
    function check(node, children, nextNode) {
      const items = children.filter(Boolean);
      if (items.length === 0)
        return;
      const startToken = context.sourceCode.getTokenBefore(items[0]);
      const endToken = context.sourceCode.getTokenAfter(items[items.length - 1]);
      const startLine = startToken.loc.start.line;
      if (startToken.loc.start.line === endToken.loc.end.line)
        return;
      let mode = null;
      let lastLine = startLine;
      items.forEach((item, idx) => {
        if (mode == null) {
          mode = item.loc.start.line === lastLine ? "inline" : "newline";
          lastLine = item.loc.end.line;
          return;
        }
        const currentStart = item.loc.start.line;
        if (mode === "newline" && currentStart === lastLine) {
          context.report({
            node: item,
            messageId: "shouldWrap",
            data: {
              name: node.type
            },
            *fix(fixer) {
              yield fixer.insertTextBefore(item, "\n");
            }
          });
        } else if (mode === "inline" && currentStart !== lastLine) {
          const lastItem2 = items[idx - 1];
          context.report({
            node: item,
            messageId: "shouldNotWrap",
            data: {
              name: node.type
            },
            *fix(fixer) {
              yield removeLines(fixer, lastItem2.range[1], item.range[0]);
            }
          });
        }
        lastLine = item.loc.end.line;
      });
      const endRange = nextNode ? Math.min(
        context.sourceCode.getTokenBefore(nextNode).range[0],
        node.range[1]
      ) : node.range[1];
      const endLoc = context.sourceCode.getLocFromIndex(endRange);
      const lastItem = items[items.length - 1];
      if (mode === "newline" && endLoc.line === lastLine) {
        context.report({
          node: lastItem,
          messageId: "shouldWrap",
          data: {
            name: node.type
          },
          *fix(fixer) {
            yield fixer.insertTextAfter(lastItem, "\n");
          }
        });
      } else if (mode === "inline" && endLoc.line !== lastLine) {
        if (items.length === 1 && items[0].loc.start.line !== items[1]?.loc.start.line)
          return;
        const content = context.sourceCode.text.slice(lastItem.range[1], endRange);
        if (content.includes("\n")) {
          context.report({
            node: lastItem,
            messageId: "shouldNotWrap",
            data: {
              name: node.type
            },
            *fix(fixer) {
              yield removeLines(fixer, lastItem.range[1], endRange);
            }
          });
        }
      }
    }
    const listenser = {
      ObjectExpression: (node) => {
        check(node, node.properties);
      },
      ArrayExpression: (node) => {
        check(node, node.elements);
      },
      ImportDeclaration: (node) => {
        check(node, node.specifiers);
      },
      ExportNamedDeclaration: (node) => {
        check(node, node.specifiers);
      },
      FunctionDeclaration: (node) => {
        check(
          node,
          node.params,
          node.returnType || node.body
        );
      },
      FunctionExpression: (node) => {
        check(
          node,
          node.params,
          node.returnType || node.body
        );
      },
      ArrowFunctionExpression: (node) => {
        if (node.params.length <= 1)
          return;
        check(
          node,
          node.params,
          node.returnType || node.body
        );
      },
      CallExpression: (node) => {
        check(node, node.arguments);
      },
      TSInterfaceDeclaration: (node) => {
        check(node, node.body.body);
      },
      TSTypeLiteral: (node) => {
        check(node, node.members);
      },
      TSTupleType: (node) => {
        check(node, node.elementTypes);
      },
      NewExpression: (node) => {
        check(node, node.arguments);
      },
      TSTypeParameterDeclaration(node) {
        check(node, node.params);
      },
      TSTypeParameterInstantiation(node) {
        check(node, node.params);
      },
      ObjectPattern(node) {
        check(node, node.properties, node.typeAnnotation);
      },
      ArrayPattern(node) {
        check(node, node.elements);
      }
    };
    Object.keys(options).forEach((key) => {
      if (options[key] === false)
        delete listenser[key];
    });
    return listenser;
  }
});

const RULE_NAME = "indent-binary-ops";
const indentBinaryOps = createEslintRule({
  name: RULE_NAME,
  meta: {
    type: "layout",
    docs: {
      description: "Indentation for binary operators",
      recommended: "stylistic"
    },
    fixable: "whitespace",
    schema: [
      {
        type: "object",
        properties: {
          warn: {
            type: "boolean"
          },
          indent: {
            anyOf: [
              {
                type: "integer",
                minimum: 0
              },
              {
                type: "string",
                enum: ["tab"]
              }
            ]
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      space: "Expect indentation to be consistent"
    }
  },
  defaultOptions: [{ indent: 2 }],
  create: (context, options) => {
    const { sourceCode } = context;
    const indentStr = options[0]?.indent === "tab" ? "	" : " ".repeat(options[0]?.indent ?? 2);
    const indentCache = /* @__PURE__ */ new Map();
    function getIndentOfLine(line) {
      if (indentCache.has(line))
        return indentCache.get(line);
      return sourceCode.lines[line - 1].match(/^\s*/)?.[0] ?? "";
    }
    function firstTokenOfLine(line) {
      return sourceCode.tokensAndComments.find((token) => token.loc.start.line === line);
    }
    function lastTokenOfLine(line) {
      return [...sourceCode.tokensAndComments].reverse().find((token) => token.loc.end.line === line);
    }
    function handler(node, right) {
      if (node.loc.start.line === node.loc.end.line)
        return;
      let tokenRight = sourceCode.getFirstToken(right);
      let tokenOperator = sourceCode.getTokenBefore(tokenRight);
      while (tokenOperator.value === "(") {
        tokenRight = tokenOperator;
        tokenOperator = sourceCode.getTokenBefore(tokenRight);
        if (tokenOperator.range[0] <= right.parent.range[0])
          return;
      }
      const tokenLeft = sourceCode.getTokenBefore(tokenOperator);
      const isMultiline = tokenRight.loc.start.line !== tokenLeft.loc.start.line;
      if (!isMultiline)
        return;
      const firstTokenOfLineLeft = firstTokenOfLine(tokenLeft.loc.start.line);
      const lastTokenOfLineLeft = lastTokenOfLine(tokenLeft.loc.start.line);
      const needAdditionIndent = firstTokenOfLineLeft?.type === "Keyword" || firstTokenOfLineLeft?.type === "Identifier" && firstTokenOfLineLeft.value === "type" || lastTokenOfLineLeft?.value === ":" || lastTokenOfLineLeft?.value === "[" || lastTokenOfLineLeft?.value === "(" || lastTokenOfLineLeft?.value === "<";
      const indentTarget = getIndentOfLine(tokenLeft.loc.start.line) + (needAdditionIndent ? indentStr : "");
      const indentRight = getIndentOfLine(tokenRight.loc.start.line);
      if (indentTarget !== indentRight) {
        const start = {
          line: tokenRight.loc.start.line,
          column: 0
        };
        const end = {
          line: tokenRight.loc.start.line,
          column: indentRight.length
        };
        context.report({
          loc: {
            start,
            end
          },
          messageId: "space",
          fix(fixer) {
            return fixer.replaceTextRange(
              [sourceCode.getIndexFromLoc(start), sourceCode.getIndexFromLoc(end)],
              indentTarget
            );
          }
        });
        indentCache.set(tokenRight.loc.start.line, indentTarget);
      }
    }
    return {
      BinaryExpression(node) {
        handler(node, node.right);
      },
      LogicalExpression(node) {
        handler(node, node.right);
      },
      TSUnionType(node) {
        if (node.types.length > 1) {
          node.types.forEach((type) => {
            handler(node, type);
          });
        }
      },
      TSIntersectionType(node) {
        if (node.types.length > 1) {
          node.types.forEach((type) => {
            handler(node, type);
          });
        }
      }
    };
  }
});

const plugin = {
  meta: {
    name: "antfu",
    version
  },
  rules: {
    "consistent-list-newline": consistentListNewline,
    "generic-spacing": genericSpacing,
    "if-newline": ifNewline,
    "import-dedupe": importDedupe,
    "named-tuple-spacing": namedTupleSpacing,
    "no-cjs-exports": noCjsExports,
    "no-import-node-modules-by-path": noImportNodeModulesByPath,
    "no-ts-export-equal": noTsExportEqual,
    "prefer-inline-type-import": preferInlineTypeImport,
    "top-level-function": topLevelFunction,
    "indent-binary-ops": indentBinaryOps,
    /**
     * @deprecated Use `'no-restricted-syntax': ['error', 'TSEnumDeclaration[const=true]']` instead.
     */
    "no-const-enum": noConstEnum
  }
};

module.exports = plugin;
