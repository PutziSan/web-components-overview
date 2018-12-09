// @flow
/*
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
*/

// from airbnb tool: https://github.com/tleunen/babel-plugin-module-resolver/tree/master/src
// auch zu checken: https://github.com/tleunen/babel-plugin-module-resolver/tree/master/src

function customBla() {
  const cache = [];

  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found
        try {
          // If this value does not reference a parent it can be deduped
          return JSON.parse(JSON.stringify(value));
        } catch (error) {
          // discard key if value cannot be deduped
          return;
        }
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  }
}

module.exports = function({ template, types: t }) {
  const buildImport = template("Promise.resolve().then(() => MODULE)");

  return {
    visitor: {
      Import(path) {
        console.log(JSON.stringify(path, customBla()));
      }
    }
  };
};

function oldImport(path) {
  const importArguments = path.parentPath.node.arguments;
  const [importPath] = importArguments;
  const isString =
    t.isStringLiteral(importPath) || t.isTemplateLiteral(importPath);
  if (isString) {
    t.removeComments(importPath);
  }
  const SOURCE = isString
    ? importArguments
    : t.templateLiteral(
        [
          t.templateElement({ raw: "", cooked: "" }),
          t.templateElement({ raw: "", cooked: "" }, true)
        ],
        importArguments
      );
  const requireCall = t.callExpression(
    t.identifier("require"),
    [].concat(SOURCE)
  );

  const { noInterop = false } = this.opts;
  const MODULE =
    noInterop === true
      ? requireCall
      : t.callExpression(this.addHelper("interopRequireWildcard"), [
          requireCall
        ]);
  const newImport = buildImport({
    MODULE
  });
  path.parentPath.replaceWith(newImport);
}
