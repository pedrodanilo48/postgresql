require("dotenv").config();

const port = process.env.PORT

const db = require("./db");

const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.json({ message: "Funcionando" });
});

app.get("/clients/:id", async (req, res) => {
	await db.insertClient(req.body);
	res.json(clients);
    res.sendStatus(201);
});
app.use(express.json());
app.post("/", (req, res) => {
    res.json({ message: "Funcionando" });
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