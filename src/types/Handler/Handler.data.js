const handlerTypeIdentifier = 'functional-server/Handler@1';

exports.Get = handler => ({
  '@@type': handlerTypeIdentifier,
  'method': 'GET',
  handler
});
exports.Post = type => handler => ({
    '@@type': handlerTypeIdentifier,
    'method': 'POST',
    handler,
    type
});
exports.Put = type => handler => ({
  '@@type': handlerTypeIdentifier,
  'method': 'PUT',
  handler,
  type
});
exports.Delete = handler => ({
  '@@type': handlerTypeIdentifier,
  'method': 'DELETE',
  handler
});
