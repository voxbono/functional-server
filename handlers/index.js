// :: req -> res -> http response
module.exports = req => res => res.end (JSON.stringify ({ a: 'b' }));
