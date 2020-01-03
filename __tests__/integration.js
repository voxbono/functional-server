/* eslint no-undef: 0 */
/* eslint node/no-unpublished-require: 0 */
const http = require ('http');
const axios = require ('axios');
const handleRequest = require ('../src/server');
const users = require ('../src/state/users');
const S = require ('../src/lib/sanctuary');
const Future = require ('fluture');
const { Literal, Capture } = require ('../src/lib/types');

const routes = [
  S.Pair ([])
         ({ GET: () =>
          Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify ({ a: 'b' })) }) }),
  S.Pair ([Literal ('users')])
         ({ GET: () =>
          Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (users)) }) }),
  S.Pair ([Literal ('users'), Literal ('add')])
         ({ POST: ({ body, query }) =>
          Future.resolve ({
            statusCode: 200,
            body: S.Just (JSON.stringify (S.concat (body) (query)))
          }) }),
  S.Pair ([Literal ('users'), Capture ('id')])
         ({ GET: ({ params }) =>
            S.maybe (Future.resolve ({ statusCode: 404, body: S.Nothing }))
                    (user =>
                      Future.resolve ({ statusCode: 200, body: S.Just (JSON.stringify (user)) }))
                    (S.chain (id => S.find (user => id  === user.id) (users))
                             (S.parseInt (10) (params.id))) }),
  S.Pair ([Literal ('withquery')])
         ({ GET: ({ query }) =>
          Future.resolve ({
            statusCode: 200,
            body: S.Just (JSON.stringify (query))
          }) }),
];
let server;

const rootRoute = 'http://localhost:3001';

beforeAll (done => {
  server = http.createServer (handleRequest (routes));
  server.listen (3001, null, done);
});

afterAll (done => {
  server.close (done);
});

test ('Invalid route', () => axios.get (`${rootRoute}/silly`).then (res => {
  fail ('We shuld not end here');
}).catch (err => {
  expect (err.response.status).toBe (404);
}));

test ('Index route', () => axios.get (rootRoute).then (res => {
  expect (res.data).toEqual ({ 'a': 'b' });
}));

test ('Users route', () => axios.get (`${rootRoute}/users`).then (res => {
  expect (res.status).toBe (200);
  expect (res.data).toEqual (users);
}));

test ('Add user',
  () => axios.post (`${rootRoute}/users/add`, { id: 1, name: 'Jonas' })
  .then (res => {
    expect (res.data).toEqual ({ id: 1, name: 'Jonas' });
  })
);

test ('Get existing user',
  () => axios.get (`${rootRoute}/users/1`)
  .then (res => {
    expect (res.data).toEqual (users.find (user => user.id === 1));
  })
);

test ('Get non-existing user',
  () => axios.get (`${rootRoute}/users/5`)
  .then (res => {
    fail ('We shuld not end here');
  })
  .catch (err => {
    expect (err.response.status).toBe (404);
  })
);

test ('Get empty query',
  () => axios.get (`${rootRoute}/withquery`)
  .then (res => {
    expect (res.data).toEqual ({});
  })
);

test ('Get query',
  () => axios.get (`${rootRoute}/withquery?foo=foo&bar=bar`)
  .then (res => {
    expect (res.data).toEqual ({ foo: 'foo', bar: 'bar' });
  })
);

test ('Get query with equal names',
  () => axios.get (`${rootRoute}/withquery?foo=foo&foo=bar`)
  .then (res => {
    expect (res.data).toEqual ({ foo: ['foo', 'bar'] });
  })
);
