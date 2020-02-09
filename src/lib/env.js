const fst = require ('fluture-sanctuary-types');
const $ = require ('sanctuary-def');
const Handler = require ('../types/Handler/Handler.type');

module.exports = $.env.concat (fst.env.concat ([Handler]));
