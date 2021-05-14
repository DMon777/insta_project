const DB = require('./DB');

// const data = [
//     ['valera'],
//     ['tolik'],
//     ['tanya'],
//     ['dima'],
// ];

const data = ['valera','tolik','tanya','jeka','sasha','dima'];

const db_ins = new DB();
db_ins.insertTestData(data);


