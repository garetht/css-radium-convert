var postcss = require('postcss'),
    R = require('ramda'),
    selectorParser = require('../utils/selectorParser'),
    Immutable = require('seamless-immutable'),
    camelcase = require('camelcase'),
    enums = require('../utils/enums'),

    nesting = require('../utils/nestingUtils'),
    nodeUtils = require('../utils/nodeUtils');

var orEmptyObject = R.defaultTo({});

var extractRules = R.reduce(function reducer(acc, next) {
  if (next.type === enums.NODE_TYPES.AT_RULE) {
    return R.reduce(reducer, acc, next.nodes);
  }

  var firstClassNodeRetriever = R.compose(
        R.head, nodeUtils.retrieve(enums.SELECTOR_TYPES.CLASS)),
      selectorNodes = selectorParser(next.selector).nodes[0].nodes,
      firstClassNode = firstClassNodeRetriever(selectorNodes),
      firstClassName = camelcase(firstClassNode.value);

  return R.append({
    selector: firstClassName,
    properties: nodeUtils.retrieveParsedDeclarations(next.nodes),
    nesting: nesting.determineNesting(selectorNodes, next.parent)
  }, acc);

}, []);

var combineRules = R.reduce(function(acc, [nextKey, nextValue]) {
  var reduced = R.reduce(function(acc, next) {
    if (next.nesting) {
      return R.assoc(next.nesting, next.properties, acc);
    } else {
      return R.merge(acc, next.properties);
    }
  }, {}, nextValue);
  return R.assoc(nextKey, reduced, acc);
}, {});

module.exports = R.compose(
  combineRules,
  R.toPairs,
  R.groupBy(rule => rule.selector),
  extractRules,
  nodeUtils.retrieve(enums.NODE_TYPES.RULE, enums.NODE_TYPES.AT_RULE)
);

// Basically: create a data structure with
// Map<string, Array<Map<string, string>>>
// -> -> transform to Map<string, string|number>
