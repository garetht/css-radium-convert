// Converts the PostCSS selector parsing interface into
// something more palatable

var selectorParser = require('postcss-selector-parser');

module.exports = function(selector) {
  var parsed;
  selectorParser(function(selectors) {
    parsed = selectors;
  }).process(selector);
  return parsed;
};
