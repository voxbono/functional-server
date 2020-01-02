const S = require ('sanctuary');

const checkTypes = require ('./checkTypes');
const env = require ('./env');

module.exports = S.create ({ checkTypes, env });
