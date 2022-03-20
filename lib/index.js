const parsers = require('./parsers');
const printer = require('./printer');

module.exports = {
  defaultOptions: {},
  parsers: parsers,
  printers: {
    erb: printer
  },
  languages: [
    {
      name: 'html-erb',
      parsers: ['erb'],
      extensions: ['.html.erb'],
    },
  ],
};
