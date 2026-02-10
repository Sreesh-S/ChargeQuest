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
            "SELECT * FROM tbl_chargetypes;", [],
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

const get = (ctid) => {
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
            "SELECT * FROM tbl_chargetypes WHERE chargetype_id=?;", [ctid],
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

const checkDuplicate = (name, desc) => {
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
            "SELECT COUNT(*) as cnt FROM tbl_chargetypes WHERE chargetype_name=? AND chargetype_desc=?;", [ name, desc ],
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

const create = (name, desc) => {
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
            "INSERT INTO `tbl_chargetypes` (`chargetype_name`,`chargetype_desc`) VALUES (?,?);", [ name, desc ],
            function(error, results) {
                if(error) reject(error);                
                else resolve(true);
            }
        );
    });
};

const update = (ctid, name, desc) => {
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
            "UPDATE `tbl_chargetypes` SET `chargetype_name` = ?,`chargetype_desc` = ? WHERE `chargetype_id` = ?;", [ name, desc, ctid ],
            function(error, results) {
                if(error) reject(error);                
                else resolve(true);
            }
        );
    });
};

const remove = (ctid) => {
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
            "DELETE FROM tbl_chargetypes WHERE `chargetype_id` = ?;", [ ctid ],
            function(error, results) {
                if(error) reject(error);                
                else resolve(true);
            }
        );
    });
};

module.exports = {
    getAll,
    get,
    checkDuplicate,
    create,
    update,
    remove
};