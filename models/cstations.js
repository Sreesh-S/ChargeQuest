const mysql = require('mysql2/promise');
const dbconfig = require('./dbconfig');
const ApiResponse = require('./ApiResponse');

const getAll = async () => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_chargingstations;");
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

const get = async (csid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_chargingstations WHERE chargingstation_id=?;", [csid],);
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

const search = async (ctid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_chargingstations NATURAL JOIN tbl_chargingports NATURAL JOIN tbl_chargetypes WHERE chargetype_id=?;", [ctid]);
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

const checkDuplicate = async (name, lat, lng) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT COUNT(*) as cnt FROM tbl_chargingstations WHERE chargingstation_name=? AND chargingstation_lat=? AND chargingstation_lng=?;", [ name, lat, lng ]);
        
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

const create = async (name, lat, lng) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("INSERT INTO `tbl_chargingstations`(`chargingstation_name`,`chargingstation_lat`,`chargingstation_lng`) VALUES (?,?,?);", [ name, lat, lng ]);
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

const update = async (csid, name, lat, lng) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("UPDATE `tbl_chargingstations` SET `chargingstation_name` = ?,`chargingstation_lat` = ?,`chargingstation_lng` = ? WHERE `chargingstation_id` = ?;", [ name, lat, lng, csid ]);
        
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

const updateStatus = async (csid, status) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("UPDATE `tbl_chargingstations` SET `chargingstation_status` = ? WHERE `chargingstation_id` = ?;", [ status, csid ]);
        
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

const remove = async (csid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("DELETE FROM `tbl_chargingstations` WHERE `chargingstation_id` = ?;", [ csid ]);
        
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
    search,
    checkDuplicate,
    create,
    update,
    updateStatus,
    remove
};