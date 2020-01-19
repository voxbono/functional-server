const Future = require ('fluture');
const S = require ('../lib/sanctuary');

// :: {} -> Future Void Response
module.exports = _ =>
  Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify ({ a: 'b' })) });
