const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const { JSONResponse } = require ('../types/Responses');

// :: {} -> Future Void Response
module.exports = _ =>
  Future.resolve (JSONResponse (200) (S.Just ({ a: 'b' })));
