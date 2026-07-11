const express = require('express');
const apictl = require('../controllers/api');
const apiRouter = express.Router();

apiRouter.post('/getuser', apictl.getUser);
apiRouter.post('/getusername', apictl.getUserName);
apiRouter.post('/getcstation', apictl.getCStation);
apiRouter.post('/getctype', apictl.getCtype);
apiRouter.post('/citiesall', apictl.getAllCities);
apiRouter.post('/cityidfromname', apictl.getCityIDFromName);
apiRouter.post('/citylatlong', apictl.getLatLongFromName);
apiRouter.post('/allcs', apictl.getAllCS);
apiRouter.post('/allcsports', apictl.getAllCSPorts);
apiRouter.post('/cport', apictl.getCPort);
apiRouter.post('/allctypes', apictl.getAllCTypes);
apiRouter.post('/alluservehicles', apictl.getAllUserVehicles);
apiRouter.post('/search', apictl.search);
apiRouter.post('/getwallet', apictl.getWallet);
apiRouter.post('/rechargewallet', apictl.rechargeWallet);
apiRouter.post('/getbookings', apictl.getBookings);
apiRouter.post('/addbooking', apictl.addBooking);
apiRouter.post('/cancelbooking', apictl.cancelBooking);
apiRouter.post('/startsession', apictl.startChargingSession);
apiRouter.post('/stopsession', apictl.stopChargingSession);
apiRouter.post('/activesession', apictl.getActiveSession);

module.exports = apiRouter; 