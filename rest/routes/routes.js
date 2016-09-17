// *Requiring express router:
const router = require('express').Router();

// *Requiring routes:
const auth = require('./auth.js');
const users = require('./users.js');

const authorization = require('../middlewares/authorization');


router.get('/auth', auth.validate);
router.post('/auth', auth.login);


router.get('/api/v1/users', users.retrieveAll);
router.get('/api/v1/users/:id', users.retrieve);
router.post('/api/v1/users', authorization('create-user'), users.create);
router.put('/api/v1/users/:id', users.update);
router.delete('/api/v1/users/:id', users.delete);
