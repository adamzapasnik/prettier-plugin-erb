# Changelog

All notable changes to the prettier-plugin-erb will be documented in this file.

## v0.4.0 - 24 June 2021

### Bug fixes

- Fix `[object Object]`

## v0.3.0 - 3 June 2021

### Bug fixes

- Fix formatting of expressions inside elements

## v0.2.0 - 25 May 2021

### Features

- Format singleline expressions (block expressions aren't formatted)

### Bug fixes

- Return non 0 exit status when error formatting is unsuccessful
- Use `print` function instead of `embed` to fix error logging
- Fix formatting of files that consist of only a single expression
- Fix formatting of singline and multiline comments
- Specify prettier version to be lowar than 2.3

## v0.1.0 - 7 February 2021

Initial release
