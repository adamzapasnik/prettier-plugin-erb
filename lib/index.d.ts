declare const configuration: {
    defaultOptions: {};
    parsers: {
        erb: {
            parse: (text: string) => Promise<any>;
            astFormat: string;
        };
    };
    printers: {
        'erb-ast': {
            embed: (path: any, options: any) => (textToDoc: any) => Promise<void>;
            print: (path: any, options: any, _print: any) => string | any[] | import("prettier").doc.builders.Align | import("prettier").doc.builders.BreakParent | import("prettier").doc.builders.Concat | import("prettier").doc.builders.Cursor | import("prettier").doc.builders.Fill | import("prettier").doc.builders.Group | import("prettier").doc.builders.IfBreak | import("prettier").doc.builders.Indent | import("prettier").doc.builders.IndentIfBreak | import("prettier").doc.builders.Label | import("prettier").doc.builders.Line | import("prettier").doc.builders.LineSuffix | import("prettier").doc.builders.LineSuffixBoundary | import("prettier").doc.builders.Trim;
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