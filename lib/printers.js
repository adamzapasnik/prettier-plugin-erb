const { encodeExpressions, decodeExpressions } = require('prettier-html-templates');
const { mapDoc } = require('prettier').doc.utils;
const formatMultilineExpressions = require('./formatter');
const prettier = require('prettier');

let embedTextToDoc;

function embed(path, _print, textToDoc, options) {
  embedTextToDoc = textToDoc;
}

function print(path, options, _print) {
  const tokens = path.stack[0];

  const isTextWithExpressions = tokens.find((token) => token.type !== 'text');

  if (!isTextWithExpressions) {
    return prettier.format(options.originalText, { ...options, parser: 'html' });
  }

  const formattedTokens = formatMultilineExpressions(tokens, options);
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
