import prettier from 'prettier';
declare function embed(path: any, options: any): (textToDoc: any) => Promise<void>;
declare function print(path: any, options: any, _print: any): string | any[] | prettier.doc.builders.Align | prettier.doc.builders.BreakParent | prettier.doc.builders.Concat | prettier.doc.builders.Cursor | prettier.doc.builders.Fill | prettier.doc.builders.Group | prettier.doc.builders.IfBreak | prettier.doc.builders.Indent | prettier.doc.builders.IndentIfBreak | prettier.doc.builders.Label | prettier.doc.builders.Line | prettier.doc.builders.LineSuffix | prettier.doc.builders.LineSuffixBoundary | prettier.doc.builders.Trim;
declare const _default: {
    'erb-ast': {
        embed: typeof embed;
        print: typeof print;
    };
};
export default _default;
//# sourceMappingURL=printers.d.ts.map