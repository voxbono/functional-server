const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const { JSONResponse, HTMLResponse } = require ('../types/Responses');

const queryTest = ({ query }) =>
  S.maybe (Future.resolve (JSONResponse (401) (S.Nothing)))
          (q => Future.resolve (JSONResponse (200) (S.Just (q))))
          (query);

const bodyQueryParamTest = ({ params, body, query }) =>
  S.fromMaybe
    (Future.resolve (JSONResponse (422) (S.Nothing)))
    (S.lift2 (b => q =>  Future.resolve (JSONResponse (200) (S.Just ({ ...b, ...q, ...params }))))
             (query)
             (body));

const loginTest = ({ user }) => Future.resolve (JSONResponse (200) (S.Just ({ user })));

const htmlTest = _ =>
  Future.resolve (HTMLResponse (200) (S.Just ('<head><title>Some Title</title><head><body><div>Here is a div</div></body>')));

module.exports = {
  queryTest,
  bodyQueryParamTest,
  loginTest,
  htmlTest
};
