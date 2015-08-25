/*
Utilities to determine the nesting level of
 */

var nodeUtils = require('./nodeUtils'),
    enums = require('./enums'),
    R = require('ramda');

module.exports = {
  /**
   * The parsedSelector allows us to determine pseudo-nestings
   * like those from pseudoselectors.
   *
   * The parsedParent allows us to determine actual nestings,
   * such as those from media queries and other at-rules.
   */
  determineNesting(parsedSelectorNodes, parsedParent) {
    var pseudoSelector = R.head(nodeUtils.retrieve(enums.SELECTOR_TYPES.PSEUDOSELECTOR)(parsedSelectorNodes));
    if (pseudoSelector) {
      return pseudoSelector.value;
    }

    if (parsedParent.type === enums.NODE_TYPES.AT_RULE) {
      return `@${parsedParent.name} ${parsedParent.params}`;
    }

    return null;
  }
};
