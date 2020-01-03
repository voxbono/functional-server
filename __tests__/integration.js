/* eslint no-undef: 0 */
/* eslint node/no-unpublished-require: 0 */
const http = require ('http');
const axios = require ('axios');
const handleRequest = require ('../src/server');
const users = require ('../src/state/users');
const routes = require ('../src/routes');

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

test ('Get existing user with query',
  () => axios.get (`${rootRoute}/users/query?id=1`)
  .then (res => {
    expect (res.data).toEqual (users.find (user => user.id === 1));
  })
);

test ('Get non-existing user with query',
  () => axios.get (`${rootRoute}/users/query?something=1&somethingElse=hey`)
  .then (res => {
    fail ('We shuld not end here');
  })
  .catch (err => {
    expect (err.response.status).toBe (404);
  })
);

test ('Get empty query',
  () => axios.get (`${rootRoute}/users/query`)
  .then (res => {
    fail ('We shuld not end here');
  })
  .catch (err => {
    expect (err.response.status).toBe (404);
  })
);


test ('Get query',
  () => axios.get (`${rootRoute}/querytest?foo=foo&bar=bar`)
  .then (res => {
    expect (res.data).toEqual ({ foo: 'foo', bar: 'bar' });
  })
);

test ('Get query with equal names',
  () => axios.get (`${rootRoute}/querytest?foo=foo&foo=bar&baz=baz`)
  .then (res => {
    expect (res.data).toEqual ({ foo: ['foo', 'bar'], baz: 'baz' });
  })
);

test ('Get body',
  () => axios.post (`${rootRoute}/users/add`, { id: 1, name: 'Jonas' })
  .then (res => {
    expect (res.data).toEqual ({ id: 1, name: 'Jonas' });
  })
);

test ('Body query and params in one request',
  () => axios.post (`${rootRoute}/querytest/1/Peter?foo=foo/&foo=bar&baz=baz`, { a: '%3/æøå' })
  .then (res => {
    expect (res.data).toEqual (
      { a: '%3/æøå',
        baz: 'baz',
        foo: ['foo/', 'bar'],
        id: '1',
        name: 'Peter'  });
      }
  )
);
