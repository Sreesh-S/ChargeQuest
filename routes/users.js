const express = require('express');
const userctl = require('../controllers/users');
const userRoute = express.Router();

userRoute.get('/login', userctl.getUserLogin);
userRoute.post('/login', userctl.postUserLogin);
userRoute.get('/signup', userctl.getUserSignup);
userRoute.post('/signup', userctl.postUserSignup);
userRoute.get('/index', userctl.getUserIndex);
userRoute.get('/vehicles', userctl.getUserVehicles);
userRoute.post('/vehicles', userctl.postUserVehicles);
userRoute.get('/logout', userctl.logout);

module.exports = userRoute;