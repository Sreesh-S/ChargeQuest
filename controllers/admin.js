const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../models/users');
const admModel = require('../models/admin');
const csModel = require('../models/cstations');
const cpModel = require('../models/cports');
const ctModel = require('../models/ctypes');
const ApiResponse = require('../models/ApiResponse');

function ValParam(param) {
    if(param === null || param === undefined || param === "")
        return false;
    else return true;
}

const getLogin = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    res.render('admin_login', {
        resp: JSON.stringify(resp)
    });
};

const postLogin = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if(ValParam(form.login) && ValParam(form.passwd)) {
        var prm = admModel.checkLoginCredentials(form.login, form.passwd);
        prm.then(onfulfilled = (value) => {
            if (value === true) {
                var prm1 = admModel.getAdminIdFromLogin(form.login);
                prm1.then(onfulfilled = (value1) => {
                    if(value1) {
                        var admid = value1;
                        const token = jwt.sign({ AdmId: admid, adm: true },
                            process.env.JWT_SECRET_KEY, {
                            expiresIn: "24h"
                        });

                        res.cookie('login_token', token);
                        res.redirect('/admin/index');
                    }
                    else {
                        resp.code = 4;
                        resp.message = 'Login failed! Admin does not exist!';
                        resp.data = null;

                        res.render('admin_login', {
                            resp: JSON.stringify(resp)
                        });
                    }
                }, onrejected = (err1) => {
                    resp.code = 15;
                    resp.message = 'Something went wrong! ' + err1.message;
                    resp.data = err1.stack;

                    res.render('admin_login', {
                        resp: JSON.stringify(resp)
                    });
                });
            } else {
                resp.code = 5;
                resp.message = 'Invalid password credentials!';
                resp.data = null;

                res.render('admin_login', {
                    resp: JSON.stringify(resp)
                });
            }
        }, onrejected = (err) => {
            resp.code = 15;
            resp.message = 'Something went wrong! ' + err.message;
            resp.data = err.stack;

            res.render('admin_login', {
                resp: JSON.stringify(resp)
            });
        });
    }
    else {
        resp.code = 1;
        resp.message = 'One or more parameters missing.';
        resp.data = null;

        res.render('admin_login', {
            resp: JSON.stringify(resp)
        });
    }
};

const getAdminIndex = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/user/login');
            }
            else {
                if(decoded.adm) {
                    res.render('admin_index', {
                        resp: JSON.stringify(resp)
                    });
                }
                else {
                    res.redirect('/user/index');
                }
            }
        });
    }
    else {
        res.redirect('/user/login');
    }
};

const getAdminUsers = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                if(typeof decoded.AdmId !== 'undefined') {
                    var adid = decoded.AdminId;
                    var prm = userModel.getAll();
                    prm.then(onfulfilled = (value) => {
                        res.render('admin_users', {
                            resp: JSON.stringify(resp),
                            userlist: JSON.stringify(value)
                        });
                    }, onrejected = (err) => {
                        resp.code = 15;
                        resp.message = "Something went wrong! " + err.message;
                        resp.data = err.stack;

                        res.render('admin_users', {
                            resp: JSON.stringify(resp)
                        });
                    });
                }
                else {
                    res.redirect('/admin/login');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
}

const postAdminUsers = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                if(typeof decoded.AdmId !== 'undefined') {
                    var adid = decoded.AdminId;
                    if(typeof form.submit_chstatus !== 'undefined') {
                        var uid = form.userid;
                        var status = form.status;

                        if(ValParam(uid) && ValParam(status)) {
                            var prm1 = userModel.updateStatus(uid, status);
                            prm1.then(onfulfilled = (value1) => {
                                var prm2 = userModel.getAll();
                                prm2.then(onfulfilled = (value2) => {
                                    resp.code = 0;
                                    resp.message = "User status updated!";
                                    resp.data = null;

                                    res.render('admin_users', {
                                        resp: JSON.stringify(resp),
                                        userlist: JSON.stringify(value2)
                                    });
                                }, onrejected = (err2) => {
                                    resp.code = 15;
                                    resp.message = "Something went wrong! " + err2.message;
                                    resp.data = err2.stack;

                                    res.render('admin_users', {
                                        resp: JSON.stringify(resp),
                                        userlist: JSON.stringify(value)
                                    });
                                });
                            }, onrejected = (err1) => {
                                resp.code = 15;
                                resp.message = "Something went wrong! " + err1.message;
                                resp.data = err1.stack;

                                res.render('admin_users', {
                                    resp: JSON.stringify(resp),
                                    userlist: JSON.stringify(value)
                                });
                            });
                        }
                        else {
                            resp.code = 1;
                            resp.message = "One or more parameters missing or invalid!";
                            resp.data = null;

                            res.render('admin_users', {
                                resp: JSON.stringify(resp)
                            });
                        }
                    }
                    else if(typeof form.submit_del !== 'undefined') {
                        console.log(form);
                        var uid = form.userid;
                        if(ValParam(uid)) {
                            var prm1 = userModel.remove(uid);
                            prm1.then(onfulfilled = (value1) => {
                                var prm2 = userModel.getAll();
                                prm2.then(onfulfilled = (value2) => {
                                    resp.code = 0;
                                    resp.message = "User deleted successfully!";
                                    resp.data = null;

                                    res.render('admin_users', {
                                        resp: JSON.stringify(resp),
                                        userlist: JSON.stringify(value2)
                                    });
                                }, onrejected = (err2) => {
                                    resp.code = 15;
                                    resp.message = "Something went wrong! " + err2.message;
                                    resp.data = err2.stack;

                                    res.render('admin_users', {
                                        resp: JSON.stringify(resp),
                                        userlist: JSON.stringify(value)
                                    });
                                });
                            }, onrejected = (err1) => {
                                resp.code = 15;
                                resp.message = "Something went wrong! " + err1.message;
                                resp.data = err1.stack;

                                res.render('admin_users', {
                                    resp: JSON.stringify(resp),
                                    userlist: JSON.stringify(value)
                                });
                            });
                        }
                        else {
                            resp.code = 1;
                            resp.message = "One or more parameters missing or invalid!";
                            resp.data = null;

                            res.render('admin_users', {
                                resp: JSON.stringify(resp)
                            });
                        }
                    }
                    else {
                        var prm = userModel.getAll();
                        prm.then(onfulfilled = (value) => {
                            res.render('admin_users', {
                                resp: JSON.stringify(resp),
                                userlist: JSON.stringify(value)
                            });
                        }, onrejected = (err) => {
                            resp.code = 15;
                            resp.message = "Something went wrong! " + err.message;
                            resp.data = err.stack;

                            res.render('admin_users', {
                                resp: JSON.stringify(resp)
                            });
                        });
                    }
                }
                else {
                    res.redirect('/admin/login');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

const getAdminCStations = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                if(typeof decoded.AdmId !== 'undefined') {
                    var adid = decoded.AdmId;
                    var prm = csModel.getAll();
                    prm.then(onfulfilled = (r) => {
                        if(r.code === 0) {
                            resp.code = 0;
                            resp.message = 'get';
                            resp.data = null;

                            res.render('admin_cstations', {
                                resp: JSON.stringify(resp),
                                cslist: JSON.stringify(r.data)
                            });
                        }
                        else {
                            res.render('admin_cstations', {
                                resp: JSON.stringify(r),
                                cslist: []
                            });
                        }
                    });
                }
                else {
                    res.redirect('/admin/login');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

const postAdminCStations = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                if(typeof decoded.AdmId !== 'undefined') {
                    var adid = decoded.AdmId;
                    var prm = csModel.getAll();
                    prm.then(onfulfilled = (r) => {
                        if(r.code === 0) {
                            if(typeof form.submit_add !== 'undefined') {
                                if(ValParam(form.lat) && ValParam(form.long) && ValParam(form.name)) {
                                    var prm1 = csModel.checkDuplicate(form.name, form.lat, form.long);
                                    prm1.then(onfulfilled = (r1) => {
                                        if(r1.code === 0) {
                                            if(r1.data === true) {
                                                resp.code = 16;
                                                resp.message = "A charging station with exactly similar data already registered. Either edit or change it before adding a new one!";
                                                resp.data = null;

                                                res.render('admin_cstations', {
                                                    resp: JSON.stringify(resp),
                                                    cslist: JSON.stringify(r.data)
                                                });
                                            }
                                            else {
                                                var prm2 = csModel.create(form.name, form.lat, form.long);
                                                prm2.then(onfulfilled = (r2) => {
                                                    if(r2.code === 0) {
                                                        res.render('admin_cstations', {
                                                            resp: JSON.stringify(r2),
                                                            cslist: JSON.stringify(r.data)
                                                        });     
                                                    }
                                                    else {
                                                        res.render('admin_cstations', {
                                                            resp: JSON.stringify(r2),
                                                            cslist: JSON.stringify(r.data)
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                        else {
                                            res.render('admin_cstations', {
                                                resp: JSON.stringify(r1),
                                                cslist: JSON.stringify(r.data)
                                            });
                                        }
                                    });
                                }
                                else {
                                    resp.code = 1;
                                    resp.message = "One or more parameters are missing or invalid.";
                                    resp.data = null;

                                    res.render('admin_cstations', {
                                        resp: JSON.stringify(resp),
                                        cslist: JSON.stringify(r.data)
                                    });
                                }
                            }
                            else if(typeof form.submit_edit !== 'undefined') {
                                if(ValParam(form.csid) && ValParam(form.name) && ValParam(form.lat) && ValParam(form.long)) {
                                    var prm1 = csModel.update(form.csid, form.name, form.lat, form.long);
                                    prm1.then(onfulfilled = (r1) => {
                                        res.render('admin_cstations', {
                                            resp: JSON.stringify(r1),
                                            cslist: JSON.stringify(r.data)
                                        });
                                    });                                    
                                }
                                else {
                                    resp.code = 1;
                                    resp.message = "One or more parameters are missing or invalid.";
                                    resp.data = null;

                                    res.render('admin_cstations', {
                                        resp: JSON.stringify(resp),
                                        cslist: JSON.stringify(r.data)
                                    });
                                }
                            }
                            else if(typeof form.submit_chstatus !== 'undefined') {
                                if(ValParam(form.csid) && ValParam(form.status)) {
                                    var prm1 = csModel.updateStatus(form.csid, form.status);
                                    prm1.then(onfulfilled = (r1) => {
                                        res.render('admin_cstations', {
                                            resp: JSON.stringify(r1),
                                            cslist: JSON.stringify(r.data)
                                        });
                                    });
                                }
                                else {
                                    resp.code = 1;
                                    resp.message = "One or more parameters are missing or invalid.";
                                    resp.data = null;

                                    res.render('admin_cstations', {
                                        resp: JSON.stringify(resp),
                                        cslist: JSON.stringify(r.data)
                                    });
                                }
                            }
                        }
                        else {
                            res.render('admin_cstations', {
                                resp: JSON.stringify(r),
                                cslist: []
                            });
                        }
                    });
                }
                else {
                    res.redirect('/admin/login');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

const getAdminCtypes = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                if(decoded.adm) {
                    var prm = ctModel.getAll();
                    prm.then(onfulfilled = (value) => {
                        resp.code = 0;
                        resp.message = 'get';
                        resp.data = null;

                        res.render('admin_ctypes', {
                            resp: JSON.stringify(resp),
                            ctlist: JSON.stringify(value)
                        }); 
                    }, onrejected = (err) => {
                        resp.code = 15;
                        resp.message = "Something went wrong! " + err1.message;
                        resp.data = err.stack;

                        res.render('admin_ctypes', {
                            resp: JSON.stringify(resp)
                        }); 
                    });
                }
                else {
                    res.redirect('/user/index');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

// var prm = ctModel.getAll();
// prm.then(onfulfilled = (value) => {
//     resp.code = 0;
//     resp.message = 'get';
//     resp.data = null;

//     res.render('admin_ctypes', {
//         resp: JSON.stringify(resp),
//         ctlist: value
//     }); 
// }, onrejected = (err) => {
//     resp.code = 15;
//     resp.message = "Something went wrong! " + err1.message;
//     resp.data = err.stack;

//     res.render('admin_ctypes', {
//         resp: JSON.stringify(resp)
//     }); 
// });

const postAdminCtypes = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                if(decoded.adm) {
                    if(typeof form.submit_add !== 'undefined') {
                        var name = form.ctname;
                        var desc = form.ctdesc;

                        if(ValParam(name) && ValParam(desc)) {
                            var prm = ctModel.checkDuplicate(name, desc);
                            prm.then(onfulfilled = (value) => {
                                if(value) {
                                    resp.code = 16;
                                    resp.message = "A charger type with exactly same name and description already exists!";
                                    resp.data = null;

                                    res.render('admin_ctypes', {
                                        resp: JSON.stringify(resp)
                                    }); 
                                }
                                else {
                                    var prm1 = ctModel.create(name, desc);
                                    prm1.then(onfulfilled = (value1) => {
                                        var prm2 = ctModel.getAll();
                                        prm2.then(onfulfilled = (value2) => {
                                            resp.code = 0;
                                            resp.message = "Charger type added succesfully!";
                                            resp.data = null;

                                            res.render('admin_ctypes', {
                                                resp: JSON.stringify(resp),
                                                ctlist: JSON.stringify(value2)
                                            });     
                                        }, onrejected = (err2) => {
                                            resp.code = 15;
                                            resp.message = "Something went wrong! " + err2.message;
                                            resp.data = err2.stack;

                                            res.render('admin_ctypes', {
                                                resp: JSON.stringify(resp)
                                            }); 
                                        });
                                    }, onrejected = (err1) => {
                                        resp.code = 15;
                                        resp.message = "Something went wrong! " + err1.message;
                                        resp.data = err1.stack;

                                        res.render('admin_ctypes', {
                                            resp: JSON.stringify(resp)
                                        }); 
                                    });
                                }
                            }, onrejected = (err) => {
                                resp.code = 15;
                                resp.message = "Something went wrong! " + err.message;
                                resp.data = err.stack;

                                res.render('admin_ctypes', {
                                    resp: JSON.stringify(resp)
                                }); 
                            });
                        }
                    }
                    else if(typeof form.submit_edit !== 'undefined') {
                        var ctid = form.ctid;
                        var name = form.ctname;
                        var desc = form.ctdesc;

                        console.log(form);

                        if(ValParam(ctid) && ValParam(name)) {
                            if(!ValParam(desc)) desc = "";

                            var prm = ctModel.update(ctid, name, desc);
                            prm.then(onfulfilled = (value) => {
                                var prm2 = ctModel.getAll();
                                prm2.then(onfulfilled = (value2) => {
                                    resp.code = 0;
                                    resp.message = "Charger type updated!";
                                    resp.data = null;

                                    res.render('admin_ctypes', {
                                        resp: JSON.stringify(resp),
                                        ctlist: JSON.stringify(value2)
                                    });     
                                }, onrejected = (err2) => {
                                    resp.code = 15;
                                    resp.message = "Something went wrong! " + err2.message;
                                    resp.data = err2.stack;

                                    res.render('admin_ctypes', {
                                        resp: JSON.stringify(resp)
                                    }); 
                                });
                            }, onrejected = (err) => {
                                resp.code = 15;
                                    resp.message = "Something went wrong! " + err2.message;
                                    resp.data = err2.stack;

                                    res.render('admin_ctypes', {
                                        resp: JSON.stringify(resp)
                                    }); 
                            });
                        }
                        else {

                        }

                    }
                    else if(typeof form.submit_del !== 'undefined') {
                        var ctid = form.ctid;
                        if(ValParam(ctid)) {
                            var prm = ctModel.remove(ctid);
                            prm.then(onfulfilled = (value) => {
                                var prm1 = ctModel.getAll();
                                prm1.then(onfulfilled = (value1) => {
                                    resp.code = 0;
                                    resp.message = 'Charger type deleted!';
                                    resp.data = null;

                                    res.render('admin_ctypes', {
                                        resp: JSON.stringify(resp),
                                        ctlist: JSON.stringify(value)
                                    }); 
                                }, onrejected = (err1) => {
                                    resp.code = 15;
                                    resp.message = "Something went wrong! Please reload this page. Error: " + err1.message;
                                    resp.data = err1.stack;

                                    res.render('admin_ctypes', {
                                        resp: JSON.stringify(resp)
                                    }); 
                                });
                            }, onrejected = (err) => {
                                resp.code = 15;
                                resp.message = "Deletion failed! " + err.message;
                                resp.data = err.stack;

                                res.render('admin_ctypes', {
                                    resp: JSON.stringify(resp)
                                }); 
                            });
                        }
                    }
                    else {
                        var prm = ctModel.getAll();
                        prm.then(onfulfilled = (value) => {
                            resp.code = 0;
                            resp.message = 'get';
                            resp.data = null;

                            res.render('admin_ctypes', {
                                resp: JSON.stringify(resp),
                                ctlist: JSON.stringify(value)
                            }); 
                        }, onrejected = (err) => {
                            resp.code = 15;
                            resp.message = "Something went wrong! " + err.message;
                            resp.data = err.stack;

                            res.render('admin_ctypes', {
                                resp: JSON.stringify(resp)
                            }); 
                        });
                    }
                }
                else {
                    res.redirect('/user/index');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

const getAdminCPorts = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);
    var form = req.query;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                if(decoded.adm) {
                    if(ValParam(form.csid)) {
                        res.render('admin_cports', {
                            resp: JSON.stringify(resp),
                            csid: form.csid
                        });
                    }
                    else {
                        res.render('admin_cports', {
                            resp: JSON.stringify(resp)
                        });
                    }
                }
                else {
                    res.redirect('/user/index');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

const postAdminCPorts = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                if(decoded.adm) {
                    var csid = form.csid || null;
                    if(typeof form.submit_add !== 'undefined') {
                        console.log('Form = ', form);
                        if(ValParam(form.csid) && ValParam(form.name) && ValParam(form.ctid)) {
                            var prm = cpModel.checkDuplicate(form.csid, form.name, form.ctid);
                            prm.then(onfulfilled = (r) => {
                                if(r.code === 0) {
                                    if(r.data === true) {
                                        resp.code = 16;
                                        resp.message = "(DUPLICATE DATA) A port with exact details already present.";
                                        resp.data = null;

                                        res.render('admin_cports', {
                                            resp: JSON.stringify(resp),
                                            csid: form.csid
                                        });
                                    }
                                    else {
                                        var prm1 = cpModel.create(form.csid, form.name, form.ctid);
                                        prm1.then(onfulfilled = (r1) => {
                                            res.render('admin_cports', {
                                                resp: JSON.stringify(r1),
                                                csid: form.csid
                                            });
                                        });
                                    }
                                }
                                else {
                                    res.render('admin_cports', {
                                        resp: JSON.stringify(r),
                                        csid: form.csid
                                    });
                                }
                            });
                        }
                        else {
                            resp.code = 1;
                            resp.message = "One or more parameters missing or invalid.";
                            resp.data = null;

                            res.render('admin_cports', {
                                resp: JSON.stringify(resp),
                                csid: form.csid
                            });
                        }
                    }
                    else if(typeof form.submit_edit !== 'undefined') {
                        if(ValParam(form.cpid) && ValParam(form.name) && ValParam(form.ctid) && ValParam(form.status)) {
                            var prm = cpModel.update(form.cpid, form.name, form.ctid, form.status);
                            prm.then(onfulfilled = (r) => {
                                res.render('admin_cports', {
                                    resp: JSON.stringify(r),
                                    csid: form.csid
                                }); 
                            });
                        }
                    }
                    else if(typeof form.submit_del !== 'undefined') {
                        if(ValParam(form.cpid)) {
                            var prm = cpModel.remove(form.cpid);
                            prm.then(onfulfilled = (r) => {
                                res.render('admin_cports', {
                                    resp: JSON.stringify(r),
                                    csid: form.csid
                                }); 
                            });
                        }
                    }
                }
                else {
                    res.redirect('/user/index');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

const logout = (req, res) => {
    res.clearCookie('login_token');
    res.redirect('/user/login');
};

module.exports = {
    getLogin,
    postLogin,
    getAdminIndex,
    getAdminUsers,
    postAdminUsers,
    getAdminCStations,
    postAdminCStations,
    getAdminCPorts,
    postAdminCPorts,
    getAdminCtypes,
    postAdminCtypes,
    logout
};