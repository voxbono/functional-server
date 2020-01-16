const S = require ('../lib/sanctuary');

const queryTest = body => params => query =>
  ({ statusCode: 200, body: S.Just (JSON.stringify (query)) });

const bodyQueryParamTest = body => params => query => ({
  statusCode: 200,
  body: S.Just (JSON.stringify (S.concat (body) (S.concat (query) (params))))
});

module.exports = {
  queryTest,
  bodyQueryParamTest
};
