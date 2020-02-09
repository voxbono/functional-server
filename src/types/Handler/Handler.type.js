const $ = require ('sanctuary-def');
const type = require ('sanctuary-type-identifiers');

module.exports = $.NullaryType
  ('Handler')
  ('https://github.com/voxbono/functional-server#Handler')
  ([])
  (x => type (x) === 'functional-server/Handler@1');
