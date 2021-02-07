const { concat, indent, hardline, group } = require('prettier').doc.builders;
const { format } = require('prettier');

const formatMultilineExpressions = (tokens, options) => {
  return tokens
    .map((token) => ({ ...token }))
    .map((token) => {
      // TODO: currently doesn't support multiline block opening expressions
      if (token.type === 'plain' && token.content.match(/\r?\n/)) {
        const matcher = token.content.match(/<%(=|#|-|#-|#=)?([\S\s]*?)\s*(#|-|#-)?%>/m);
        const openingTag = matcher[1] || '';
        const expression = matcher[2];
        const closingTag = matcher[3] || '';
        const openingFullTag = `<%${openingTag}`;
        const closingFullTag = `${closingTag}%>`;
        const formattedExpression = format(expression, { ...options, parser: 'ruby' })
          .trim()
          .split(/\r?\n/)
          .map((s) => [s, hardline])
          .reduce((acc, val) => acc.concat(val)) // .flat() isn't supported by node 10
          .slice(0, -1); // remove last hardline

        token.content = group(
          concat([openingFullTag, indent(concat([hardline, concat(formattedExpression)])), hardline, closingFullTag])
        );
      }

      return token;
    });
};

module.exports = formatMultilineExpressions;
