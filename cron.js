const fs = require('fs');
const dir = `${__dirname}/datatest`;
const data = new Date( );
const now = new Date().getTime();


if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}


const fileName = `${dir}/${now}.txt`;

fs.writeFileSync(fileName, data);