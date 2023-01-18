"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressionTypeMatcher = void 0;
var expressionTypeMatcher = function (expression) {
    var type;
    if (/<%-?\s*(if|unless)\s[\s\S]*?end\s*-?%>/.test(expression)) {
        type = 'plain';
    }
    else if (/<%-?\s*(if|unless|case)\s/.test(expression) || /<%[^#][\S\s]*(\sdo|\|)\s*-?%>/.test(expression)) {
        type = 'start';
    }
    else if (/<%-?\s*end\s*-?%>/.test(expression)) {
        type = 'end';
    }
    else if (/<%-?\s*else\s*-?%>/.test(expression) || /<%-?\s*(elsif|when)\s/.test(expression)) {
        type = 'middle';
    }
    else {
        type = 'plain';
    }
    return { type: type };
};
exports.expressionTypeMatcher = expressionTypeMatcher;
//# sourceMappingURL=expression_type_matcher.js.map