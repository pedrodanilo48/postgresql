require("dotenv").config();

const port = process.env.PORT

const 

const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.json({ message: "Olá, mundo!" });
});

app.listen(port);

console.log(`Servidor rodando na porta ${port}`);