const  fs  =  require('fs');

class Logger{

    constructor(){
        this.logs = [];
    }

    add(data){
        this.logs.push(data+"\n");
        return this;
    }

    showLogs(){
        for(let i of this.logs ){
            console.log(i);
        }
    }

    writeToFile(){
        const dir = __dirname;
        fs.appendFileSync(`${dir}/logs.txt`, this.createDateString()+"\n" );
        for( let i of this.logs ){
            fs.appendFileSync(`${dir}/logs.txt`, i );
        }
        let separator = "---------------------------------------------------\n\n";
        fs.appendFileSync(`${dir}/logs.txt`, separator );
    }

    createDateString(){
        let now = new Date().getTime();
        let today = new Date(now);
        return today.toLocaleString();
    }

    clean(){
        fs.unlink(`${__dirname}/logs.txt`, (err) => {
            if (err) console.log(err); // если возникла ошибка
            else console.log("файл с логами был удален!");
        });
    }

}

const logger = new Logger();
logger.add('new data');
logger.add('error');
logger.writeToFile();