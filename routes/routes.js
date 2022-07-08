const auth_routes = require('./auth_route');
const product_routes = require('./product_route');
const method_not_allowed = require('../middleware/blocked_verbs');

module.exports = (server) => {
    //console.log(server)
    server.use('/api/v1/auth', auth_routes);
    server.use('/api/v1/all', product_routes);
}