# Changelog

All notable changes to the prettier-plugin-erb will be documented in this file.

## Unreleased

### Features

- Format singleline expressions (block expressions aren't formatted)

### Bug fixes

- Return non 0 exit status when error formatting is unsuccessful
- Use `print` function instead of `embed` to fix error logging
- Fix formatting of files that consist of only a single expression
- Fix formatting of singline and multiline comments
- Specify prettier version to be lowar than 2.3

## v.0.1.0 - 7 February 2021

Initial release
