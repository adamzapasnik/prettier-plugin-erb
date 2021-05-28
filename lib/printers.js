const { encodeExpressions, decodeExpressions } = require('prettier-html-templates');
const { mapDoc } = require('prettier').doc.utils;
const { concat, hardline } = require('prettier').doc.builders;
const formatMultilineExpressions = require('./formatter');
const prettier = require('prettier');

let embedTextToDoc;

function embed(path, _print, textToDoc, options) {
  embedTextToDoc = textToDoc;
}

function print(path, options, _print) {
  const tokens = path.stack[0];

  const expressionsCount = tokens.filter((token) => token.type !== 'text').length;

  if (expressionsCount === 0) {
    return prettier.format(options.originalText, { ...options, parser: 'html' });
  }

  const formattedTokens = formatMultilineExpressions(tokens, options, embedTextToDoc);

  const isTextOnlyWithSingleExpression =
    expressionsCount === 1 && !tokens.find((token) => token.type === 'text' && token.content.trim());

  if (isTextOnlyWithSingleExpression) {
    return concat([formattedTokens.find((token) => token.type !== 'text').content, hardline]);
  }

  const [text, expressionMap] = encodeExpressions(formattedTokens);
  const htmlDoc = embedTextToDoc(text, { parser: 'html' });

  const callback = decodeExpressions(expressionMap);

  return mapDoc(htmlDoc, callback);
}

module.exports = {
  'erb-ast': {
    embed,
    print,
  },
};
