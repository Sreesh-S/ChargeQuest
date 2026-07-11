require('dotenv').config();

// Monkey-patch mysql2 and mysql2/promise to support custom DB_PORT
// since all models construct connection options manually without passing port.
const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');

const dbPort = parseInt(process.env.DB_PORT) || 3306;

const originalCreateConnection = mysql.createConnection;
mysql.createConnection = function(config) {
    if (config && typeof config === 'object' && !config.port) {
        config.port = dbPort;
    }
    return originalCreateConnection.apply(this, arguments);
};

const originalPromiseCreateConnection = mysqlPromise.createConnection;
mysqlPromise.createConnection = function(config) {
    if (config && typeof config === 'object' && !config.port) {
        config.port = dbPort;
    }
    return originalPromiseCreateConnection.apply(this, arguments);
};

class dbconfig {
    constructor() {
        this.host = process.env.DB_HOST || "localhost";
        this.user = process.env.DB_USER || "root";
        this.password = process.env.DB_PASSWORD || "";
        this.schema = process.env.DB_NAME || "chargequest_db";
        this.port = dbPort;
    }
}

module.exports = dbconfig;