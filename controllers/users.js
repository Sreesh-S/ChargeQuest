const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../models/users');
const ApiResponse = require('../models/ApiResponse');
const vModel = require('../models/vehicles');

function ValParam(param) {
    if(param === null || param === undefined || param === "")
        return false;
    else return true;
}

const getUserLogin = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    res.render('user_login', {
        resp: JSON.stringify(resp)
    });
};

const postUserLogin = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    console.log(form);

    if(ValParam(form.login) && ValParam(form.passwd)) {
        var prm = userModel.checkLoginCredentials(form.login, form.passwd);
        prm.then(onfulfilled = (value) => {
            var prm1 = userModel.getUserIDFromEmail(form.login);
            prm1.then(onfulfilled = (value1) => {
                if(value1) {
                    var uid = value1;
                    const token = jwt.sign({ userId: uid },
                        process.env.JWT_SECRET_KEY, {
                        expiresIn: "24h"
                    });

                    res.cookie('login_token', token);
                    res.redirect('/user/index');
                }
                else {
                    resp.code = 4;
                    resp.message = 'Login failed! User doesnt exist!';
                    resp.data = null;

                    res.render('user_login', {
                        title: 'ChargeQuest - User Login',
                        resp: JSON.stringify(resp)
                    });
                }
            }, onrejected = (err1) => {
                resp.code = 15;
                resp.message = 'Something went wrong! ' + err1.message;
                resp.data = err1.stack;

                res.render('user_login', {
                    title: 'ChargeQuest - User Login',
                    resp: JSON.stringify(resp)
                });
            });
        }, onrejected = (err) => {
            resp.code = 15;
            resp.message = 'Something went wrong! ' + err.message;
            resp.data = err.stack;

            res.render('user_login', {
                title: 'Nisha - Login',
                resp: JSON.stringify(resp)
            });
        });
    }
    else {
        resp.code = 1;
        resp.message = 'One or more parameters missing. Check the API docs.';
        resp.data = null;

        res.render('admin_login', {
            title: 'ChargeQuest - Admin Login',
            resp: JSON.stringify(resp)
        });
    }
};

const getUserSignup = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    res.render('user_signup', {
        resp: JSON.stringify(resp)
    });
};

const postUserSignup = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);
    var form = req.body;

    console.log(form);

    if(typeof form.submit_signup !== 'undefined') {
        if(ValParam(form.fullname) && ValParam(form.email) && ValParam(form.passwd) && ValParam(form.mobile) && ValParam(form.addr) && ValParam(form.city) && ValParam(form.dob)) {
            var prm = userModel.checkDuplicateEmail(form.email);
            prm.then(onfulfilled = (value) => {
                if(value) {
                    resp.code = 16;
                    resp.message = "This e-mail is already registered in our system. If this is your e-mail, then login using this e-mail.";
                    resp.data = null;

                    res.render('user_signup', {
                        resp: JSON.stringify(resp)
                    });
                }
                else {
                    var prm1 = userModel.create(form.fullname, form.email, form.mobile, form.addr, form.city, form.dob, form.passwd);
                    prm1.then(onfulfilled = (value1) => {
                        resp.code = 0;
                        resp.message = "ok";
                        resp.data = null;

                        res.render('user_signup', {
                            resp: JSON.stringify(resp)
                        });
                    }, onrejected = (err1) => {
                        resp.code = 15;
                        resp.message = "Something went wrong! " + err1.message;
                        resp.data = err1.stack;

                        res.render('user_signup', {
                            resp: JSON.stringify(resp)
                        });
                    });
                }
            }, onrejected = (err) => {
                resp.code = 15;
                resp.message = "Something went wrong! " + err.message;
                resp.data = err.stack;

                res.render('user_signup', {
                    resp: JSON.stringify(resp)
                });
            });
        }
        else {
            resp.code = 1;
            resp.message = 'One or more parameters missing. Check the API docs.';
            resp.data = null;

            res.render('user_signup', {
                resp: JSON.stringify(resp)
            });
        }
    }
    else {
        res.render('user_signup', {
            resp: JSON.stringify(resp)
        }); 
    }
};

const getUserIndex = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/user/login');
            }
            else {
                var uid = decoded.userId;
                if(ValParam(uid)) {
                    res.render('user_index', {
                        resp: JSON.stringify(resp)
                    }); 
                }
                else {
                    res.redirect('/user/login');
                }
            }
        });
    }
    else {
        res.redirect('/user/login');
    }
};

const getUserVehicles = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/user/login');
            }
            else {
                var uid = decoded.userId;
                if(ValParam(uid)) {
                    res.render('user_vehicles', {
                        resp: JSON.stringify(resp)
                    }); 
                }
                else {
                    res.redirect('/user/login');
                }
            }
        });
    }
    else {
        res.redirect('/user/login');
    }
};

const postUserVehicles = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/user/login');
            }
            else {
                var uid = decoded.userId;
                if(ValParam(uid)) {
                    if(typeof form.submit_add !== 'undefined') {
                        if(ValParam(form.model) && ValParam(form.comp) && ValParam(form.ctid)) {
                            var prm = vModel.checkDuplicate(uid, form.comp, form.model, form.ctid);
                            prm.then(onfulfilled = (r) => {
                                if(r.code === 0) {
                                    if(r.data === true) {
                                        resp.code = 16;
                                        resp.message = "(DUPLICATE DATA) A vehicle with exact same details already present.";
                                        resp.data = null;

                                        res.render('user_vehicles', {
                                            resp: JSON.stringify(resp)
                                        }); 
                                    }
                                    else {
                                        var prm1 = vModel.create(uid, form.comp, form.model, form.ctid);
                                        prm1.then(onfulfilled = (r1) => {
                                            res.render('user_vehicles', {
                                                resp: JSON.stringify(r1)
                                            }); 
                                        });
                                    }
                                }
                                else {
                                    res.render('user_vehicles', {
                                        resp: JSON.stringify(r)
                                    }); 
                                }
                            });
                        }
                        else {
                            resp.code = 1;
                            resp.message = "One or more parameters missing or invalid.";
                            resp.data = null;

                            res.render('user_vehicles', {
                                resp: JSON.stringify(resp)
                            }); 
                        }
                    }
                }
                else {
                    res.redirect('/user/login');
                }
            }
        });
    }
    else {
        res.redirect('/user/login');
    }
};

const logout = (req, res) => {
    res.clearCookie('login_token');
    res.redirect('/user/login');
};

module.exports = {
    getUserLogin,
    postUserLogin,
    getUserSignup,
    postUserSignup,
    getUserIndex,
    getUserVehicles,
    postUserVehicles,
    logout
}