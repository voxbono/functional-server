const http = require ('http');
const S = require ('sanctuary');
const $ = require ('sanctuary-def');
const routes = require ('./state/routes');
const { matchComponent } = require ('./types/types');

const getRouteHandler = method => S.get (S.is ($.AnyFunction)) (method);

const getRouteData = method => routeArray =>
   S.reduce
    (
      maybeHandler => ([route, routeHandler]) =>
        S.equals (route.length) (routeArray.length) && S.isNothing (maybeHandler)
          ? S.pipe
            ([
              S.zip (route),
              S.ap ([S.pair (matchComponent)]),
              S.sequence (S.Maybe),
              S.map (S.reduce (S.concat) ({})),
              S.ap (getRouteHandler (method) (routeHandler))
            ])
            (routeArray)
          : maybeHandler
    )
    (S.Nothing)
    (routes);

const routeHandler = req => S.pipe ([
  req => req.url,
  S.splitOn ('/'),
  S.reject (S.equals ('')),
  getRouteData (req.method),
  S.maybeToEither (404)
]) (req);

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
    (routeHandler (req));

const server = http.createServer (handleRequest);
server.listen (3000);
console.log ('Server listening on port 3000');
