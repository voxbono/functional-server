const S = require ('../lib/sanctuary');

const JSONResponse = statusCode => JSONResponse_ (statusCode) ({});

const JSONResponse_ = statusCode => headers => maybeData => ({
  statusCode,
  body: S.map (data => JSON.stringify (data)) (maybeData),
  headers: S.concat (headers) ({
    'Content-Type': 'application/json; charset=utf-8'
  })
});

const HTMLResponse = statusCode => maybeData => ({
  statusCode,
  body: maybeData,
  headers: {
    'Content-Type': 'text/html; charset=utf-8'
  }
});

module.exports = {
  JSONResponse,
  JSONResponse_,
  HTMLResponse
};
