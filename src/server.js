const http = require ('http');
const Future = require ('fluture');
const S = require ('./lib/sanctuary');
const { parseRequestBody,
        parseRequestQuery,
        matchComponent } = require ('./helpers/requestData');
const routes = require ('./routes');


// getRouteData :: Array (Pair (Array Component) (StrMap (StrMap String -> Future Void Resonse)))
//              -> String
//              -> Array String
//              -> {RequestBody, RequestQuery}
//              -> Maybe (Future Void Response)
const getRouteData = routes => method => reqData => urlArray =>
  S.reduce (maybeHandler => ([components, routeHandler]) =>
              S.maybe_ (() => components.length === urlArray.length
                              ? S.ap (S.value (method) (routeHandler))
                                     (S.map (params => ({ ...reqData, params }))
                                            (S.map (S.reduce (S.concat) ({}))
                                                   (S.sequence (S.Maybe)
                                                               (S.zipWith (matchComponent)
                                                                          (components)
                                                                          (urlArray)))))
                              : S.Nothing)
                       (S.Just)
                       (maybeHandler))
           (S.Nothing)
           (routes);

// getUrlArray :: String -> Array String
const getUrlArray = S.pipe ([
  S.splitOn ('?'),
  S.head,
  S.fromMaybe (''),
  S.splitOn ('/'),
  S.reject (S.equals (''))
]);


// routeHandler :: Array (Pair (Array Component) (StrMap (StrMap String -> Future Void Resonse)))
//              -> NodeRequestWithData
//              -> Future Void Response
const routeHandler = routes => req =>
  S.fromMaybe (Future.resolve ({ statusCode: 404, body: S.Nothing }))
              (getRouteData (routes)
                            (req.method)
                            ({ body: req.body, query: req.query })
                            (getUrlArray (req.url)));


// --------------------------- IMPURE--------------------------------------------

// collectRequestData :: NodeRequest -> Future Void ({NodeRequest, Maybe StrMap})
const collectRequestData = req => Future ((reject, resolve) => {
  const body = [];
  const header = req.headers['content-type'];
  req.on ('data', chunk => {
    body.push (chunk);
  });
  req.on ('end', () => {
    const dataString = Buffer.concat (body).toString ();
    resolve ({
       ...req,
       body: S.fromMaybe ({}) (parseRequestBody (header) (dataString)),
       query: S.fromMaybe ({}) (parseRequestQuery (req.url))
    });
  });
  req.on ('error', err => {
    resolve ({ ...req, body: S.Nothing });
  });
  return function onCancel() {
    req.off ('data');
    req.off ('end');
  };
});

// handleRequest :: Array (Pair (Array Component) (StrMap (StrMap String -> Future Void Resonse)))
//               ->(NodeRequest, NodeResponse)
//               -> Future NodeResponse
const handleRequest = routes =>  (req, res) =>
  S.pipe ([
            S.chain (routeHandler (routes)),
            Future.fork (_ => {
                          console.log ('OMG! This should not happen');
                          res.writeHead (500);
                          res.end (JSON.stringify (http.STATUS_CODES[500]));
                        })
                        (({ statusCode, body }) => {
                          res.statusCode = statusCode;
                          res.setHeader ('Content-Type', 'application/json');
                          S.maybe_ (() => res.end ()) (s => res.end (s)) (body);
                        })
        ])
        (collectRequestData (req));

module.exports = handleRequest (routes);
