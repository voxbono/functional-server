const S = require ('../lib/sanctuary');

const _JSONResponse = statusCode => headers => maybeData => ({
  statusCode,
  body: S.map (data => JSON.stringify (data)) (maybeData),
  headers: S.concat (headers) ({
    'Content-Type': 'application/json; charset=utf-8'
  })
});

const JSONResponse = statusCode => _JSONResponse (statusCode) ({});

const JSON405Response = handlers =>
  _JSONResponse (405)
                ({ 'allow': S.joinWith
                              (', ')
                              (S.map (S.prop ('method'))
                                     (handlers)) })
                (S.Nothing);

const HTMLResponse = statusCode => maybeData => ({
  statusCode,
  body: maybeData,
  headers: {
    'Content-Type': 'text/html; charset=utf-8'
  }
});

module.exports = {
  JSON405Response,
  JSONResponse,
  HTMLResponse
};
