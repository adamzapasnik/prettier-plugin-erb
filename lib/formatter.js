const { concat, indent, hardline, group, line } = require('prettier').doc.builders;
const { printDocToString } = require('prettier').doc.printer;

const formatMultilineExpressions = (tokens, options, embedTextToDoc) => {
  return tokens
    .map((token) => ({ ...token }))
    .map((token) => {
      // TODO: currently doesn't support multiline block opening expressions
      if (token.type === 'plain') {
        const matcher = token.content.match(/<%(#=|#-|-#|=|#|-)?([\S\s]*?)\s*(-)?%>/m);
        const openingTag = matcher[1] || '';
        const expression = matcher[2];
        const closingTag = matcher[3] || '';
        const openingFullTag = `<%${openingTag}`;
        const closingFullTag = `${closingTag}%>`;
        let formatRaw = openingTag.includes('#');
        let formattedExpression = expression;

        try {
          if (!formatRaw) {
            formattedExpression = embedTextToDoc(expression, { ...options, parser: 'ruby' });
            formattedExpression.parts.pop(); // removes newline at the end
          }
        } catch (error) {
          formatRaw = true;
        }

        if (formatRaw && formattedExpression.trim().match(/\r?\n/)) {
          let indentedLines = expression.split(/\r?\n/);

          // The first line isn't empty. `<% smt`
          if (indentedLines[0] && indentedLines[0].trim()) {
            indentedLines = indentedLines.slice(1);
          }

          const spacesNumber = indentedLines
            .filter((s) => s)
            .map((s) => s.match(/^\s+/))
            .map((s) => (s === null ? 0 : s[0].length));

          const minSpacesNumber = Math.min(...spacesNumber);
          const spaces = ' '.repeat(minSpacesNumber);

          formattedExpression = formattedExpression
            .split(/\r?\n/)
            .map((s) => (s ? s.replace(new RegExp(`^${spaces}`), '') : s))
            .join('\n');
        }

        if (typeof formattedExpression === 'string' && formattedExpression.trim().match(/\r?\n/)) {
          const formattedMultilineExpression = formattedExpression
            .trim()
            .split(/\r?\n/)
            .map((s) => [s, hardline])
            .reduce((acc, val) => acc.concat(val)) // .flat() isn't supported by node 10
            .slice(0, -1); // remove last hardline

          token.content = group(
            concat([
              openingFullTag,
              indent(concat([hardline, concat(formattedMultilineExpression)])),
              hardline,
              closingFullTag,
            ])
          );
        } else if (typeof formattedExpression === 'object') {
          token.content = group(
            concat([openingFullTag, indent(concat([line, formattedExpression])), line, closingFullTag])
          );
        } else {
          token.content = group(concat([openingFullTag, ' ', formattedExpression.trim(), ' ', closingFullTag]));
        }

        // prettier-html-templates can't handle objects in this case, only strings
        // TODO: multiline strings aren't formatted correctly, it'd be nice if we could pass the object
        // maybe it will be achievable with 2.3 prettier compability
        if (
          (token.inElement || token.inElementWithoutNeedToEncode || token.inScript) &&
          typeof token.content === 'object'
        ) {
          const { formatted } = printDocToString(token.content, { ...options });
          token.content = formatted;
        }
      }

      return token;
    });
};

module.exports = formatMultilineExpressions;
