import parser from './parser';
import printers from './printers';

export default {
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
