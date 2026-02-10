const mysql = require('mysql2');
const dbconfig = require('./dbconfig');

const getAdminIdFromLogin = (login) => {
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
            "SELECT admin_id FROM tbl_admins WHERE admin_login=?;", [login],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results[0].admin_id);
                }
                else resolve(null);
            }
        );
    });
}

const checkLoginCredentials = (login, pwd) => {
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
            "SELECT COUNT(*) as cnt FROM tbl_admins WHERE admin_login=? AND admin_password=?;", [ login, pwd ],
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

module.exports = {
    getAdminIdFromLogin,
    checkLoginCredentials
}