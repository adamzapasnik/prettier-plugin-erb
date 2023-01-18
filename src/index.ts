import parser from './parser';
import printers from './printers';

const configuration = {
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

export default configuration;
