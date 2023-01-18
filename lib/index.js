import parser from './parser';
import printers from './printers';
var configuration = {
    defaultOptions: {},
    parsers: {
        erb: parser,
    },
    printers: printers,
    languages: [
        {
            name: 'html-erb',
            parsers: ['erb'],
            extensions: ['.html.erb'],
        },
    ],
};
export default configuration;
//# sourceMappingURL=index.js.map