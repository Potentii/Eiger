// *Defining the media directories:
const MEDIA_DIR = '/media';
const VEHICLE_PHOTOS_DIR = MEDIA_DIR + '/v/p';
const USER_PHOTOS_DIR = MEDIA_DIR + '/u/p';

// *Requiring express, and its router:
const express = require('express');
const router = express.Router();

// *Requiring the directory module:
const directory = require('../dir/directory');

// *Creating the media directory:
directory.create([MEDIA_DIR, VEHICLE_PHOTOS_DIR, USER_PHOTOS_DIR]);

// *Defining the media directory path:
let media_path = directory.getAppDirectory() + '/' + directory.APP_NAME + MEDIA_DIR + '/';
// *Serving the media service:
router.use('/', express.static(media_path));

// *Exporting the router:
module.exports = {
   router: router,
   media_path: media_path
};
