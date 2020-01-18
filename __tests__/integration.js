/* eslint no-undef: 0 */
/* eslint node/no-unpublished-require: 0 */
const request = require ('supertest');
const app = require ('../src/server');
const users = require ('../src/state/users');

describe ('Trying out some stuff', () => {
  test ('Invalid route', () =>
    request (app)
    .get ('/silly')
    .then (res => {
      expect (res.error.status).toBe (404);
    }));

  test ('Index route', () =>
    request (app)
    .get ('/')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual ({ 'a': 'b' });
    }));

  test ('Users route', () =>
    request (app)
    .get ('/users')
    .then (res => {
      expect (res.status).toBe (200);
      expect (res.body).toEqual (users);
    }));

  test ('Add user', () =>
    request (app)
    .post ('/users/add')
    .set ('Content-Type', 'application/json')
    .set ('Accept', 'applicaton/json')
    .send ({ id: 1, name: 'Jonas', email: 'test@test.com' })
    .then (res => {
      expect (res.body).toEqual ({ id: 1, name: 'Jonas', email: 'test@test.com' });
    }));

  test ('Get existing user', () =>
    request (app)
    .get ('/users/1')
    .then (res => {
      expect (res.body).toEqual (users.find (user => user.id === 1));
    }));

  test ('Get non-existing user', () =>
    request (app)
    .get ('/users/5')
    .then (res => {
      expect (res.error.status).toBe (404);
    }));

  test ('Get existing users with query', () =>
    request (app)
    .get ('/users/query?id=1&id=2')
    .then (res => {
      expect (res.body).toEqual (users.filter (user => user.id === 1 || user.id === 2));
    }));

  test ('Get non-existing users with query', () =>
    request (app)
    .get ('/users/query?something=1&somethingElse=hey')
    .then (res => {
      expect (res.body).toEqual ([{}]);
    }));

  test ('Get empty query', () =>
    request (app)
    .get ('/users/query')
    .then (res => {
      expect (res.body).toEqual ([{}]);
    }));

  test ('Get query', () =>
    request (app)
    .get ('/querytest?foo=foo&bar=bar')
    .then (res => {
      expect (res.body).toEqual ({ foo: ['foo'], bar: ['bar'] });
    }));

  test ('Get query with equal names', () =>
    request (app)
    .get ('/querytest?foo=foo&foo=bar&baz=baz')
    .then (res => {
      expect (res.body).toEqual ({ foo: ['foo', 'bar'], baz: ['baz'] });
    }));

  test ('Body query and params in one json request', () =>
    request (app)
    .post ('/querytest/1/Peter?foo=foo/&foo=bar&baz=baz')
    .send ({ a: '%3/æøå' })
    .then (res => {
      expect (res.body).toEqual ({
        a: '%3/æøå',
        baz: ['baz'],
        foo: ['foo/', 'bar'],
        id: '1',
        name: 'Peter'
      });
    }));

  test ('Body query and params in one application/x-www-form-urlencoded request', () =>
    request (app)
    .post ('/querytest/1/Peter?foo=foo/&foo=bar&baz=baz')
    .send ({ a: '%3/æøå' })
    .set ('Content-Type', 'application/x-www-form-urlencoded')
    .then (res => {
      expect (res.body).toEqual ({
        a: ['%253%2F%C3%A6%C3%B8%C3%A5'],
        baz: ['baz'],
        foo: ['foo/', 'bar'],
        id: '1',
        name: 'Peter'
      });
    }));
  test ('Login with authorization header', () =>
    request (app)
    .get ('/querytest/login')
    .set ('Authorization', 'password')
    .then (res => {
      expect (res.body).toEqual ({ user: 'User 1' });
    })
  );
  test ('Login without authorization header', () =>
    request (app)
    .get ('/querytest/login')
    .then (res => {
      expect (res.status).toBe (401);
    })
  );
  test ('Login with wrong authorization header', () =>
    request (app)
    .get ('/querytest/login')
    .set ('Authorization', 'wrongpassword')
    .then (res => {
      expect (res.status).toBe (401);
    })
  );
  test ('Login with authorization header', () =>
    request (app)
    .get ('/querytest/login')
    .set ('Authorization', 'password')
    .then (res => {
      expect (res.body).toEqual ({ user: 'User 1' });
    })
  );
});
