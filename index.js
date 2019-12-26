const http = require ('http');
const S = require ('sanctuary');
const $ = require ('sanctuary-def');
const routes = require ('./state/routes');
const errorHandler = require ('./handlers/error');

const getRouteString = req => `${S.prop ('method') (req)} ${S.prop ('url') (req)}`;
const getRouteFnFromRouteString = routeString => S.get (S.is ($.AnyFunction)) (routeString) (routes);

const getRouteHandler = S.pipe ([
  getRouteString,
  getRouteFnFromRouteString,
  S.maybeToEither (404)
]);

const handleRequest = (req, res) =>
  S.either
    (errorHandler (req) (res))
    (handlerFn => handlerFn (req) (res))
    (getRouteHandler (req));

const server = http.createServer (handleRequest);
server.listen (3000);
console.log ('Server listening on port 3000');
