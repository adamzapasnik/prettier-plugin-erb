const parser = require('./parser');
const printers = require('./printers');

module.exports = {
  defaultOptions: {},
  parsers: {
    erb: parser,
  },
  printers,
  languages: [
    {
      name: 'html-erb',
      parsers: ['erb'],
      extensions: ['.html.erb'],
    },
  ],
};
