/*import generate from "@babel/generator";
import template from "@babel/template";
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
  SpreadElement,
  BaseNode,
  ImportDeclaration,
  isImportDefaultSpecifier
} from "@babel/types";
import type { NodePath } from "@babel/traverse";
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
  };
}

module.exports = function({ traverse, types, ...api }, opts, cwdPath) {
  return {
    visitor: {
      ImportDeclaration(path) {
        const filename = path.hub.file.opts.filename;
        console.log(filename);

        const node = path.node;

        node.specifiers.forEach(specifier => {
          if (types.isImportDefaultSpecifier(specifier)) {
          }
        });
      },
      Import(path) {
        console.log(JSON.stringify(path.node, customBla()));
        console.log(JSON.stringify(path.parentPath.node, customBla()));
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

  const newImport = buildImport({
    MODULE: requireCall
  });

  path.parentPath.replaceWith(newImport);
}
