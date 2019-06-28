const express = require("express");
const server = express();
server.use(express.json());

// Array de usuários
const users = ["João", "Roberto", "Renata"];

// Middleware de log
server.use((req, res, next) => {
  console.time("Request time");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request time");
});

// Verifica se o nome do usuário foi informado no corpo da requisição
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "Username is required" });
  }

  return next();
}

// Verifica se o índice existe no array de usuários
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  req.user = user;

  return next();
}

// Mostra todos os usuários
server.get("/users", (req, res) => {
  return res.json(users);
});

// Mostra um usuário
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

// Cria um usuário
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Edita um usuário
server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.send(users);
});

// Exclui um usuário
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

// Iniciar o servidor na porta 3000
server.listen(3000);
