

const {client} = require('pg')

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "BCB",
    password: "samurai",
    port: "5432"
    })

execute()
async function execute() {
    await client.connect()
    console.log("Connected successfully")
    const results = client.query("select * from TEXAS limit 10")
    console.table(results.rows)
    await client.end()
    console.log("Ended successfully")

}