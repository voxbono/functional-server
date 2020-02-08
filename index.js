const http = require ('http');
const { handleRequest } = require ('./src/server');
const routes = require ('./example/routes');

const server = http.createServer (handleRequest (routes));
server.listen (3000);
console.log ('Server listening on port 3000');
