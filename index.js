const Sentry = require("@sentry/node");
require("./instrument.js");

const express = require('express');
const app = express();
const path = require('path');
const port = 8000;
const favicon = require('serve-favicon');
require('dotenv').config();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Caminho para a pasta de views
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public/images', 'icon.png')));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());


const contactController = require('./controller/contact/ContactController.js');

// Configure o Sequelize e os modelos
const sequelize = require('./models/index.js');
// Sincronize os modelos com o banco de dados
sequelize.sync({force:false});

// Função para calcular a idade
function calcularIdade(anoNascimento, mesNascimento, diaNascimento) {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth();
  const diaAtual = hoje.getDate();

  let idade = anoAtual - anoNascimento;

  if (mesAtual < mesNascimento - 1 || (mesAtual === mesNascimento - 1 && diaAtual < diaNascimento)) {
      idade--;
  }

  return idade;
}

app.use('/', contactController);

app.get('/', async (req, res) => {
  try {

      res.render("index", {
        age: calcularIdade(1998, 1, 29),
      })
  } catch (err) {
      res.status(500).send('Erro ao acessar página inicial');
  }
});

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
