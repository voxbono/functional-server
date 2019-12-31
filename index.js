const http = require ('http');
const Future = require ('fluture');
const S = require ('./lib/sanctuary');
const routes = require ('./state/routes');
const { matchComponent } = require ('./types/types');
const parseRequestData = require ('./helpers/requestData');

// getRouteData :: Array (Pair (Array Component) (StrMap (StrMap String -> Future Void Resonse)))
//              -> String
//              -> Array String
//              -> Maybe StrMap
//              -> Maybe (Future Void Response)
const getRouteData = routes => method => reqBody => urlArray =>
  S.reduce (maybeHandler => ([components, routeHandler]) =>
              S.maybe_ (() => components.length === urlArray.length
                              ? S.ap (S.value (method) (routeHandler))
                                     (S.map (S.reduce (S.concat) ({ data: reqBody }))
                                            (S.sequence (S.Maybe)
                                                        (S.zipWith (matchComponent)
                                                                   (components)
                                                                   (urlArray))))
                              : S.Nothing)
                       (S.Just)
                       (maybeHandler))
           (S.Nothing)
           (routes);

// routeHandler :: NodeRequestWithData -> Future Void Response
const routeHandler = req =>
  S.fromMaybe (Future.resolve ({ statusCode: 404, body: S.Nothing }))
              (getRouteData (routes)
                            (req.method)
                            (req.body)
                            (S.reject (S.equals (''))
                                      (S.splitOn ('/') (req.url))));

// collectRequestData :: NodeRequest -> Future Void ({NodeRequest, Maybe StrMap})
const collectRequestData = req => Future ((reject, resolve) => {
  const body = [];
  const header = req.headers['content-type'];
  req.on ('data', chunk => {
    body.push (chunk);
  });
  req.on ('end', () => {
    const dataString = Buffer.concat (body).toString ();
    resolve ({ ...req, body: parseRequestData (header) (dataString) });
  });
  req.on ('error', err => {
    resolve ({ ...req, body: S.Nothing });
  });
  return function onCancel() {
    req.off ('data');
    req.off ('end');
  };
});

// handleRequest :: (NodeRequest, NodeResponse) -> Future NodeResponse
const handleRequest = (req, res) =>
  S.pipe ([
            S.chain (routeHandler),
            Future.fork (_ => {
                        console.log ('OMG! This should not happen');
                        res.writeHead (500);
                        res.end (JSON.stringify (http.STATUS_CODES[500]));
                        })
                        (({ statusCode, body }) => {
                          res.writeHead (statusCode);
                          S.maybe_ (() => res.end ()) (s => res.end (s)) (body);
                        })
        ])
        (collectRequestData (req));


const server = http.createServer (handleRequest);
server.listen (3000);
console.log ('Server listening on port 3000');
