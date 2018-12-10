import {
  CallExpression,
  ImportDeclaration,
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isImportSpecifier,
  isStringLiteral,
  isTemplateLiteral
} from "@babel/types";
import { NodePath } from "@babel/traverse";
import { dirname, join, resolve } from "path";

function isNodeModule(importPath: string) {
  return importPath.charAt(0) !== ".";
}

// TODO:
// 1. replace import with new, if this is an import from node_modules
module.exports = function() {
  return {
    visitor: {
      ImportDeclaration(path: NodePath) {
        const filename = path.hub.file.opts.filename;

        const node = path.node as ImportDeclaration;

        const importPath = node.source.value;
        const filePath = isNodeModule(importPath)
          ? require.resolve(importPath)
          // todo: add extension (js,jsx,ts,tsx,...?)
          : resolve(join(dirname(filename), importPath));

        console.log(filePath);

        node.specifiers.forEach(specifier => {
          // import preact from 'preact';
          if (isImportDefaultSpecifier(specifier)) {
          }

          // import * as preact from 'preact';
          if (isImportNamespaceSpecifier(specifier)) {
          }

          // import { render } from 'preact';
          if (isImportSpecifier(specifier)) {
            const importedName = specifier.imported.name;
          }
        });
      },
      Import(path: NodePath) {
        const dynamicImportNode = path.parentPath.node as CallExpression;
        // const importArguments = path.parentPath.node.arguments;
        const [importPathNode] = dynamicImportNode.arguments;

        if (isTemplateLiteral(importPathNode)) {
          if (importPathNode.expressions.length > 0) {
            throw new Error(
              "expressions in dynamic imports are currently not supported"
            );
          }

          const importPath = importPathNode.quasis[0].value.raw;
        }

        if (isStringLiteral(importPathNode)) {
          const importPath = importPathNode.value;
        }
      }
    }
  };
};
