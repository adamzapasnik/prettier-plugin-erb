"use strict";

/**
 * @typedef {import("../document").Doc} Doc
 */

const {
  builders: { fill, group, hardline, literalline, indent, line },
  utils: { cleanDoc, getDocParts, isConcat, replaceTextEndOfLine },
} = require("prettier").doc;
const clean = require("./clean.js");
const {
  countChars,
  unescapeQuoteEntities,
  getTextValueParts,
} = require("./utils.js");
const preprocess = require("./print-preprocess.js");
const { insertPragma } = require("./pragma.js");
const { locStart, locEnd } = require("./loc.js");
const embed = require("./embed.js");
const {
  printClosingTagSuffix,
  printClosingTagEnd,
  printOpeningTagPrefix,
  printOpeningTagStart,
} = require("./print/tag.js");
const { printElement } = require("./print/element.js");
const { printChildren } = require("./print/children.js");

function genericPrint(path, options, print) {
  const node = path.getValue();

  switch (node.type) {
    // case "front-matter":
    //   return replaceTextEndOfLine(node.raw);
    case "root":
      if (options.__onHtmlRoot) {
        options.__onHtmlRoot(node);
      }
      // use original concat to not break stripTrailingHardline
      return [group(printChildren(path, options, print)), hardline];
    case "element":
    case "ieConditionalComment": {
      return printElement(path, options, print);
    }
    case "ieConditionalStartComment":
    case "ieConditionalEndComment":
      return [printOpeningTagStart(node), printClosingTagEnd(node)];
    // case "interpolation":
    //   return [
    //     printOpeningTagStart(node, options),
    //     ...path.map(print, "children"),
    //     printClosingTagEnd(node, options),
    //   ];
    case "text": {
      // if (node.parent.type === "interpolation") {
      //   // replace the trailing literalline with hardline for better readability
      //   const trailingNewlineRegex = /\n[^\S\n]*?$/;
      //   const hasTrailingNewline = trailingNewlineRegex.test(node.value);
      //   const value = hasTrailingNewline
      //     ? node.value.replace(trailingNewlineRegex, "")
      //     : node.value;
      //   return [
      //     ...replaceTextEndOfLine(value),
      //     hasTrailingNewline ? hardline : "",
      //   ];
      // }

      const printed = cleanDoc([
        printOpeningTagPrefix(node, options),
        ...getTextValueParts(node),
        printClosingTagSuffix(node, options),
      ]);
      if (isConcat(printed) || printed.type === "fill") {
        return fill(getDocParts(printed));
      }
      /* istanbul ignore next */
      return printed;
    }
    case "docType":
      return [
        group([
          printOpeningTagStart(node, options),
          " ",
          node.value.replace(/^html\b/i, "html").replace(/\s+/g, " "),
        ]),
        printClosingTagEnd(node, options),
      ];
    case "comment": {
      return [
        printOpeningTagPrefix(node, options),
        ...replaceTextEndOfLine(
          options.originalText.slice(locStart(node), locEnd(node)),
          literalline
        ),
        printClosingTagSuffix(node, options),
      ];
    }
    case "attribute": {
      if (node.value === null) {
        return node.rawName;
      }
      const value = unescapeQuoteEntities(node.value);
      const singleQuoteCount = countChars(value, "'");
      const doubleQuoteCount = countChars(value, '"');
      const quote = singleQuoteCount < doubleQuoteCount ? "'" : '"';
      return [
        node.rawName,

        "=",
        quote,

        ...replaceTextEndOfLine(
          quote === '"'
            ? value.replace(/"/g, "&quot;")
            : value.replace(/'/g, "&apos;")
        ),
        quote,
      ];
    }
    case 'expression': {
      if (node.expressionType === 'start' || node.expressionType === 'middle') {
        return group([
          node.printExpression,
          indent([hardline, ...printChildren(path, options, print)]),
          node.printClosing ? hardline : '',
          node.printClosing ? node.printClosing : '',

          // hardline,
          // node.printClosing//? only when end what if middle // wyjebac end :shrug:
        ]);
      } else {
        return [
          printOpeningTagStart(node, options),

          indent([
            // //   //       line,
            // //   //       textToDoc(node.value, textToDocOptions, {
            // //   //         stripTrailingHardline: true,
            // //   //       }),
            // //   //     ]),
            line,
            // //   // TODO: do I need replace end of line with?
            'plaieeenplaieeenplaieeenplaieeenplaieeenplaieeenplaieeenplaieeenplaieeenplaieeenplaieeenplaieeenplaieeenplaieeenplaieeenplaieeen',
            // //   // ...replaceEndOfLineWith(
            // 'ass',
            // //   //   literalline
            // ),
          ]),
          node.next && needsToBorrowPrevClosingTagEndMarker(node.next) ? ' ' : line, // TODO: when do I need this
          printClosingTagEnd(node, options),
        ];
      }
    }

    default:
      /* istanbul ignore next */
      throw new Error(`Unexpected node type ${node.type}`);
  }
}

module.exports = {
  preprocess,
  print: genericPrint,
  insertPragma,
  massageAstNode: clean,
  embed,
};
