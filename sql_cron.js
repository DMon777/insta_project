const DB = require('./DB');

const dbi = new DB();

const sql = "INSERT INTO test (name) VALUES('dima')";
dbi.query(sql);