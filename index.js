require("dotenv").config();

const port = process.env.PORT

const db = require("./db");

const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.json({ message: "Olá, mundo!" });
});

app.listen(port, async () => {
    console.log(`Servidor rodando na porta ${port}`);

    try {
        await db.setupDatabase();
        console.log("Banco de dados configurado");
    } catch (error) {
        console.error("Erro ao configurar o banco de dados:", error);
    }
})