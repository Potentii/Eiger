// *Requiring express router:
const router = require('express').Router();

// *Requiring the authentication middleware:
const authentication = require('../middlewares/authentication');

// *Requiring the authorization module:
// const authorization = require('../middlewares/authorization');

// *Requiring all the routes modules:
const api = require('./api');
const auth = require('./auth');
const schedules = require('./schedules');
const users = require('./users');
const users_schedules = require('./users-schedules');
const vehicles = require('./vehicles');
const vehicles_schedules = require('./vehicles-schedules');

// *Setting up the api routes:
router.get('/', api.echo);

// *Setting up the authentication routes:
router.get('/auth', authentication, auth.onAuthenticated);
router.post('/auth', auth.login);

// *Applying authentication on '/api/v1' route:
router.all('/api/v1/*', authentication);

// *Setting up the schedules routes:
router.get('/api/v1/schedules', schedules.retrieveAll);
router.get('/api/v1/schedules/:id', schedules.retrieve);
router.post('/api/v1/schedules', schedules.create);
router.put('/api/v1/schedules/:id', schedules.update);
router.delete('/api/v1/schedules/:id', schedules.erase);

// *Setting up the users routes:
router.get('/api/v1/users', users.retrieveAll);
router.get('/api/v1/users/:id', users.retrieve);
router.post('/api/v1/users', users.create);
router.put('/api/v1/users/:id', users.update);
router.delete('/api/v1/users/:id', users.erase);

// *Setting up the users-schedules routes:
router.get('/api/v1/users/:id/schedules', users_schedules.retrieveAll);

// *Setting up the vehicles routes:
router.get('/api/v1/vehicles', vehicles.retrieveAll);
router.get('/api/v1/vehicles/:id', vehicles.retrieve);
router.post('/api/v1/vehicles', vehicles.create);
router.put('/api/v1/vehicles/:id', vehicles.update);
router.delete('/api/v1/vehicles/:id', vehicles.erase);

// *Setting up the vehicles-schedules routes:
router.get('/api/v1/vehicles/:id/schedules', vehicles_schedules.retrieveAll);

// *Exporting the router:
module.exports = {
   router: router
};
