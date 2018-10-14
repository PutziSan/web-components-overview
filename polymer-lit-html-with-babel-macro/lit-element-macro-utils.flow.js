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
  Literal, ObjectMethod, ObjectProperty, SpreadElement
} from "@babel/types";

type Names = { classNameIdentifier: string, customElementName: string };

function toCustomEleDefAst({ classNameIdentifier, customElementName }: Names) {
  return template.ast(`
if (!customeElements.get('${customElementName}') {
  customElements.define('${customElementName}', ${classNameIdentifier});
}`);
}

export function addImportsToProgram(program: Program, nameDefs: Names[]) {
  return createProgram(
    [
      ...program.body.filter(bodyNode => isImport(bodyNode)),
      ...nameDefs.map(toCustomEleDefAst),
      ...program.body.filter(bodyNode => !isImport(bodyNode))
    ],
    program.directives,
    program.sourceType,
    program.interpreter,
    program.sourceFile
  );
}

const isUpperCase = (str: string) => str.toLowerCase() === str;

const camelCaseToKebabCase = (str: string) => {
  return Array.from(str)
    .map(char => (isUpperCase(char) ? `-${str.toLowerCase()}` : char))
    .join("")
    .replace(/--+/g, "-");
};

const toEleName = (className: string) => `x${camelCaseToKebabCase(className)}`;

const toPropCode = (propValue: Expression | PatternLike) =>
  isStringLiteral(propValue)
    ? `"${propValue.value}"`
    : `\${${generate(propValue).code}}`;

const toPropsString = (nodeVal: ObjectExpression) => {
  return nodeVal.properties
    .map(prop => ` ${prop.key.name}=${toPropCode(prop.value)}`)
    .join("");
};

type NodeProps = {
  propsDef: ?NodePath,
  children: ?NodePath,
  classIdentifier: NodePath
};

function getInsertQuasis({
  propsDef,
  children,
  quasiBefore,
  quasiAfter,
  classIdentifier
}: NodeProps & { quasiBefore: TemplateElement, quasiAfter: TemplateElement }) {
  const compName = toEleName(classIdentifier.node.name);
  const propsStr =
    propsDef && isObjectExpression(propsDef.node)
      ? toPropsString(propsDef.node)
      : "";

  const toSingleRawString = (val: string) => {
    const compStr = `<${compName}${propsStr}>${val}</${compName}>`;
    return `${quasiBefore.value.raw}${compStr}${quasiAfter.value.raw}`;
  };

  if (!children) {
    return [templateElement({ raw: toSingleRawString("") }, quasiAfter.tail)];
  }

  if (isTemplateLiteral(children.node)) {
    const childQuasis = children.node.quasis;

    // keine expressions:
    if (childQuasis.length === 1) {
      const raw = toSingleRawString(childQuasis[0].value.raw);
      return [templateElement({ raw }, quasiAfter.tail)];
    } else {
      const childLen = childQuasis.length;

      const firstRaw = `${quasiBefore.value.raw}<${compName}${propsStr}>${
        childQuasis[0].value.raw
      }`;
      const lastRaw = `${childQuasis[childLen - 1].value.raw}</${compName}>${
        quasiAfter.value.raw
      }`;

      // nochmal: der algo funktioniert so da garantiert ist bei templateLiteralen dass erstes und letztes Element
      // ein string ist (wenn nötig leer) alle anderen danach anhängen, das letzte element muss wieder an das
      // nächste vom letzten template angehangen werden
      return [
        templateElement({ raw: firstRaw }, false),
        ...childQuasis.slice(1, childLen - 1),
        templateElement({ raw: lastRaw }, quasiAfter.tail)
      ];
    }
  }

  if (isStringLiteral(children.node)) {
    const raw = toSingleRawString(children.node.value);
    return [templateElement({ raw }, quasiAfter.tail)];
  }

  throw new Error(`unkown type for children: ${children.type}`);
}

function generateNewQuasis({
  quasis,
  splitIndex,
  ...nodeProps
}: NodeProps & { quasis: TemplateElement[], splitIndex: number }) {
  const quasiBefore = quasis[splitIndex];
  const quasiAfter = quasis[splitIndex + 1];

  return [
    ...quasis.slice(0, splitIndex),
    ...getInsertQuasis({ ...nodeProps, quasiBefore, quasiAfter }),
    ...quasis.slice(splitIndex + 2)
  ];
}

function generateExpressions({
  children,
  splitIndex,
  expressions
}: {
  expressions: Expression[],
  splitIndex: number,
  children: ?NodePath
}) {
  const pre = expressions.slice(0, splitIndex);
  const post = expressions.slice(splitIndex + 1);

  if (children && isTemplateLiteral(children.node)) {
    return [...pre, ...children.node.expressions, ...post];
  }

  return [...pre, ...post];
}

export function newTemplateLiteralWithComponent(ref: NodePath) {
  const args: Array<?NodePath> = ref.parentPath.get("arguments");
  const tplLit: TemplateLiteral = ref.parentPath.parentPath.node; // parentTemplateLiteral

  const children: ?NodePath = args[2];

  const splitIndex = tplLit.expressions.findIndex(x => x.callee === ref.node);

  const newQuasis = generateNewQuasis({
    splitIndex,
    quasis: tplLit.quasis,
    classIdentifier: args[0],
    propsDef: args[1],
    children
  });

  const newExpressions = generateExpressions({
    expressions: tplLit.expressions,
    splitIndex,
    children
  });

  return templateLiteral(newQuasis, newExpressions);
}

type Bla = {
  childrenNode: ?Node,
  customElementTagName: string
};

type FuncToLiteral = {
  customElementTagName: string,
  props: ?ObjectExpression,
  children: Literal
};

function createTplEle(val: string) {
  return templateElement({ raw: val });
}

function propToBla(props: ObjectProperty | SpreadElement) {

}

function objectNodeToTemplateLiteral(
  customElementTagName: string,
  props: ?ObjectExpression,
  children: Literal
) {
  const propsExpressions: Expression[] = props ? [props.properties.map()] : [];

  return templateLiteral([createTplEle()], []);
}

function a({ childrenNode }) {}
