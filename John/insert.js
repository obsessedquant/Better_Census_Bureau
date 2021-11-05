
const { Client } = require('postgres')

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '{password}',
})

client.connect();

client.query(`select * from "TEXAS" limit 10`, (err,res)=>{
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end;
})