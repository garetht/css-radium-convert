var postcss = require('postcss'),
    R = require('ramda'),
    selectorParser = require('../utils/selectorParser'),
    Immutable = require('seamless-immutable');

var nodes = postcss.parse(`
  .something {
    hello: 2;
  }

  .something .otherthing {
    hello: 3;
  }
`).toResult().root.nodes;


R.reduce(function(acc, next) {
  console.log(next.selector)
}, Immutable({}), R.filter(n => n.type === 'rule', nodes));


// Basically: create a data structure with
// Map<string, Array<Map<string, string>>>
// -> -> transform to Map<string, string|number>
