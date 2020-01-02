const S = require ('../lib/sanctuary');
const Future = require ('fluture');

// :: {} -> Future Void Response
module.exports = () =>
  Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify ({ a: 'b' })) });
