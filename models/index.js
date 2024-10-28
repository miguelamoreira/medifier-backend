const mongoose = require("mongoose");
const dbConfig = require('../config/dbConfig.js'); 

const db = {};
db.mongoose = mongoose;

(async () => {
    try {
        console.log(dbConfig.URL);
        await db.mongoose.connect(dbConfig.URL);
        console.log('Connected to the database!');
    } catch (error) {
        console.log('Cannot connect to the database! ', error);
        process.exit()
    }
})();

module.exports = db;