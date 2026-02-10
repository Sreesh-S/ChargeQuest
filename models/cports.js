const mysql = require('mysql2/promise');
const dbconfig = require('./dbconfig');
const ApiResponse = require('./ApiResponse');

const getAll = async (csid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_chargingports NATURAL JOIN tbl_chargetypes WHERE chargingstation_id=?;", [ csid ]);
        resp.code = 0;
        resp.message = 'ok';
        resp.data = rows;

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};

const get = async (cpid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_chargingports WHERE chargingport_id=?;", [cpid],);
        resp.code = 0;
        resp.message = 'ok';
        resp.data = rows[0] || null;

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};

const checkDuplicate = async (csid, name, ctid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT COUNT(*) as cnt FROM tbl_chargingports WHERE chargingstation_id=? AND chargingport_name=? AND chargetype_id=?;", [ csid, name, ctid ]);
        
        if(rows[0].cnt > 0) {
            resp.code = 0;
            resp.message = 'ok';
            resp.data = true;
        }
        else {
            resp.code = 0;
            resp.message = 'ok';
            resp.data = false;
        }

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};

const create = async (csid, name, ctid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("INSERT INTO `tbl_chargingports` (`chargingstation_id`,`chargingport_name`,`chargetype_id`) VALUES (?,?,?);", [ csid, name, ctid ]);
        const [rows, fields] = await connection.query("SELECT LAST_INSERT_ID() as lid;");
        
        resp.code = 0;
        resp.message = 'Charging station added!';
        resp.data = rows[0].lid || null;

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};

const update = async (cpid, name, ctid, status) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("UPDATE `tbl_chargingports` SET `chargingport_name` = ?,`chargetype_id` = ?,`cp_status` = ? WHERE `chargingport_id` = ?;", [ name, ctid, status, cpid ]);
        
        resp.code = 0;
        resp.message = 'Charging station updated!';
        resp.data = null;

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};

const remove = async (cpid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("DELETE FROM `tbl_chargingports` WHERE `chargingport_id` = ?;", [ cpid ]);
        
        resp.code = 0;
        resp.message = 'Charging station removed!';
        resp.data = null;

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};

module.exports = {
    getAll,
    get,
    checkDuplicate,
    create,
    update,
    remove
};