const S = require ('../lib/sanctuary');

const queryTest = headers => body => params => query =>
  ({ statusCode: 200, body: S.Just (JSON.stringify (query)) });

const bodyQueryParamTest = headers => body => params => query => ({
  statusCode: 200,
  body: S.Just (JSON.stringify (S.concat (body) (S.concat (query) (params))))
});

const loginTest = headers => body => params => query => user => ({
  statusCode: 200,
  body: S.Just (JSON.stringify ({ user }))
});

module.exports = {
  queryTest,
  bodyQueryParamTest,
  loginTest
};
