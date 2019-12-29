const http = require ('http');
const S = require ('./lib/sanctuary');
const Future = require ('fluture');
const routes = require ('./state/routes');
const { matchComponent } = require ('./types/types');

// getRouteData :: Array (Pair (Array Component) (StrMap (StrMap String -> Future Void Resonse)))
//              -> String
//              -> Array String
//              -> Maybe (Future Void Resonse)
const getRouteData = routes => method => urlArray =>
  S.reduce (maybeHandler => ([components, routeHandler]) =>
              S.maybe_ (() => components.length === urlArray.length
                              ? S.ap (S.value (method) (routeHandler))
                                     (S.map (S.reduce (S.concat) ({}))
                                            (S.sequence (S.Maybe)
                                                        (S.zipWith (matchComponent)
                                                                   (components)
                                                                   (urlArray))))
                              : S.Nothing)
                      (S.Just)
                      (maybeHandler))
           (S.Nothing)
           (routes);

// routeHandler :: NodeRequest -> Future Void Response
const routeHandler = req =>
  S.pipe
    ([
      S.prop ('url'),
      S.splitOn ('/'),
      S.reject (S.equals ('')),
      getRouteData (routes) (req.method),
      S.fromMaybe (Future.resolve ({ statusCode: 404, body: S.Nothing }))
    ])
    (req);

// handleRequest :: (Request req, Response res) => (req, res) -> Future Response
const handleRequest = (req, res) =>
  Future.fork
    (code => {
      console.log ('OMG! This should not happen');
      res.writeHead (500);
      res.end (JSON.stringify (http.STATUS_CODES[500]));
    })
    (({ statusCode, body }) => {
      res.writeHead (statusCode);
      S.maybe_ (() => res.end ()) (s => res.end (s)) (body);
    })
    (routeHandler (req));

const server = http.createServer (handleRequest);
server.listen (3000);
console.log ('Server listening on port 3000');
