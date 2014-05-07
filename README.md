# PoCreate

PoCreate lets you incrementally update your .po files as you develop by merging
new translations into existing .po files.

[![build status](https://secure.travis-ci.org/plemarquand/pocreate.png)](http://travis-ci.org/plemarquand/pocreate)

If a key is found in the source tree that doesn't exist in one or more of the supplied .po files, the key is added with
with a blank `msgstr`. Translators can then be supplied with the updated .po files and fill in the blank `msgstr` entries.

## Installation

This module is installed via npm:

``` bash
$ npm install pocreate
```

## Example Usage

``` js
var src = {'file1.js': 'gettext("hello")'};
var pos = {'english.po': '...'};

var pocreate = require('pocreate');
var updatedPos = pocreate.parse(src, pos);
```

## Dependencies

PoCreate depends on two great modules, [jsxgettext](https://github.com/plemarquand/jsxgettext) and
[gettext-parser](https://github.com/andris9/gettext-parser).

Currently it relies on a forked version of jsxgettext which adds pluralization and multiline contextual comments for
translators.
