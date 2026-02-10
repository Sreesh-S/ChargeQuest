const express = require('express');
const admctl = require('../controllers/admin');
const admRoute = express.Router();

admRoute.get('/login', admctl.getLogin);
admRoute.post('/login', admctl.postLogin);
admRoute.get('/index', admctl.getAdminIndex);
admRoute.get('/users', admctl.getAdminUsers);
admRoute.post('/users', admctl.postAdminUsers);
admRoute.get('/cstations', admctl.getAdminCStations);
admRoute.post('/cstations', admctl.postAdminCStations);
admRoute.get('/cports', admctl.getAdminCPorts);
admRoute.post('/cports', admctl.postAdminCPorts);
admRoute.get('/ctypes', admctl.getAdminCtypes);
admRoute.post('/ctypes', admctl.postAdminCtypes);
admRoute.get('/logout', admctl.logout);
admRoute.post('/logout', admctl.logout);

module.exports = admRoute;