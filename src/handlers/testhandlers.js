const Future = require ('fluture');
const S = require ('../lib/sanctuary');

const queryTest = ({ query }) =>
  Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (query)) });

const bodyQueryParamTest = ({ body, query, params }) =>
  Future.resolve ({
    statusCode: 200,
    body: S.Just (JSON.stringify (S.concat (body) (S.concat (query) (params))))
  });

module.exports = {
  queryTest,
  bodyQueryParamTest
};
