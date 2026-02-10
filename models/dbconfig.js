require('dotenv').config();

class dbconfig {
    constructor() {
        this.host = process.env.DB_HOST || "localhost";
        this.user = process.env.DB_USER || "root";
        this.password = process.env.DB_PASSWORD || "";
        this.schema = process.env.DB_NAME || "chargequest_db";
    }
}

module.exports = dbconfig;