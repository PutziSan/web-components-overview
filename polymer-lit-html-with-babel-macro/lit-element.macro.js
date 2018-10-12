const { createMacro } = require("babel-plugin-macros");
const generate = require("babel-generator").default;
const t = require("babel-types");

// TODO aktuell wird darauf verlassen dass sie immer korrekt bennant wurde nach Schema 'x-...' und dass es
// sinnvoller wäre unter den imports ein customElements.define(...) aufzurufen => scroped custom elements registry (https://github.com/w3c/webcomponents/issues/716) wäre dafür sinnvoll
// man kann überlegen ob man immer einen check einbaut (if (!customElements.get([NAME]) { ... } oder eine uniqe-id/hash mitführt und für jeden import ein neues custom-element erstellt
const toEleName = str => {
  let res = "x";

  [...str].forEach(char => {
    if (char === char.toUpperCase()) {
      res += "-" + char.toLowerCase();
    } else {
      res += char;
    }
  });

  return res;
};

const toPropCode = propValue =>
  propValue.type === "StringLiteral"
    ? `"${propValue.value}"`
    : `\${${generate(propValue).code}}`;

const toPropsString = nodeVal =>
  nodeVal.properties
    .map(prop => ` ${prop.key.name}=${toPropCode(prop.value)}`)
    .join("");

const newTemplateLiteralWithComponent = ref => {
  const [first, two, nodeChildren] = ref.parentPath.get("arguments");

  const { expressions, quasis } = ref.parentPath.parentPath.node; // parentTemplateLiteral

  const compName = toEleName(first.node.name);
  const propsStr =
    two && two.node.type === "ObjectExpression" ? toPropsString(two.node) : "";

  const ind = expressions.findIndex(x => x.callee === ref.node);

  const newQuasis = [];

  // bedenke: templateLiterals haben per definition vor und nach einer expression immer einen "quasi" (string), weswegen der algo so funktioniert
  for (let i = 0; i < quasis.length; i++) {
    if (i === ind) {
      if (!nodeChildren) {
        newQuasis.push(
          t.templateElement(
            {
              raw: `${
                quasis[ind].value.raw
              }<${compName}${propsStr}></${compName}>${
                quasis[ind + 1].value.raw
              }`
            },
            quasis[ind + 1].tail
          )
        );
      } else if (t.isTemplateLiteral(nodeChildren.node)) {
        const childQuasis = nodeChildren.node.quasis;

        // keine expressions:
        if (childQuasis.length === 1) {
          newQuasis.push(
            t.templateElement(
              {
                raw: `${quasis[ind].value.raw}<${compName}${propsStr}>${
                  childQuasis[0].value.raw
                }</${compName}>${quasis[ind + 1].value.raw}`
              },
              quasis[ind + 1].tail
            )
          );
        } else {
          // erstes element von children verbinden mit aktuellem template
          newQuasis.push(
            t.templateElement(
              {
                raw: `${quasis[ind].value.raw}<${compName}${propsStr}>${
                  childQuasis[0].value.raw
                }`
              },
              false
            )
          );

          // nochmal: der algo funktioniert so da garantiert ist bei templateLiteralen dass erstes und letztes Element ein string ist (wenn nötig leer)
          // alle anderen danach anhängen, das letzte element muss wieder an das nächste vom letzten template angehangen werden
          childQuasis.filter((_, i) => i > 0).forEach(childQuasi => {
            if (childQuasi.tail) {
              newQuasis.push(
                t.templateElement(
                  {
                    raw: `${childQuasi.value.raw}</${compName}>${
                      quasis[ind + 1].value.raw
                    }`
                  },
                  quasis[ind + 1].tail
                )
              );
            } else {
              newQuasis.push(childQuasi);
            }
          });
        }
      } else if (t.isStringLiteral(nodeChildren.node)) {
        newQuasis.push(
          t.templateElement(
            {
              raw: `${quasis[ind].value.raw}<${compName}${propsStr}>${
                nodeChildren.node.value
              }</${compName}>${quasis[ind + 1].value.raw}`
            },
            quasis[ind + 1].tail
          )
        );
      } else {
        throw new Error("unkown type for children: " + nodeChildren.type);
      }
    } else if (i !== ind + 1) {
      newQuasis.push(quasis[i]);
    }
  }

  const newExpressions = [];

  for (let i = 0; i < expressions.length; i++) {
    if (i === ind) {
      if (nodeChildren && t.isTemplateLiteral(nodeChildren.node)) {
        // mglweise kann hier ein bug zustande kommen wenn mehre expressions direkt nacheinander kommen in irgendeiner kombi
        nodeChildren.node.expressions.forEach(childExp =>
          newExpressions.push(childExp)
        );
      }
    } else {
      newExpressions.push(expressions[i]);
    }
  }

  return t.templateLiteral(newQuasis, newExpressions);
};

function litElementMacro({ references, state, babel }) {
  references.default.reverse().forEach((ref, i) => {
    // über state könnte man noch den named/default import entfernen der nicht mehr genutzt wird nach der transformation
    // aber schauen ob das überhaupt notwendig ist
    // const compName = ref.parentPath.get("arguments")[0].node.name;

    ref.parentPath.parentPath.replaceWith(newTemplateLiteralWithComponent(ref));
  });
}

module.exports = createMacro(litElementMacro);
