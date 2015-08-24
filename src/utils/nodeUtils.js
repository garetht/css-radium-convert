var R = require('ramda'),
    camelcase = require('camelcase'),
    enums = require('./enums');

var retrieve = function() {
      var args = Array.prototype.slice.call(arguments);
      return R.filter(function(node) {
        return R.contains(node.type, args);
      });
    },
    retrieveKeyValueDeclarations = function(node) {
      // Include more info about where this was declared
      // for more helpful debugging
      return {
        [camelcase(node.prop)]: node.value
      }
    },
    retrieveParsedDeclarations = R.compose(
      R.mergeAll, // replace with error if duplicates exist
      R.map(retrieveKeyValueDeclarations),
      retrieve(enums.NODE_TYPES.DECLARATION)
    );


module.exports = {
  retrieveParsedDeclarations: retrieveParsedDeclarations,
  retrieve: retrieve
};
