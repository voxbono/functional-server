const S = require ('../lib/sanctuary');

// :: {} -> Future Void Response
module.exports = body => params => query =>
  ({ statusCode: 200, body: S.Just (JSON.stringify ({ a: 'b' })) });
