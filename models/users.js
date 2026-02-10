const mysql = require('mysql2');
const dbconfig = require('./dbconfig');

const getAll = () => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.query(
            "SELECT * FROM tbl_users;", [],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined') {
                    ret = results;
                }
                else ret = null;
                resolve(ret);
            }
        );
    });
};

const getAllActive = () => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.query(
            "SELECT * FROM tbl_users WHERE user_status='active';", [],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined') {
                    ret = results;
                }
                else ret = null;
                resolve(ret);
            }
        );
    });
};

const get = (uid) => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.query(
            "SELECT * FROM tbl_users WHERE user_id=?;", [user_id],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results[0]);
                }
                else resolve(null);
            }
        );
    });
};

const getSecure = (uid) => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.query(
            "SELECT user_id,user_name,user_email,user_mobile,user_address,user_city,user_dob,user_status FROM tbl_users WHERE user_id=?;", [uid],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results[0]);
                }
                else resolve(null);
            }
        );
    });
};

const getUserIDFromEmail = (email) => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.query(
            "SELECT user_id FROM tbl_users WHERE user_email=?;", [email],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results[0].user_id);
                }
                else resolve(null);
            }
        );
    });
};

const checkDuplicateEmail = (email) => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.query(
            "SELECT COUNT(*) as cnt FROM tbl_users WHERE user_email=?;", [ email ],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined') {
                    if(results[0].cnt > 0) resolve(true);
                    else resolve(false);
                }
                else resolve(false);
            }
        );
    });
};

const checkLoginCredentials = (email, pwd) => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.query(
            "SELECT COUNT(*) as cnt FROM tbl_users WHERE user_email=? AND user_pwd=?;", [ email, pwd ],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined') {
                    if(results[0].cnt > 0) resolve(true);
                    else resolve(false);
                }
                else resolve(false);
            }
        );
    });
};

const checkPassword = (uid, passwd) => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.query(
            "SELECT COUNT(*) as cnt FROM tbl_users WHERE user_id=? AND user_pwd=?;", [ uid, passwd ],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined') {
                    if(results[0].cnt > 0) resolve(true);
                    else resolve(false);
                }
                else resolve(false);
            }
        );
    });
};

const create = (fname, email, mobile, addr, city, dob, pwd) => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.execute(
            "INSERT INTO `tbl_users` (`user_name`,`user_email`,`user_mobile`,`user_address`,`user_city`,`user_dob`,`user_pwd`) VALUES (?,?,?,?,?,?,?);", [ fname, email, mobile, addr, city, dob, pwd ],
            function(error, results) {
                if(error) reject(error);                
                else resolve(true);
            }
        );
    });
};

const updateBasic = (uid, fname, mobile, addr, city, dob) => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.execute(
            "UPDATE `tbl_users` SET `user_name` = ?, `user_mobile` = ?, `user_address` = ?, `user_city` = ?, `user_dob` = ? WHERE `user_id` = ?;", [ fname, mobile, addr, city, dob, uid ],
            function(error, results) {
                if(error) reject(error);                
                else resolve(true);
            }
        );
    });
};

const updateCredentials = (uid, email, passwd) => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.execute(
            "UPDATE `tbl_users` SET `user_email` = ?,`user_pwd` = ? WHERE `user_id` = ?;", [ email, passwd, uid ],
            function(error, results) {
                if(error) reject(error);                
                else resolve(true);
            }
        );
    });
};

const updateStatus = (uid, status) => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.execute(
            "UPDATE `tbl_users` SET `user_status` = ? WHERE `user_id` = ?;", [ status, uid ],
            function(error, results) {
                if(error) reject(error);                
                else resolve(true);
            }
        );
    });
};

const remove = (uid) => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.execute(
            "DELETE FROM `tbl_users` WHERE `user_id` = ?;", [ uid ],
            function(error, results) {
                if(error) reject(error);                
                else resolve(true);
            }
        );
    });
};

module.exports = {
    get,
    getAll,
    getAllActive,
    getSecure,
    getUserIDFromEmail,
    checkDuplicateEmail,
    checkLoginCredentials,
    checkPassword,
    create,
    updateBasic,
    updateCredentials,
    updateStatus,
    remove
};