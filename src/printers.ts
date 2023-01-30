import { encodeExpressions, decodeExpressions } from 'prettier-html-templates';

import prettier from 'prettier';

const { mapDoc } = prettier.doc.utils;
const { hardline } = prettier.doc.builders;

import { formatMultilineExpressions } from './formatter';

let embedTextToDoc;

function embed(path, options) {
  return async (textToDoc) => {
    embedTextToDoc = textToDoc
  };
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
    return [formattedTokens.find((token) => token.type !== 'text').content, hardline];
  }

  const [text, expressionMap] = encodeExpressions(formattedTokens);
  const htmlDoc = embedTextToDoc(text, { parser: 'html' });

  const callback = decodeExpressions(expressionMap);

  return mapDoc(htmlDoc, callback);
}

export default {
  'erb-ast': {
    embed,
    print,
  },
};
