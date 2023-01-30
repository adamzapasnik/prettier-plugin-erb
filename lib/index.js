"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = __importDefault(require("./parser"));
var printers_1 = __importDefault(require("./printers"));
var configuration = {
    defaultOptions: {},
    parsers: {
        erb: parser_1.default,
    },
    printers: printers_1.default,
    languages: [
        {
            name: 'html-erb',
            parsers: ['erb'],
            extensions: ['.html.erb'],
        },
    ],
};
exports.default = configuration;
//# sourceMappingURL=index.js.map