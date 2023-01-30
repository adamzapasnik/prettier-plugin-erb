import { tokenizeHTML } from 'prettier-html-templates';
import { expressionTypeMatcher } from './expression_type_matcher';

export default {
  parse: (text: string) => tokenizeHTML(text, /<%[\s\S]*?%>/gm, expressionTypeMatcher),
  astFormat: 'erb-ast',
};
