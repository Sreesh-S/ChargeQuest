const mysql = require('mysql2/promise');
const dbconfig = require('./dbconfig');
const ApiResponse = require('./ApiResponse');

const getAll = async (uid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_vehicles NATURAL JOIN tbl_chargetypes WHERE user_id=?;", [ uid ]);
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

const get = async (vid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_vehicles NATURAL JOIN tbl_chargetypes WHERE vehicle_id=?;", [vid]);
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

const checkDuplicate = async (uid, comp, model, ctid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT COUNT(*) as cnt FROM tbl_vehicles WHERE user_id=? AND company=? AND model=? AND chargetype_id=?;", [ uid, comp, model, ctid ]);
        
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

const create = async (uid, comp, model, ctid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("INSERT INTO `tbl_vehicles` (`company`,`model`,`chargetype_id`,`user_id`) VALUES (?,?,?,?);", [ comp, model, ctid, uid ]);
        const [rows, fields] = await connection.query("SELECT LAST_INSERT_ID() as lid;");
        
        resp.code = 0;
        resp.message = 'Vehicle added!';
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

const update = async (vid, comp, model, ctid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("UPDATE `tbl_vehicles` SET `company` = ?,`model` = ?,`chargetype_id` = ? WHERE `vehicle_id` = ?;", [ comp, model, ctid, vid ]);
        
        resp.code = 0;
        resp.message = 'Vehicle updated!';
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

const remove = async (vid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("DELETE FROM `tbl_vehicles` WHERE `vehicle_id` = ?;", [ vid ]);
        
        resp.code = 0;
        resp.message = 'Vehicle removed!';
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