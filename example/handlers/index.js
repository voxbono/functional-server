const { S, Future } = require ('../../src/server');
const { JSONResponse } = require ('../../src/types/Responses');

// :: {} -> Future Void Response
module.exports = _ =>
  Future.resolve (JSONResponse (200) (S.Just ({ a: 'b' })));
