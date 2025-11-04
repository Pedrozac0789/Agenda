// INICIO CONEXÃO COM BANCO DE DADOS

const mysql = require("mysql2");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const conexao = mysql.createConnection(process.env.MYSQL_PUBLIC_URL);

const app = express();
const port = 3002;
app.use(cors());
app.use(express.json());

// FIM DA CONEXÃO COM BANCO DE DADOS

app.get("/", async (req, res) => {
  try {
    const sql = "SELECT NOW();";
    const [result] = await conexao.promise().query(sql);
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro ao buscar tarefas");
  }
});

// MOSTRAR TABELAS DOS DIAS DA SEMANA

// MOSTRAR A TABELA DAS TAREFAS

app.get("/tarefasHoje/:date", async (req, res) => {
  try {
    const date = req.params.date; //forma diferente
    console.log(date);
    const sql = "SELECT * FROM tarefas WHERE date = ?";
    const [result] = await conexao.promise().query(sql, [date]);
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro ao buscar tarefas");
  }
});

app.get("/tarefas/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const sql = "SELECT * FROM tarefas WHERE date = ?";
    const [result] = await conexao.promise().query(sql, [date]);
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro ao buscar tarefas por data");
  }
});

// buscar tarefa pelo id
app.get("/tarefa/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM tarefas WHERE idtarefas = ?";
    const [result] = await conexao.promise().query(sql, [id]);
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro ao buscar tarefas por id");
  }
});

// TABELA SEMANAL

// ADICIONAR UMA TAREFA , O TEMPO INICIAL E O TEMPO FINAL
//SELECT * FROM tabela WHERE DAYOFWEEK(iddiaSemana) = 1;
app.post("/adicionar", async (req, res) => {
  try {
    const {diaAtual} = req.body;  
    const { descricao } = req.body;
    const { start_time } = req.body;
    const { end_time } = req.body;
    console.log(descricao,diaAtual , start_time, end_time);
    const sql =
      "INSERT INTO  tarefas (descricao, date ,start_time, end_time) VALUES (?, ?, ?, ?)";
    const [result, fields] = await conexao
      .promise()
      .query(sql, [descricao, diaAtual, start_time, end_time]);
  
    return res.json({ message: "Tarefa inserida com sucesso" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro ao inserir informações");
  }
});

// EDITAR

app.patch("/editarTarefas/:idtarefas", async (req, res) => {
  try {
    const { idtarefas } = req.params;
    const { descricao } = req.body;
    const { start_time } = req.body;
    const { end_time } = req.body;
    console.log(idtarefas, descricao, start_time, end_time);
    const sql =
      "UPDATE tarefas SET descricao = ?, start_time = ?, end_time = ? WHERE idtarefas = ?";
    const [result] = await conexao
      .promise()
      .query(sql, [descricao, start_time, end_time, idtarefas]);
    return res.json({ message: "Sua tarefa foi atualizada" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error ao atualizar a tarefa");
  }
});

// DELETAR

app.delete("/deletarTarefa/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM tarefas WHERE idtarefas = ?;";
    const [result] = await conexao.promise().query(sql, [id]);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error ao deletar a tarefa");
  }
});

app.listen(port, () => {
  console.log(`O servidor está rodando em http://localhost:${port}`);
});
