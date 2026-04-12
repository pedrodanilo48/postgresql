require("dotenv").config();

const port = process.env.PORT

const db = require("./db");

const express = require("express");

const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Funcionando" });
});

app.get('/clients/:id', async (req, res) => {
    const id = req.params.id; // Pega o número que você digitar na URL
    try {
        const customer = await db.selectCustomer(id);
        if (!customer) {
            return res.status(404).json({ mensagem: "Cliente não encontrado" });
        }
        res.json(customer);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.post("/clients", async (req, res) => {
    await db.insertClient(req.body);
    res.sendStatus(201);
});

app.delete("/clients/:id", async (req, res) => {
    await db.deleteCustomer(req.params.id);
    res.sendStatus(204);
});

app.patch("/clients/:id", async (req, res) => {
    await db.updateCustomer(req.params.id, req.body);
    res.sendStatus(200);
});

// index.js
app.put('/clients/:id', async (req, res) => {
    const id = req.params.id;
    const dadosNovos = req.body;
    
    try {
        await db.updateClient(id, dadosNovos);
        res.sendStatus(200); // Envia "OK" para o front-end
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar");
    }
});

app.get('/clients', async (req, res) => {
    try {
        const conexao = await db.connect();
        const resultado = await conexao.query("SELECT * FROM clients");
        
        res.json(resultado.rows); 
    } catch (err) {
        res.status(500).send("Erro ao buscar clientes: " + err.message);
    }
});

app.listen(port, async () => {
    console.log(`Servidor rodando na porta ${port}`);

    try {
        // const newCustomer = await db.insertClient("Pedro", "pedro@gmail.com");
        // console.log("Novo cliente inserido:", newCustomer);
        // await db.setupDatabase();
        // console.log("Banco de dados configurado");
    } catch (error) {
        console.error("Erro ao configurar o banco de dados:", error);
    }
})