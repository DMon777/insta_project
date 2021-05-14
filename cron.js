const fs = require('fs');
const dir = `${__dirname}/datatest`;
const now = new Date().getTime();
const today = new Date(now);
const data = "hello \n ";


fs.appendFileSync(`${dir}/test.txt`, `${data}`);
