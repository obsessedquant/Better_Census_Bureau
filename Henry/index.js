const {Client} = require('pg')

const client = new Client({
user: "postgres",
host: "localhost",
database: "BCB",
password: "samurai",
port: "5432"
})

client.connect()
.then(() => console.log("Connected to postgres server"))
.catch( e => console.log(e))
.finally(() => client.end)


client.query(`select * from "TEXAS" limit 10`, (err,res)=>{
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end;
})

