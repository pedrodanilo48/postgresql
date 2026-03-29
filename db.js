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

async function selectCustomer(id){
    const client = await connect();
    const res = await client.query("SELECT * FROM clients WHERE id = $1", [id]);
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

async function insertClient(customer){
	const client = await connect();
	const sql = `INSERT INTO clients (nome, email, uf) VALUES ($1, $2, $3) RETURNING *;`

	const res = await client.query(sql, [customer.nome, customer.email, customer.uf]);
	client.release();
	return res.rows[0];
}

module.exports = { connect, selectCustomer, setupDatabase, insertClient };