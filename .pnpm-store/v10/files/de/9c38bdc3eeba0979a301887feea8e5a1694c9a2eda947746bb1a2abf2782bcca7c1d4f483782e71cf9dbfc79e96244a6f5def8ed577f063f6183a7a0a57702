// src/core/index.ts
import {
  addNormalScript,
  DEFINE_STYLEX,
  generateTransform,
  isCallOf,
  MagicStringAST,
  parseSFC,
  walkAST
} from "@vue-macros/common";
import {
  createTransformContext,
  traverseNode
} from "@vue/compiler-dom";
var STYLEX_CREATE = "_stylex_create";
var STYLEX_ATTRS = "_stylex_attrs";
function transformDirective(s) {
  return (node) => {
    if (!(node.type === 1)) return;
    const i = node.props.findIndex(
      (item) => item.type === 7 && item.rawName === "v-stylex"
    );
    if (i === -1) return;
    const directiveVStyleX = node.props[i];
    if (directiveVStyleX.exp?.type !== 4)
      throw new Error("`v-stylex` must be passed a expression");
    const hasColon = directiveVStyleX.exp.content.startsWith("(") && directiveVStyleX.exp.content.endsWith(")");
    const prefix = hasColon ? "" : "(";
    const postfix = hasColon ? "" : ")";
    if (directiveVStyleX.exp.content.includes(STYLEX_ATTRS)) {
      s?.overwrite(
        directiveVStyleX.loc.start.offset,
        directiveVStyleX.loc.end.offset,
        `v-bind="${directiveVStyleX.exp.content}"`
      );
      return;
    }
    s?.overwrite(
      directiveVStyleX.loc.start.offset,
      directiveVStyleX.loc.end.offset,
      `v-bind="${STYLEX_ATTRS}${prefix}${directiveVStyleX.exp.content}${postfix}"`
    );
  };
}
function transformDefineStyleX(code, id) {
  if (!code.includes(DEFINE_STYLEX)) return;
  const sfc = parseSFC(code, id);
  const { scriptSetup, getSetupAst, template } = sfc;
  if (!scriptSetup || !template) return;
  let scriptOffset;
  const setupOffset = scriptSetup.loc.start.offset;
  const s = new MagicStringAST(code);
  const normalScript = addNormalScript(sfc, s);
  function moveToScript(decl, prefix = "") {
    if (scriptOffset === void 0) scriptOffset = normalScript.start();
    const text = `
${prefix}${s.sliceNode(decl, { offset: setupOffset })}`;
    s.appendRight(scriptOffset, text);
    s.removeNode(decl, { offset: setupOffset });
  }
  const setupAST = getSetupAst();
  walkAST(setupAST, {
    enter(node) {
      if (node.type !== "VariableDeclaration") return;
      node.declarations.forEach((decl) => {
        if (!isCallOf(decl.init, DEFINE_STYLEX)) return;
        s.overwriteNode(decl.init.callee, STYLEX_CREATE, {
          offset: setupOffset
        });
      });
      moveToScript(node);
    }
  });
  if (scriptOffset !== void 0) normalScript.end();
  const ctx = createTransformContext(template.ast, {
    nodeTransforms: [transformDirective(s)]
  });
  traverseNode(template.ast, ctx);
  s.appendRight(
    setupOffset,
    `
import { create as ${STYLEX_CREATE}, attrs as ${STYLEX_ATTRS} } from '@stylexjs/stylex'`
  );
  return generateTransform(s, id);
}

export {
  transformDefineStyleX
};
