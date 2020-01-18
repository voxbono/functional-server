const http = require ('http');
const Future = require ('fluture');
const S = require ('./lib/sanctuary');
const { matchComponent } = require ('./helpers/requestData');
const routes = require ('./routes');

// Handler :: a -> StrMap String -> StrMap String -> Object Response
// partiallyGetResponse :: string -> Maybe String -> String -> StrMap Sring-> Future Void Response
// Route::  Pair [Component] (StrMap (Maybe (Type a) -> Handler -> partiallyGetResponse))
// getRouteHandlerFuture :: [Route]
//                       -> Pair NodeRequest String
//                       -> Future Void Response
const getRouteHandlerFuture =  routes => ([req, body]) => {
  const urlArray = getUrlArray (req.url);
  return S.fromMaybe (Future.resolve ({ statusCode: 404, body: S.Nothing }))
                     (S.reduce (maybeResponseHandler => ([components, routeResponseHandlers]) =>
                                  S.maybe_ (() => components.length === urlArray.length
                                                ? S.lift2 (responseHandler => responseHandler
                                                                        (req.url)
                                                                        (req.headers)
                                                                        (body))
                                                          (S.value (req.method)
                                                                   (routeResponseHandlers))
                                                          (S.map (S.reduce (S.concat) ({}))
                                                                 (S.sequence
                                                                    (S.Maybe)
                                                                    (S.zipWith (matchComponent)
                                                                              (components)
                                                                              (urlArray))))
                                                : S.Nothing)
                                           (S.Just)
                                           (maybeResponseHandler))
                               (S.Nothing)
                               (routes));
};

// getUrlArray :: String -> Array String
const getUrlArray = S.pipe ([
  S.splitOn ('?'),
  S.head,
  S.fromMaybe (''),
  S.splitOn ('/'),
  S.reject (S.equals (''))
]);


// --------------------------- IMPURE--------------------------------------------

// collectRequestData :: NodeRequest -> Future Void (Pair NodeRequest String)
const collectRequestData = req => Future ((reject, resolve) => {
  const body = [];
  req.on ('data', chunk => {
    body.push (chunk);
  });
  req.on ('end', () => {
    const dataString = Buffer.concat (body).toString ();
    resolve (S.Pair (req) (dataString));
  });
  req.on ('error', err => {
    resolve (S.Pair (req) (''));
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
            S.chain (getRouteHandlerFuture (routes)),
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
