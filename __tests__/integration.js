/* eslint no-undef: 0 */
/* eslint node/no-unpublished-require: 0 */
const request = require ('supertest');
const { handleRequest } = require ('../src/server');
const routes = require ('../example/routes');
const users = require ('../example/state/users');

describe ('Integration tests', () => {
  test ('Invalid route', () =>
    request (handleRequest (routes))
    .get ('/silly')
    .then (res => {
      expect (res.error.status).toBe (404);
    }));

  test ('Index route', () =>
    request (handleRequest (routes))
    .get ('/')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual ({ 'a': 'b' });
    }));

  test ('Users route', () =>
    request (handleRequest (routes))
    .get ('/users')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual (users);
    }));

  test ('Add user', () =>
    request (handleRequest (routes))
    .post ('/users/add')
    .set ('Content-Type', 'application/json')
    .set ('Accept', 'applicaton/json')
    .send ({ id: 1, name: 'Jonas', email: 'test@test.com' })
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual ({ id: 1, name: 'Jonas', email: 'test@test.com' });
    }));

  test ('Get existing user', () =>
    request (handleRequest (routes))
    .get ('/users/1')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual (users.find (user => user.id === 1));
    }));

  test ('Get non-existing user', () =>
    request (handleRequest (routes))
    .get ('/users/5')
    .set ('Accept', 'application/json')
    .then (res => {
      expect (res.error.status).toBe (404);
    }));

  test ('Get existing users with query', () =>
    request (handleRequest (routes))
    .get ('/users/query?id=1&id=2')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual (users.filter (user => user.id === 1 || user.id === 2));
    }));

  test ('Get non-existing users with query', () =>
    request (handleRequest (routes))
    .get ('/users/query?something=1&somethingElse=hey')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual ([{}]);
    }));

  test ('Get empty query', () =>
    request (handleRequest (routes))
    .get ('/users/query')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual ([{}]);
    }));

  test ('Get query', () =>
    request (handleRequest (routes))
    .get ('/querytest?foo=foo&bar=bar')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual ({ foo: ['foo'], bar: ['bar'] });
    }));

  test ('Get query with equal names', () =>
    request (handleRequest (routes))
    .get ('/querytest?foo=foo&foo=bar&baz=baz')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual ({ foo: ['foo', 'bar'], baz: ['baz'] });
    }));

  test ('Body query and params in one json request', () =>
    request (handleRequest (routes))
    .post ('/querytest/1/Peter?foo=foo/&foo=bar&baz=baz')
    .send ({ a: '%3/æøå' })
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual ({
        a: '%3/æøå',
        baz: ['baz'],
        foo: ['foo/', 'bar'],
        id: '1',
        name: 'Peter'
      });
    }));

  test ('Body query and params in one application/x-www-form-urlencoded request', () =>
    request (handleRequest (routes))
    .post ('/querytest/1/Peter?foo=foo/&foo=bar&baz=baz')
    .send ({ a: '%3/æøå' })
    .set ('Content-Type', 'application/x-www-form-urlencoded')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual ({
        a: ['%253%2F%C3%A6%C3%B8%C3%A5'],
        baz: ['baz'],
        foo: ['foo/', 'bar'],
        id: '1',
        name: 'Peter'
      });
    }));
  test ('Login with authorization header', () =>
    request (handleRequest (routes))
    .get ('/querytest/login')
    .set ('Authorization', 'password')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual ({ user: 'User 1' });
    })
  );
  test ('Login without authorization header', () =>
    request (handleRequest (routes))
    .get ('/querytest/login')
    .then (res => {
      expect (res.status).toBe (401);
    })
  );
  test ('Login with wrong authorization header', () =>
    request (handleRequest (routes))
    .get ('/querytest/login')
    .set ('Authorization', 'wrongpassword')
    .then (res => {
      expect (res.status).toBe (401);
    })
  );
  test ('Login with authorization header', () =>
    request (handleRequest (routes))
    .get ('/querytest/login')
    .set ('Authorization', 'password')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual ({ user: 'User 1' });
    })
  );
  test ('HTML response', () =>
    request (handleRequest (routes))
    .get ('/querytest/gethtml')
    .set ('Accept', 'text/html')
    .then (res => {
      expect (res.status).toBe (200);
    })
  );
  test ('Router with no handler', () =>
    request (handleRequest (routes))
    .get ('/nohandler')
    .then (res => {
      expect (res.status).toBe (405);
    })
  );
  test ('Non exisiting method', () =>
    request (handleRequest (routes))
    .delete ('/users')
    .then (res => {
      expect (res.headers.allow).toEqual ('GET');
      expect (res.status).toBe (405);
    })
  );
});
