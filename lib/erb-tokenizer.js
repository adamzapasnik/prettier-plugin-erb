const getLastIndexOfRegexp = (string, regexp) => {
  const match = string.match(new RegExp(regexp, 'mg'));

  return match ? string.lastIndexOf(match[match.length - 1]) : -1;
};

const isWithinElement = (htmlBeforeExpression, element) => {
  const regexp = new RegExp(`<${element}[\\s\\S]*?>`);

  return getLastIndexOfRegexp(htmlBeforeExpression, regexp) > htmlBeforeExpression.lastIndexOf(`</${element}>`);
};

const isInAttribute = (html) => {
  const beginning = html.lastIndexOf('="') + 1;
  if (beginning === 0) return false;

  return beginning >= html.lastIndexOf('"');
};

const tokenizeHTML = (text) => {
  const closedTags = text.match(/<\/\w+>/gm);
  const uniqueClosedTags = new Set(closedTags);
  // TODO: possibly replace with isPreLikeNode or something :thinking:
  const rawElementsInText = [
    'pre',
    'code',
    'samp',
    'kbd',
    'var',
    'ruby',
    'noscript',
    'canvas',
    'style',
    'title',
    'textarea'
  ].filter((tag) => uniqueClosedTags.has(`</${tag}>`));

  // Example: <%[\s\S]*?%>/gm;
  const regexp = new RegExp(/<%[\s\S]*?%>/, 'gm');

  const tokens = [];
  let cursorPosition = 0;
  let html = '';
  // Used to detect if expression is in attribute
  // <meta name="apple-itunes-app" content="app-id=<%= apple_id %>" />
  let htmlWithPlaceholders = '';

  text.replace(regexp, (match, offset) => {
    // when two expressions are next to each other <% %><% %>
    // we don't want to create an empty text tag
    if (cursorPosition !== offset) {
      const string = text.slice(cursorPosition, offset);
      tokens.push({ type: 'text', content: string });
      html += string;
      // 'e' is added as an expression replacement to make isInAttribute work
      // Without: `class="` returns false
      // With: `class="e` returns true
      htmlWithPlaceholders += string + 'e';
    }
    cursorPosition = offset + match.length;

    // const lastTokenType = tokens.length && tokens[tokens.length - 1].type;

    // const beforeWhitespace = /\s/.test(text[offset + match.length]);
    // const afterWhitespace = lastTokenType === 'start' || (lastTokenType === 'text' && /\s/.test(html[html.length - 1]));

    // const beforeInlineEndTag = /^<\/\w+(?<!address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|li|main|nav|noscript|ol|p|pre|section|table|tfoot|thead|tbody|ul|video|tr|td|th|button)\s*>/.test(
    //   text.slice(offset + match.length)
    // );
    // const afterInlineEndTag =
    //   lastTokenType === 'text' &&
    //   (html.endsWith('/>') || // TODO: FIX THIS meaning <img > instead of <img />
    //     /<\/\w+(?<!address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|li|main|nav|noscript|ol|p|pre|section|table|tfoot|thead|tbody|ul|video|tr|td|th|button)\s*>$/.test(
    //       html
    //     ));

    const inElement = html.lastIndexOf('<') > html.lastIndexOf('>') || isInAttribute(htmlWithPlaceholders);
    const inComment = html.lastIndexOf('<!--') > html.lastIndexOf('-->');

    let type;
    if (/<%-?\s*(if|unless)\s[\s\S]*?end\s*-?%>/.test(match)) {
      type = 'plain';
    } else if (/<%-?\s*(if|unless|case)\s/.test(match) || /<%[^#][\S\s]*(\sdo|\|)\s*-?%>/.test(match)) {
      type = 'start';
    } else if (/<%-?\s*end\s*-?%>/.test(match)) {
      type = 'end';
    } else if (/<%-?\s*else\s*-?%>/.test(match) || /<%-?\s*(elsif|when)\s/.test(match)) {
      type = 'middle';
    } else {
      type = 'plain';
    }

    tokens.push({
      type,
      content: match,
      // afterWhitespace,
      // beforeWhitespace,
      // beforeInlineEndTag,
      // afterInlineEndTag,
      inElement,
      inScript: isWithinElement(html, 'script'),
      inComment: inComment,
      inElementWithoutNeedToEncode:
        !inElement && !inComment && rawElementsInText.find((tag) => isWithinElement(html, tag)),
    });
  });

  if (cursorPosition !== text.length) {
    tokens.push({ type: 'text', content: text.slice(cursorPosition) });
  }

  return tokens;
};

module.exports = tokenizeHTML;
