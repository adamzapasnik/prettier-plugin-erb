var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import prettier from 'prettier';
var _a = prettier.doc.builders, indent = _a.indent, hardline = _a.hardline, group = _a.group, line = _a.line;
var printDocToString = prettier.doc.printer.printDocToString;
export var formatMultilineExpressions = function (tokens, options, embedTextToDoc) {
    return tokens
        .map(function (token) { return (__assign({}, token)); })
        .map(function (token) {
        // TODO: currently doesn't support multiline block opening expressions
        if (token.type === 'plain') {
            var matcher = token.content.match(/<%(#=|#-|-#|=|#|-)?([\S\s]*?)\s*(-)?%>/m);
            var openingTag = matcher[1] || '';
            var expression = matcher[2];
            var closingTag = matcher[3] || '';
            var openingFullTag = "<%".concat(openingTag);
            var closingFullTag = "".concat(closingTag, "%>");
            var formatRaw = openingTag.includes('#');
            var formattedExpression = expression;
            try {
                if (!formatRaw) {
                    formattedExpression = embedTextToDoc(expression, __assign(__assign({}, options), { parser: 'ruby' }));
                    formattedExpression.parts.pop(); // removes newline at the end
                }
            }
            catch (error) {
                formatRaw = true;
            }
            if (formatRaw && formattedExpression.trim().match(/\r?\n/)) {
                var indentedLines = expression.split(/\r?\n/);
                // The first line isn't empty. `<% smt`
                if (indentedLines[0] && indentedLines[0].trim()) {
                    indentedLines = indentedLines.slice(1);
                }
                var spacesNumber = indentedLines
                    .filter(function (s) { return s; })
                    .map(function (s) { return s.match(/^\s+/); })
                    .map(function (s) { return (s === null ? 0 : s[0].length); });
                var minSpacesNumber = Math.min.apply(Math, spacesNumber);
                var spaces_1 = ' '.repeat(minSpacesNumber);
                formattedExpression = formattedExpression
                    .split(/\r?\n/)
                    .map(function (s) { return (s ? s.replace(new RegExp("^".concat(spaces_1)), '') : s); })
                    .join('\n');
            }
            if (typeof formattedExpression === 'string' && formattedExpression.trim().match(/\r?\n/)) {
                var formattedMultilineExpression = formattedExpression
                    .trim()
                    .split(/\r?\n/)
                    .map(function (s) { return [s, hardline]; })
                    .reduce(function (acc, val) { return acc.concat(val); }) // .flat() isn't supported by node 10
                    .slice(0, -1); // remove last hardline
                token.content = group([
                    openingFullTag,
                    indent([hardline, formattedMultilineExpression]),
                    hardline,
                    closingFullTag,
                ]);
            }
            else if (typeof formattedExpression === 'object') {
                token.content = group([openingFullTag, indent([line, formattedExpression]), line, closingFullTag]);
            }
            else {
                token.content = group([openingFullTag, ' ', formattedExpression.trim(), ' ', closingFullTag]);
            }
            // prettier-html-templates can't handle objects in this case, only strings
            // TODO: multiline strings aren't formatted correctly, it'd be nice if we could pass the object
            // maybe it will be achievable with 2.3 prettier compability
            if ((token.inElement || token.inElementWithoutNeedToEncode || token.inScript) &&
                typeof token.content === 'object') {
                var formatted = printDocToString(token.content, __assign({}, options)).formatted;
                token.content = formatted;
            }
        }
        return token;
    });
};
//# sourceMappingURL=formatter.js.map