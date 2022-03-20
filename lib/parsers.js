"use strict";

module.exports = {
  get erb() {
    return require("./parser.js").parsers.erb;
  },
};
