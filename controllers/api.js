const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../models/users');
const ApiResponse = require('../models/ApiResponse');
const admModel = require('../models/admin');
const csModel = require('../models/cstations');
const cpModel = require('../models/cports');
const ctModel = require('../models/ctypes');
const cityModel = require('../models/cities');
const vModel = require('../models/vehicles');

function ValParam(param) {
    if(param === null || param === undefined || param === "")
        return false;
    else return true;
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

const getAllCities = (req, res) => {
    var resp = new ApiResponse();
    var prm = cityModel.getAll();
    prm.then(onfulfilled = (r) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(r);
    });
};

const getCityIDFromName = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if (ValParam(form.cityname)) {
        var prm = cityModel.getCityIDFromName(form.cityname);
        prm.then(onfulfilled = (r) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(r);
        });
    }
    else {
        resp.code = 1;
        resp.message = "One or more parameters missing or invalid to this API endpoint.";
        resp.data = null;

        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getUser = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) { 
                resp.code = 14;
                resp.message = "API not available without login session. Details: " + err.message;
                resp.data = err.stack;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = form.userid;
                if(ValParam(uid)) {
                    var prm = userModel.getSecure(uid);
                    prm.then(onfulfilled = (value) => {
                        if(value === null) {
                            resp.code = 2;
                            resp.message = "Server returned null. Seems there is no user with this user id.";
                            resp.data = null;

                            res.setHeader('Content-Type', 'application/json');
                            res.send(resp);
                        }
                        else {
                            resp.code = 0;
                            resp.message = 'ok';
                            resp.data = value;

                            res.setHeader('Content-Type', 'application/json');
                            res.send(resp);
                        }
                    }, onrejected = (err) => {
                        resp.code = 15;
                        resp.message = err.message;
                        resp.data = err.stack;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    });
                }
                else {
                    resp.code = 1;
                    resp.message = 'One or more parameters missing. Check the API docs.';
                    resp.data = null;

                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getUserName = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) { 
                resp.code = 14;
                resp.message = "API not available without login session. Details: " + err.message;
                resp.data = err.stack;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.userId;
                if(ValParam(uid)) {
                    var prm = userModel.getSecure(uid);
                    prm.then(onfulfilled = (value) => {
                        if(value === null) {
                            resp.code = 2;
                            resp.message = "Server returned null. Seems there is no user with this user id.";
                            resp.data = null;

                            res.setHeader('Content-Type', 'application/json');
                            res.send(resp);
                        }
                        else {
                            resp.code = 0;
                            resp.message = 'ok';
                            resp.data = value.user_name;

                            res.setHeader('Content-Type', 'application/json');
                            res.send(resp);
                        }
                    }, onrejected = (err) => {
                        resp.code = 15;
                        resp.message = err.message;
                        resp.data = err.stack;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    });
                }
                else {
                    resp.code = 1;
                    resp.message = 'One or more parameters missing. Check the API docs.';
                    resp.data = null;

                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getCStation = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) { 
                resp.code = 14;
                resp.message = "API not available without login session. Details: " + err.message;
                resp.data = err.stack;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                if(typeof decoded.AdmId !== 'undefined') {
                    var csid = form.csid;
                    if(ValParam(csid)) {
                        var prm = csModel.get(csid);
                        prm.then(onfulfilled = (value) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(value);
                        }, onrejected = (err) => {
                            resp.code = 15;
                            resp.message = err.message;
                            resp.data = err.stack;

                            res.setHeader('Content-Type', 'application/json');
                            res.send(resp);
                        });
                    }
                    else {
                        resp.code = 1;
                        resp.message = 'One or more parameters missing. Check the API docs.';
                        resp.data = null;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    }
                }
                else {
                    resp.code = 13;
                    resp.message = "API not available for non-admin users.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getCtype = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) { 
                resp.code = 14;
                resp.message = "API not available without login session. Details: " + err.message;
                resp.data = err.stack;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                if(typeof decoded.AdmId !== 'undefined') {                    
                    var ctid = form.ctid;
                    if(ValParam(ctid)) {
                        var prm = ctModel.get(ctid);
                        prm.then(onfulfilled = (value) => {
                            if(value === null) {
                                resp.code = 2;
                                resp.message = "Server returned null. Seems there is no charger type with this charger type id.";
                                resp.data = null;

                                res.setHeader('Content-Type', 'application/json');
                                res.send(resp);
                            }
                            else {
                                resp.code = 0;
                                resp.message = 'ok';
                                resp.data = value;

                                res.setHeader('Content-Type', 'application/json');
                                res.send(resp);
                            }
                        }, onrejected = (err) => {
                            resp.code = 15;
                            resp.message = err.message;
                            resp.data = err.stack;

                            res.setHeader('Content-Type', 'application/json');
                            res.send(resp);
                        });
                    }
                    else {
                        resp.code = 1;
                        resp.message = 'One or more parameters missing. Check the API docs.';
                        resp.data = null;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    }
                }
                else {
                    resp.code = 13;
                    resp.message = "API not available for non-admin users.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
}

const getLatLongFromName = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;
    
    if(ValParam(form.city)) {
        var prm = cityModel.getLatLongFromName(form.city);
        prm.then(onfulfilled = (r) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(r);
        });
    }
    else {
        resp.code = 1;
        resp.message = 'One or more parameters missing. Check the API docs.';
        resp.data = null;

        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
}

const getAllCS = (req, res) => {
    var resp = new ApiResponse();
    var prm = csModel.getAll();
    prm.then(onfulfilled = (r) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(r);
    });
};

const getAllCSPorts = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;
    
    if(ValParam(form.csid)) {
        var prm = cpModel.getAll(form.csid);
        prm.then(onfulfilled = (r) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(r);
        });
    }
    else {
        resp.code = 1;
        resp.message = 'One or more parameters missing. Check the API docs.';
        resp.data = null;

        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getCPort = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;
    
    if(ValParam(form.cpid)) {
        var prm = cpModel.get(form.cpid);
        prm.then(onfulfilled = (r) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(r);
        });
    }
    else {
        resp.code = 1;
        resp.message = 'One or more parameters missing. Check the API docs.';
        resp.data = null;

        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getAllCTypes = (req, res) => {
    var resp = new ApiResponse();
    var prm = ctModel.getAll();
    prm.then(onfulfilled = (r) => {
        resp.code = 0;
        resp.message = 'ok';
        resp.data = r;

        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    });
};

const getAllUserVehicles = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) { 
                resp.code = 14;
                resp.message = "API not available without login session. Details: " + err.message;
                resp.data = err.stack;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.userId;
                if(ValParam(uid)) {
                    var prm = vModel.getAll(uid);
                    prm.then(onfulfilled = (r) => {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(r);
                    });
                }
                else {
                    resp.code = 1;
                    resp.message = 'Login token missing relevant info.';
                    resp.data = null;

                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};
//calculating distance codes
const search = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;
    
    if(ValParam(form.vid) && ValParam(form.loc)) {
        var vehicle = form.vid;
        var latlong = JSON.parse(form.loc);

        var prm = vModel.get(vehicle);
        prm.then(onfulfilled = (r) => {
            if(r.code === 0) {
                var ctid = r.data.chargetype_id;
                var prm1 = csModel.search(ctid);
                prm1.then(onfulfilled = (r1) => {
                    if(r1.code === 0) {
                        var stations = r1.data;
                        if(Array.isArray(stations) && stations.length > 0) {
                            var results = [];
                            for(var i = 0; i < stations.length; i++) {
                                var row = stations[i];
                                var dist = calcCrow(latlong.lat, latlong.lng, row.chargingstation_lat, row.chargingstation_lng);
                                row.distance = dist;
                                console.log(row);
                                if(dist <= 10.0) {
                                    results.push(row)
                                }
                            }

                            resp.code = 0;
                            resp.message = 'ok';
                            resp.data = results;

                            res.setHeader('Content-Type', 'application/json');
                            res.send(resp);     
                        }
                        else {
                            resp.code = 51;
                            resp.message = "Empty result.";
                            resp,data = null;

                            res.setHeader('Content-Type', 'application/json');
                            res.send(resp);
                        }
                    }
                    else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(r1);
                    }
                });
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(r);
            }
        });
    }
    else {
        resp.code = 1;
        resp.message = 'One or more parameters missing. Check the API docs.';
        resp.data = null;

        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

module.exports = {
    getUser,
    getUserName,
    getCStation,
    getCtype,
    getAllCities,
    getCityIDFromName,
    getLatLongFromName,
    getAllCS,
    getAllCSPorts,
    getCPort,
    getAllCTypes,
    getAllUserVehicles,
    search
};