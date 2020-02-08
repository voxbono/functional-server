const http = require ('http');
const Future = require ('fluture');
const $ = require ('sanctuary-def');
const S = require ('./lib/sanctuary');
const { matchComponent, parseRequestBody, parseRequestQuery } = require ('./helpers/requestData');
const routes = require ('./routes');
const { JSONResponse } = require ('./types/Responses');

// getUrlArray :: String -> Array String
const getUrlArray = S.pipe ([
  S.splitOn ('?'),
  S.head,
  S.fromMaybe (''),
  S.splitOn ('/'),
  S.reject (S.equals (''))
]);


// getResponse :: String
//             -> String
//             -> Maybe Sring
//             -> Object
//             -> StrMap String
//             -> Future Void Response
const getResponse =  url => headers => body => routeData => params =>
  S.maybe (Future.reject ('Handler missing for route'))
          (handler =>
            handler (
              {
                headers,
                params,
                body: parseRequestBody (S.get (S.is ($.Type)) ('body') (routeData))
                                       (S.value ('content-type') (headers)) (body),
                query: parseRequestQuery (url)
              }))
          (S.get (S.is ($.AnyFunction)) ('handler') (routeData));


// getRouteHandlerFuture :: [Pair [Component] (StrMap Object)]
//                       -> Pair NodeRequest String
//                       -> Future Void Response
const getRouteHandlerFuture =  routes => ([req, body]) => {
  const urlArray = getUrlArray (req.url);
  return S.fromMaybe (Future.resolve (JSONResponse (404) (S.Nothing)))
                     (S.reduce (maybeResponseHandler => ([components, routesData]) =>
                                  S.maybe_ (() => components.length === urlArray.length
                                              ? S.lift2 (getResponse (req.url) (req.headers) (body))
                                                        (S.value (req.method) (routesData))
                                                        (S.map (S.reduce (S.concat) ({}))
                                                               (S.sequence (S.Maybe)
                                                                           (S.zipWith (matchComponent)
                                                                                      (components)
                                                                                      (urlArray))))
                                              : S.Nothing)
                                           (S.Just)
                                           (maybeResponseHandler))
                               (S.Nothing)
                               (routes));
};


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
            Future.fork (err => {
                          console.log (err);
                          res.writeHead (500);
                          res.end (JSON.stringify (http.STATUS_CODES[500]));
                        })
                        (({ statusCode, body, headers }) => {
                          res.statusCode = statusCode;
                          S.keys (headers).forEach (key => res.setHeader (key, headers[key]));
                          res.setHeader ('X-Powered-By', 'functional-server');
                          S.maybe_ (() => res.end ()) (s => res.end (s)) (body);
                        })
        ])
        (collectRequestData (req));

module.exports = handleRequest (routes);
