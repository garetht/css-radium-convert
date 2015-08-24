var postcss = require('postcss'),
    R = require('ramda'),
    selectorParser = require('../utils/selectorParser'),
    Immutable = require('seamless-immutable'),
    camelcase = require('camelcase'),
    enums = require('../utils/enums'),

    nodeUtils = require('../utils/nodeUtils');

var util = require('util');

var orEmptyArray = R.defaultTo([]);

var reduceRules = R.reduce(function(acc, next) {
      var firstClassNodeRetriever = R.compose(R.head, nodeUtils.retrieve(enums.SELECTOR_TYPES.CLASS)),
          firstClassNode = firstClassNodeRetriever(selectorParser(next.selector).nodes[0].nodes),
          firstClassName = camelcase(firstClassNode.value);
      return R.assoc(firstClassName,
                     R.append(nodeUtils.retrieveParsedDeclarations(next.nodes),
                              orEmptyArray(acc[firstClassName])),
                     acc);
    }, {});


module.exports = R.compose(reduceRules, nodeUtils.retrieve(enums.NODE_TYPES.RULE));

// Basically: create a data structure with
// Map<string, Array<Map<string, string>>>
// -> -> transform to Map<string, string|number>
