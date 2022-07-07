
/**
 * @description Override the default node js behavior when a route is visited with an un allowed http verb 
 * @param {*} req  incoming object
 * @param {*} res outgoing response
 */
const methodNotAllowed = (req, res) => {
    res.status(405).json({ message: 'This HTTP method is currently not supported on this route' });
}

module.exports = methodNotAllowed