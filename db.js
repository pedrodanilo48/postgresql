async function connect(){

    if(global.connection) 
        return global.connection.connect();

    const { Pool }  = require("pg");
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });

    const client = await pool.connect();
    console.log("Pool criado");

    const res = await client.query("select now()");
    console.log(res.rows[0]);
    client.release();

    global.connection = pool;
    return pool.connect();
}

async function selectCustomer(){
    const client = await connect();
    const res = await client.query("SELECT * FROM clientes");
    return res.rows;
}

async function setupDatabase(){
    const client = await connect();
    const query = `CREATE TABLE IF NOT EXISTS  clients (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL);`;

    await client.query(query);
    client.release();
    console.log("Estrutura da tabela criada");
}

module.exports = { connect, selectCustomer, setupDatabase };