const S = require ('../lib/sanctuary');

const JSONResponse = statusCode => maybeData => ({
  statusCode,
  body: S.map (data => JSON.stringify (data)) (maybeData)
});

module.exports = {
  JSONResponse
};
