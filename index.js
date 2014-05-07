var _ = require('lodash');
var poParser = require('gettext-parser');
var jsParser = require('jsxgettext');
var deepDiff = require('deep-diff');

module.exports = function () {

  function inspect(arg) {
    return require('util').inspect(arg, {depth:10});
  }

  function transformMap(fn) {
    return function(memo, val, key) {
      memo[key] = fn(val);
      return memo;
    };
  }

  return {
    parse: function(poFiles, sourceFiles, options) {

      if(!poFiles) {
        throw new Error('First argument should be a map to po files' +
          'The key is the filename and the value is the po file contents.');
      }

      if(!sourceFiles) {
        throw new Error('Second argument should be a map to source files.' +
          'The key is the filename and the value is the source code.');
      }

      options = options || {};

      // Convert the (filename, poString) structure into (filename, poJSON).
      var existingPos = _.reduce(poFiles, transformMap(poParser.po.parse), {});

      // Parses the map of source files and creates a poJSON structure.
      var srcPo = poParser.po.parse(jsParser.generate(sourceFiles, options));

      //TODO: extract
      _.each(existingPos, function(existing) {
        var lhs = existing.translations[''];
        var rhs = srcPo.translations[''];
        deepDiff.observableDiff(lhs, rhs, function(diff) {
          // Differences between the msgid parsed from source (an empty string) and those
          // already in a po file (added by translator) are expected to be different.
          if(_.contains(diff.path, 'msgstr')) return;

          // Encountered a new tr() key in the source that isn't in the PO file.
          if(diff.kind === 'N') {
            deepDiff.applyChange(lhs, rhs, diff);
          }
        });
      });

      // Recompile the updated JSON PO structure into a .po file.
      // TODO: I'd like to use `transformMap` but the toString is problematic.
      return _.reduce(existingPos, function(memo, po, key) {
        memo[key] = poParser.po.compile(po).toString();
        return memo;
      }, {});
    }
  };
};
