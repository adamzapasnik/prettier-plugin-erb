declare const configuration: {
    defaultOptions: {};
    parsers: {
        erb: {
            parse: (text: string) => Promise<any[]>;
            astFormat: string;
        };
    };
    printers: {
        'erb-ast': {
            embed: (path: any, options: any) => (textToDoc: any) => Promise<void>;
            print: (path: any, options: any, _print: any) => any;
        };
    };
    languages: {
        name: string;
        parsers: string[];
        extensions: string[];
    }[];
};
export default configuration;
//# sourceMappingURL=index.d.ts.map