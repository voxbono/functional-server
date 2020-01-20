/* eslint no-undef: 0 */

const S = require ('../src/lib/sanctuary');
const $ = require ('sanctuary-def');
const { parseRequestBody, parseRequestQuery } = require ('../src/helpers/requestData');

test ('No queries', () => {
  expect (parseRequestQuery ('')).toEqual (S.Nothing);
});

test ('Single query', () => {
  expect (parseRequestQuery ('?foo=bar')).toEqual (S.Just ({ foo: ['bar'] }));
});

test ('Multiple queries', () => {
  expect (parseRequestQuery ('?foo=bar&a=b')).toEqual (S.Just ({ foo: ['bar'], a: ['b'] }));
});

test ('Query with same name', () => {
  expect (parseRequestQuery ('?foo=bar&foo=baz')).toEqual (S.Just ({ foo: ['bar', 'baz'] }));
});

test ('Weird query', () => {
  expect (parseRequestQuery ('?foo=&foo=baz=a&=test&=='))
  .toEqual (S.Just ({ '': ['test', '', ''], 'foo': ['', 'baz', 'a'] }));
});

// test ('Request body application/x-www-form-urlencoded', () => {
// const result = parseRequestBody (S.Just ($.Any)) (S.Just ('application/x-www-form-urlencoded')) ('%7B%09id%3A%201%2C%09name%3A%20%22Jonas%22%2C%20email%3A%20%22test%40test.com%22%7D=');
// expect (result).toEqual (S.Just ({ 'a': '%3/æøå' }));
// });

test ('Request body application/json', () => {
  const result = parseRequestBody (S.Just ($.Any)) (S.Just ('application/json')) ('{"a":"%3/æøå"}');
  expect (result).toEqual (S.Just ({ 'a': '%3/æøå' }));
});

test ('Request body no content-type', () => {
  const result = parseRequestBody (S.Just ($.Any)) (S.Nothing) ('{"a":"%3/æøå"}');
  expect (result).toEqual (S.Nothing);
});

test ('Request body wrong content-type', () => {
  const result = parseRequestBody (S.Just ($.Any)) (S.Just ('foo')) ('{"a":"%3/æøå"}');
  expect (result).toEqual (S.Nothing);
});
