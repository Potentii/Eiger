// *Requiring express router:
const router = require('express').Router();

// *Requiring the authorization module:
// const authorization = require('../middlewares/authorization');

// *Requiring all the routes modules:
const api = require('./api');
const auth = require('./auth');
const users = require('./users');


// *Setting up the api routes:
router.get('/', api.echo);

// *Setting up the authentication routes:
router.get('/auth', require('../middlewares/authentication'), auth.onAuthenticated);
router.post('/auth', auth.login);

// *Setting up the users routes:
router.get('/api/v1/users', users.retrieveAll);
router.get('/api/v1/users/:id', users.retrieve);
router.post('/api/v1/users', users.create);
router.put('/api/v1/users/:id', users.update);
router.delete('/api/v1/users/:id', users.erase);


// *Exporting the router:
module.exports = router;
