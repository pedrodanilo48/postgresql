require("dotenv").config();

const port = process.env.PORT
//process.env servirá para acessar as variáveis de ambiente definidas no arquivo .env
//process.env não pode ser escrito de outra forma, é uma variável de ambiente global que o Node.js fornece para acessar as variáveis de ambiente do sistema operacional.
//por outro lado, dotenv é uma biblioteca que carrega as variáveis de ambiente de um arquivo .env para process.env, permitindo que você defina suas variáveis de ambiente em um arquivo separado e as acesse facilmente em seu código.
const db = require("./db");

const express = require("express");
// Express é um framework web para Node.js que facilita a criação de servidores e APIs. Ele fornece uma estrutura simples e flexível para lidar com rotas, requisições e respostas HTTP, além de oferecer suporte a middleware para adicionar funcionalidades adicionais ao seu aplicativo.
const app = express();
//ao criar uma instância do Express, você pode usar o objeto "app" para definir rotas, middleware e outras configurações do servidor. Ele é a base para construir seu aplicativo web usando o Express.
const cors = require("cors");
// CORS (Cross-Origin Resource Sharing) é um mecanismo de segurança implementado pelos navegadores para controlar o acesso a recursos em um servidor a partir de domínios diferentes. Ele é usado para permitir ou restringir solicitações de recursos entre diferentes origens (domínios) e é essencial para garantir a segurança das aplicações web. O middleware "cors" do Express facilita a configuração das políticas de CORS em seu servidor, permitindo que você defina quais origens têm permissão para acessar seus recursos e quais métodos HTTP são permitidos.
app.use(cors());

app.use(express.json());
//ao usar o middleware express.json(), você pode acessar o corpo da requisição como um objeto JSON
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
        await db.updateCustomer(id, dadosNovos);
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