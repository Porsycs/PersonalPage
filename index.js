const Sentry = require("@sentry/node");
require("./instrument.js");

const express = require('express');
const i18n = require('i18n');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser'); // Adicionar a importação
require('dotenv').config();

const app = express();
const port = 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public/images', 'icon.png')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser()); // Adicionar o middleware

const contactController = require('./controller/contact/ContactController.js');

// Configuração do i18n
i18n.configure({
  locales: ['en', 'pt'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  cookie: 'lang'
});
app.use(i18n.init);

// Middleware para mudar o idioma
app.use((req, res, next) => {
  let lang = req.cookies?.lang || 'en';  // Verifica se já existe um cookie de linguagem
  i18n.setLocale(req, lang);
  next();
});

// Configure o Sequelize e os modelos
const sequelize = require('./models/index.js');
sequelize.sync({ force: false });

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
      myname: res.__('myname'),
      about: res.__('about'),
      aboutdescription: res.__('aboutdescription'),
      skills: res.__('skills'),
      others: res.__('others'),
      experience: res.__('experience'),
      work1: res.__('work1'),
      work1description: res.__('work1description'),
      work2: res.__('work2'),
      work2description: res.__('work2description'),
      contact: res.__('contact'),
      contactdescription: res.__('contactdescription'),
    });
  } catch (err) {
    res.status(500).send('Erro ao acessar página inicial');
  }
});

// Rota para mudar o idioma
app.get('/change-language/:lang', (req, res) => {
  const lang = req.params.lang;
  res.cookie('lang', lang);  // Define o idioma como cookie
  res.redirect('back');      // Redireciona de volta para a página anterior
});

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
