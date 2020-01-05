/* eslint no-undef: 0 */

const S = require ('../src/lib/sanctuary');
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

test ('Request body application/json', () => {
  const result = parseRequestBody ('application/json') ('{"a":"%3/æøå"}');
  expect (result).toEqual (S.Just ({ 'a': '%3/æøå' }));
});
