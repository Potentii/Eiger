// *Requiring express router:
const router = require('express').Router();

// *Requiring the authentication middleware:
const authentication = require('../middlewares/authentication');

// *Requiring the authorization module:
const authorization = require('../middlewares/authorization');

// *Requiring all the routes modules:
const api = require('./api');
const auth = require('./auth');
const schedules = require('./schedules');
const users = require('./users');
const users_schedules = require('./users-schedules');
const users_reservations = require('./users-reservations');
const vehicles = require('./vehicles');
const vehicles_schedules = require('./vehicles-schedules');
const vehicles_reservations = require('./vehicles-reservations');

// *Setting up the api routes:
router.get('/', api.echo);

// *Setting up the authentication routes:
router.get('/auth', authentication, auth.onAuthenticated);
router.post('/auth', auth.login);

// *Applying authentication on '/api/v1' route:
router.all('/api/v1/*', authentication);

// *Setting up the schedules routes:
router.get('/api/v1/schedules',           authorization('schedules'), schedules.retrieveAll);
router.get('/api/v1/schedules/:id',       authorization('schedules'), schedules.retrieve);
router.post('/api/v1/schedules',          authorization('schedules'), schedules.create);
router.put('/api/v1/schedules/:id',       authorization('schedules'), schedules.update);
router.delete('/api/v1/schedules/:id',    authorization('schedules'), schedules.erase);

// *Setting up the users routes:
router.get('/api/v1/users',         authorization('users'), users.retrieveAll);
router.get('/api/v1/users/:id',     authorization('users'), users.retrieve);
router.post('/api/v1/users',        authorization('users'), users.create);
router.put('/api/v1/users/:id',     authorization('users'), users.update);
router.delete('/api/v1/users/:id',  authorization('users'), users.erase);

// *Setting up the users-schedules routes:
router.get('/api/v1/users/:id/schedules', authorization('schedules'), users_schedules.retrieveAll);

// *Setting up the users-reservations routes:
router.get('/api/v1/users/:id/reservations',       authorization('schedules'), users_reservations.retrieveAll);
router.get('/api/v1/users/:id/reservations/:date', authorization('schedules'), users_reservations.retrieveAllOnDate);

// *Setting up the vehicles routes:
router.get('/api/v1/vehicles',         authorization('vehicles'), vehicles.retrieveAll);
router.get('/api/v1/vehicles/:id',     authorization('vehicles'), vehicles.retrieve);
router.post('/api/v1/vehicles',        authorization('vehicles'), vehicles.create);
router.put('/api/v1/vehicles/:id',     authorization('vehicles'), vehicles.update);
router.delete('/api/v1/vehicles/:id',  authorization('vehicles'), vehicles.erase);

// *Setting up the vehicles-schedules routes:
router.get('/api/v1/vehicles/:id/schedules', authorization('schedules'), vehicles_schedules.retrieveAll);

// *Setting up the vehicles-reservations routes:
router.get('/api/v1/vehicles/:id/reservations',       authorization('schedules'), vehicles_reservations.retrieveAll);
router.get('/api/v1/vehicles/:id/reservations/:date', authorization('schedules'), vehicles_reservations.retrieveAllOnDate);

// *Exporting the router:
module.exports = {
   router: router
};
