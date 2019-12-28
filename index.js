const http = require ('http');
const S = require ('sanctuary');
const routes = require ('./state/routes');
const { matchComponent } = require ('./types/types');

const getRouteHandler = routeArray =>
   S.reduce
    (
      acc => ([route, handler]) =>
        S.equals (route.length) (routeArray.length) && S.isNothing (acc)
          ? S.pipe
            ([
              S.zip (route),
              S.ap ([S.pair (matchComponent)]),
              S.sequence (S.Maybe),
              S.map (S.reduce (acc => curr => ({ ...acc, ...curr })) ({})),
              S.map (data => handler (data))
            ])
            (routeArray)
          : acc
    )
    (S.Nothing)
    (routes);

const routeHandler = S.pipe ([
  req => req.url,
  S.splitOn ('/'),
  S.reject (S.equals ('')),
  getRouteHandler,
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
    (routeHandler (req));

const server = http.createServer (handleRequest);
server.listen (3000);
console.log ('Server listening on port 3000');
