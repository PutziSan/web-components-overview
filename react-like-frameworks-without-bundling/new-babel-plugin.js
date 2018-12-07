// @flow
import generate from "@babel/generator";
import template from "@babel/template";
import type NodePath from "@babel/traverse";
import {
  Expression,
  isImport,
  isObjectExpression,
  isStringLiteral,
  isTemplateLiteral,
  ObjectExpression,
  PatternLike,
  Program,
  program as createProgram,
  templateElement,
  TemplateElement,
  templateLiteral,
  TemplateLiteral,
  Node,
  Literal,
  ObjectMethod,
  ObjectProperty,
  SpreadElement
} from "@babel/types";

// from airbnb tool: https://github.com/tleunen/babel-plugin-module-resolver/tree/master/src
// auch zu checken: https://github.com/tleunen/babel-plugin-module-resolver/tree/master/src

export default function ({ template, types: t }) {
  const buildImport = template('Promise.resolve().then(() => MODULE)');

  return {
    // NOTE: Once we drop support for Babel <= v6 we should
    // update this to import from @babel/plugin-syntax-dynamic-import.
    // https://www.npmjs.com/package/@babel/plugin-syntax-dynamic-import
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push('dynamicImport');
    },

    visitor: {
      Import(path) {
        const importArguments = path.parentPath.node.arguments;
        const [importPath] = importArguments;
        const isString = t.isStringLiteral(importPath) || t.isTemplateLiteral(importPath);
        if (isString) {
          t.removeComments(importPath);
        }
        const SOURCE = isString
          ? importArguments
          : t.templateLiteral([
            t.templateElement({ raw: '', cooked: '' }),
            t.templateElement({ raw: '', cooked: '' }, true),
          ], importArguments);
        const requireCall = t.callExpression(
          t.identifier('require'),
          [].concat(SOURCE),
        );

        const { noInterop = false } = this.opts;
        const MODULE = noInterop === true ? requireCall : t.callExpression(this.addHelper('interopRequireWildcard'), [requireCall]);
        const newImport = buildImport({
          MODULE,
        });
        path.parentPath.replaceWith(newImport);
      },
    },
  };
}