const $ = require ('sanctuary-def');

const checkTypes = require ('./checkTypes');
const env = require ('./env');

module.exports = $.create ({ checkTypes, env });
