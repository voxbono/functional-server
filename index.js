const http = require ('http');
const S = require ('sanctuary');
const $ = require ('sanctuary-def');
const routes = require ('./state/routes');
const url = require ('url');

// getRouteString :: Object -> String
const getRouteString = req =>
  `${S.prop ('method') (req)} ${S.prop ('url') (req)}`;

// getHandlerFnFromRouteString :: String -> Maybe Function
const getHandlerFnFromRouteString = routeString =>
 S.get (S.is ($.AnyFunction)) (routeString) (routes);

// getRouteHandler :: Object -> Either Int Function
const getRouteHandler = S.pipe ([
  getRouteString,
  getHandlerFnFromRouteString,
  S.map (handlerFn => handlerFn ()),
  S.maybeToEither (404)
]);


// handleRequest :: (req, res) -> http response
const handleRequest = (req, res) =>
  S.either
    (code => {
      res.writeHead (code);
      res.end (JSON.stringify (http.STATUS_CODES[code]));
    })
    (data => {
      res.writeHead (200);
      res.end (JSON.stringify (data));
    })
    (getRouteHandler (req));

const server = http.createServer (handleRequest);
server.listen (3000);
console.log ('Server listening on port 3000');
