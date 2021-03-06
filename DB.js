
class DB{

    constructor(){
        this.myslq = require('mysql');
        this.pool  =  this.myslq.createPool({
            host : 'localhost',
            database : 'insta_base',
            user : 'root',
            password : '12345xyz'
        });
    }

    prepareArr(data){
        let finalArr = [];
        for(let i of data){
            finalArr.push([i]);
        }
        return finalArr;
    }


    insertDataArr(data, tableName="subscribers" ){
        data  =  this.prepareArr(data);
        this.pool.getConnection( (err, connection ) => {
            if(err) {
                console.log('connection error');
            }
            connection.query(`INSERT INTO ${tableName} (url) VALUES ?`,[data],(err, rows) => {
                if(err){
                    console.log(err)
                    connection.destroy();
                } else{
                    connection.destroy();
                }
            });
        });


    }
    // insertData( tableName, data ){
    //     for( let item of data){
    //         this.pool.getConnection( (err, connection ) => {
    //             if(err) {
    //                 console.log('connection error');
    //             }
    //             connection.query(`INSERT INTO ${tableName} SET ?`,{login : item, friend : 0},(err, rows) => {
    //                 if(err){
    //                     //console.log(err)
    //                     connection.destroy();
    //                 } else{
    //                     connection.release();
    //                     connection.destroy();
    //                 }
    //             });
    //         });
    //     }
    // }

    updateData( tableName, data, condition = '' ){

        this.pool.getConnection( (err, connection ) => {
            if(err) {
                console.log('connection error');
            }
            const sql  =  `UPDATE ${tableName} SET ? ${condition}`;
            connection.query(sql ,data ,(err, rows) => {
                if(err){
                    console.log(err)
                    connection.destroy();
                } else{
                    connection.release();
                    connection.destroy();
                }
            });
        });

    }


    getById(tableName, id ){
        return new Promise( (resolve, reject ) => {
            this.pool.getConnection( (err, connection ) => {
                if(err) {
                    reject(err);
                }
                const sql = `SELECT * FROM ${tableName} WHERE id=${id}`;
                connection.query(sql,(err, rows) => {
                    if(!err){
                        resolve(rows);
                        connection.release();
                        connection.destroy();
                    }
                });
            });
        });

    }


    query(sql){
        return new Promise( (resolve, reject ) => {
            this.pool.getConnection( (err, connection ) => {
                if(err) {
                    reject(err);
                }
                connection.query(sql,(err, rows) => {
                    if(!err){
                        resolve(rows);
                        connection.release(); // ???????????????????? ???????????????????? ?? poll
                        connection.destroy();
                    }
                });
            });
        });
    }

    getAll(tableName){

        return new Promise( (resolve, reject ) => {

            this.pool.getConnection( (err, connection ) => {
                if(err) {
                    reject(err);
                }
                const sql = `SELECT * FROM ${tableName}`;
                connection.query(sql,(err, rows) => {
                    if(!err){
                        resolve(rows);
                        connection.release(); // ???????????????????? ???????????????????? ?? poll
                        connection.destroy();
                    }
                });
            });

        });

    }

}

module.exports = DB;