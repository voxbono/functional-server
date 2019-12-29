const http = require ('http');
const S = require ('./lib/sanctuary');
const $ = require ('sanctuary-def');
const Future = require ('fluture');
const routes = require ('./state/routes');
const { matchComponent } = require ('./types/types');

const maybeToFuture = x => S.maybe (Future.reject (x)) (Future.resolve);

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
              S.ap (S.get (S.is ($.AnyFunction)) (method) (routeHandler))
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
  maybeToFuture (404)
]) (req);

// handleRequest :: (req, res) -> Future http response
const handleRequest = (req, res) =>
  Future.fork
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
