const http = require ('http');
const S = require ('sanctuary');
const $ = require ('sanctuary-def');
const routes = require ('./state/routes');
const errorHandler = require ('./handlers/error');

// getRouteString :: Object -> String
const getRouteString = req =>
  `${S.prop ('method') (req)} ${S.prop ('url') (req)}`;

// getRouteHandlerFromRouteString :: String -> Maybe Function
const getRouteHandlerFromRouteString = routeString =>
 S.get (S.is ($.AnyFunction)) (routeString) (routes);

// getRouteHandler :: Object -> Either Int Function
const getRouteHandler = S.pipe ([
  getRouteString,
  getRouteHandlerFromRouteString,
  S.maybeToEither (404)
]);

// handleRequest :: (req, res) -> http response
const handleRequest = (req, res) =>
  S.either
    (errorHandler (req) (res))
    (handlerFn => handlerFn (req) (res))
    (getRouteHandler (req));

const server = http.createServer (handleRequest);
server.listen (3000);
console.log ('Server listening on port 3000');
