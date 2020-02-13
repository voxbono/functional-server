const http = require ('http');
const Future = require ('fluture');
const $ = require ('sanctuary-def');
const S = require ('./lib/sanctuary');
const { matchComponent, parseRequestBody, parseRequestQuery } = require ('./helpers/requestData');
const { JSONResponse, JSON405Response } = require ('./types/Responses');

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
//             -> StrMap String
//             -> Handler
//             -> Future Void Response
const getResponse =  url => headers => body =>  params => handler => {
  switch (handler.method) {
    case 'GET':
      return handler.handler (
        {
          headers,
          params,
          query: parseRequestQuery (url)
        });
    case 'POST':
      return handler.handler (
        {
          headers,
          params,
          body: parseRequestBody (handler.type) (S.value ('content-type') (headers)) (body),
          query: parseRequestQuery (url)
        });
      case 'PUT':
        return handler.handler (
          {
            headers,
            params,
            body: parseRequestBody (handler.type) (S.value ('content-type') (headers)) (body),
            query: parseRequestQuery (url)
          });
  }
};


// getRouteHandlerFuture :: [Pair [Component] [Handler]]
//                       -> Pair NodeRequest String
//                       -> Maybe (Future Void Response)
const getRouteHandlerFuture =  routes => ([req, body]) => {
  const urlArray = getUrlArray (req.url);
  return S.fromMaybe
    (Future.resolve (JSONResponse (404) (S.Nothing)))
    (S.reduce (maybeFutureResponse => ([components, handlers]) =>
                S.maybe_ (() => components.length === urlArray.length
                            ? S.map
                                (captures => S.maybe (Future.resolve (JSON405Response (handlers)))
                                                     (getResponse (req.url)
                                                                  (req.headers)
                                                                  (body)
                                                                  (captures))
                                                     (S.find (h => h.method === req.method) (handlers)))
                                (S.map (S.reduce (S.concat) ({}))
                                       (S.sequence (S.Maybe) (S.zipWith (matchComponent)
                                                                        (components)
                                                                        (urlArray))))
                            : S.Nothing)
                          (S.Just)
                          (maybeFutureResponse))
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

module.exports = {
  $,
  S,
  Future,
  handleRequest
};
