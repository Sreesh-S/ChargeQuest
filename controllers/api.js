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
        var latlong;
        try {
            latlong = JSON.parse(form.loc);
        } catch(e) {
            latlong = { lat: 9.5805097, lng: 76.537262 };
        }

        var prm = vModel.get(vehicle);
        prm.then(onfulfilled = (r) => {
            if(r.code === 0 && r.data) {
                var ctid = r.data.chargetype_id;
                var prm1 = csModel.search(ctid);
                prm1.then(onfulfilled = (r1) => {
                    if(r1.code === 0) {
                        var rawRows = r1.data;
                        
                        // Group by chargingstation_id
                        const stationsMap = new Map();
                        for (let row of rawRows) {
                            if (!stationsMap.has(row.chargingstation_id)) {
                                stationsMap.set(row.chargingstation_id, {
                                    chargingstation_id: row.chargingstation_id,
                                    chargingstation_name: row.chargingstation_name,
                                    chargingstation_lat: parseFloat(row.chargingstation_lat),
                                    chargingstation_lng: parseFloat(row.chargingstation_lng),
                                    chargingstation_status: row.chargingstation_status,
                                    ports: []
                                });
                            }
                            stationsMap.get(row.chargingstation_id).ports.push({
                                chargingport_id: row.chargingport_id,
                                chargingport_name: row.chargingport_name,
                                chargetype_id: row.chargetype_id,
                                chargetype_name: row.chargetype_name,
                                chargingport_status: row.chargingport_status
                            });
                        }

                        var results = [];
                        for (let station of stationsMap.values()) {
                            var dist = calcCrow(latlong.lat, latlong.lng, station.chargingstation_lat, station.chargingstation_lng);
                            station.distance = dist;

                            // Calculate ports breakdown
                            let totalPorts = station.ports.length;
                            let available = 0, occupied = 0, reserved = 0, offline = 0;
                            let maxPowerKw = 22; // default

                            for (let port of station.ports) {
                                if (port.chargingport_status === 'Active') available++;
                                else if (port.chargingport_status === 'Occupied') occupied++;
                                else if (port.chargingport_status === 'Reserved') reserved++;
                                else if (port.chargingport_status === 'Inactive') offline++;

                                // Extrapolate power from name (e.g. 50kW) or default
                                const kwMatch = port.chargingport_name.match(/(\d+)kW/i);
                                if (kwMatch) {
                                    maxPowerKw = Math.max(maxPowerKw, parseInt(kwMatch[1]));
                                }
                            }

                            station.portsSummary = { totalPorts, available, occupied, reserved, offline, maxPowerKw };

                            // Dynamic variables for scoring (deterministic based on station ID)
                            const rating = Math.round((4.0 + ((station.chargingstation_id * 3) % 10) / 10) * 10) / 10;
                            const priceKwh = Math.round((10 + ((station.chargingstation_id * 7) % 9)) * 10) / 10;
                            const queueLength = occupied + (reserved * 0.5);

                            station.rating = rating;
                            station.priceKwh = priceKwh;
                            station.queueLength = queueLength;

                            // Calculate Recommendation Score
                            // 1. Distance Score: max 35 points (0km = 35 pts, 10km = 0 pts)
                            const distanceScore = Math.max(0, 35 - (dist * 3.5));
                            // 2. Availability Score: max 25 points (all free = 25 pts, none free = 0 pts)
                            const availabilityScore = totalPorts > 0 ? (available / totalPorts) * 25 : 0;
                            // 3. Price Score: max 20 points (₹10 = 20 pts, ₹18 = 0 pts)
                            const priceScore = Math.max(0, 20 - (priceKwh - 10) * 2.5);
                            // 4. Rating Score: max 20 points (5.0 = 20 pts, 4.0 = 10 pts)
                            const ratingScore = Math.max(0, (rating - 3.0) * 10);

                            const score = Math.round(distanceScore + availabilityScore + priceScore + ratingScore);
                            station.recommendationScore = Math.min(100, Math.max(0, score));

                            // Limit to 15km for recommendations
                            if (dist <= 15.0) {
                                results.push(station);
                            }
                        }

                        // Sort by recommendation score descending
                        results.sort((a, b) => b.recommendationScore - a.recommendationScore);

                        resp.code = 0;
                        resp.message = 'ok';
                        resp.data = results;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
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

// Simulator connection
const simulator = require('./simulator');

// Mock storage
const walletBalances = new Map(); // userId -> number
const walletTransactions = new Map(); // userId -> array of { date, type, amount, desc }
const slotBookings = new Map(); // userId -> array of { bookingId, stationName, portName, dateTime, status }

// Helper to get user ID from JWT token cookie
function getUserIdFromToken(req) {
    if (!req.cookies.login_token) return null;
    try {
        const decoded = jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY);
        return decoded.userId || null;
    } catch (e) {
        return null;
    }
}

const getWallet = (req, res) => {
    const userId = getUserIdFromToken(req);
    const resp = new ApiResponse();
    if (!userId) {
        resp.code = 14; resp.message = "Login required.";
        return res.json(resp);
    }
    if (!walletBalances.has(userId)) {
        walletBalances.set(userId, 500.0); // Default balance
        walletTransactions.set(userId, [
            { date: new Date().toLocaleString(), type: 'Deposit', amount: 500.0, desc: 'Welcome Bonus Credited' }
        ]);
    }
    resp.code = 0;
    resp.message = "ok";
    resp.data = {
        balance: walletBalances.get(userId),
        transactions: walletTransactions.get(userId)
    };
    res.json(resp);
};

const rechargeWallet = (req, res) => {
    const userId = getUserIdFromToken(req);
    const resp = new ApiResponse();
    if (!userId) {
        resp.code = 14; resp.message = "Login required.";
        return res.json(resp);
    }
    const amount = parseFloat(req.body.amount);
    if (!amount || amount <= 0) {
        resp.code = 1; resp.message = "Invalid amount.";
        return res.json(resp);
    }
    const currentBal = walletBalances.get(userId) || 0;
    const newBal = currentBal + amount;
    walletBalances.set(userId, newBal);
    
    if (!walletTransactions.has(userId)) walletTransactions.set(userId, []);
    walletTransactions.get(userId).push({
        date: new Date().toLocaleString(),
        type: 'Deposit',
        amount,
        desc: 'Wallet Recharged'
    });

    resp.code = 0;
    resp.message = "Recharge successful!";
    resp.data = { balance: newBal };
    res.json(resp);
};

const getBookings = (req, res) => {
    const userId = getUserIdFromToken(req);
    const resp = new ApiResponse();
    if (!userId) {
        resp.code = 14; resp.message = "Login required.";
        return res.json(resp);
    }
    if (!slotBookings.has(userId)) {
        slotBookings.set(userId, []);
    }
    resp.code = 0;
    resp.message = "ok";
    resp.data = slotBookings.get(userId);
    res.json(resp);
};

const addBooking = async (req, res) => {
    const userId = getUserIdFromToken(req);
    const resp = new ApiResponse();
    if (!userId) {
        resp.code = 14; resp.message = "Login required.";
        return res.json(resp);
    }
    const { portId, stationName, portName, dateTime } = req.body;
    if (!portId || !dateTime) {
        resp.code = 1; resp.message = "Missing parameters.";
        return res.json(resp);
    }

    // Set port status to Reserved in DB
    await cpModel.updateStatus(portId, 'Reserved');

    if (!slotBookings.has(userId)) slotBookings.set(userId, []);
    const booking = {
        bookingId: Math.floor(100000 + Math.random() * 900000),
        portId,
        stationName: stationName || "Station Hub",
        portName: portName || "Charger Port",
        dateTime,
        status: 'Booked'
    };
    slotBookings.get(userId).push(booking);

    resp.code = 0;
    resp.message = "Booking confirmed!";
    resp.data = booking;
    res.json(resp);
};

const cancelBooking = async (req, res) => {
    const userId = getUserIdFromToken(req);
    const resp = new ApiResponse();
    if (!userId) {
        resp.code = 14; resp.message = "Login required.";
        return res.json(resp);
    }
    const { bookingId } = req.body;
    if (!bookingId) {
        resp.code = 1; resp.message = "Missing booking ID.";
        return res.json(resp);
    }
    const bookings = slotBookings.get(userId) || [];
    const bookingIndex = bookings.findIndex(b => b.bookingId == bookingId);
    if (bookingIndex === -1) {
        resp.code = 4; resp.message = "Booking not found.";
        return res.json(resp);
    }

    const booking = bookings[bookingIndex];
    booking.status = 'Cancelled';

    // Set port status back to Active (Available) in DB
    await cpModel.updateStatus(booking.portId, 'Active');

    resp.code = 0;
    resp.message = "Booking cancelled successfully.";
    resp.data = booking;
    res.json(resp);
};

const startChargingSession = (req, res) => {
    const userId = getUserIdFromToken(req);
    const resp = new ApiResponse();
    if (!userId) {
        resp.code = 14; resp.message = "Login required.";
        return res.json(resp);
    }
    const { vehicleId, portId, startPercent, targetPercent } = req.body;
    if (!portId) {
        resp.code = 1; resp.message = "Port ID required.";
        return res.json(resp);
    }

    const session = simulator.startSession(userId, vehicleId, portId, startPercent, targetPercent);
    resp.code = 0;
    resp.message = "Charging session started successfully!";
    resp.data = session;
    res.json(resp);
};

const stopChargingSession = async (req, res) => {
    const userId = getUserIdFromToken(req);
    const resp = new ApiResponse();
    if (!userId) {
        resp.code = 14; resp.message = "Login required.";
        return res.json(resp);
    }

    const session = await simulator.stopSession(userId);
    if (!session) {
        resp.code = 4; resp.message = "No active session found.";
        return res.json(resp);
    }

    // Deduct cost from wallet
    const finalCost = Math.round(session.accumulatedCost * 100) / 100;
    const currentBal = walletBalances.get(userId) || 0;
    const newBal = Math.max(0, currentBal - finalCost);
    walletBalances.set(userId, newBal);

    // Record wallet transaction
    if (!walletTransactions.has(userId)) walletTransactions.set(userId, []);
    walletTransactions.get(userId).push({
        date: new Date().toLocaleString(),
        type: 'Debit',
        amount: finalCost,
        desc: `EV Charging Session #${session.portId}`
    });

    resp.code = 0;
    resp.message = "Charging session stopped successfully!";
    resp.data = {
        session,
        finalCost,
        remainingBalance: newBal
    };
    res.json(resp);
};

const getActiveSession = (req, res) => {
    const userId = getUserIdFromToken(req);
    const resp = new ApiResponse();
    if (!userId) {
        resp.code = 14; resp.message = "Login required.";
        return res.json(resp);
    }

    const session = simulator.getSession(userId);
    resp.code = 0;
    resp.message = "ok";
    resp.data = session || null;
    res.json(resp);
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
    search,
    getWallet,
    rechargeWallet,
    getBookings,
    addBooking,
    cancelBooking,
    startChargingSession,
    stopChargingSession,
    getActiveSession
};