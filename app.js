const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const sequelize = require('./config/database');
const Refugiado = require('./models/Refugiado');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced!');
});


app.get('/', async (req, res) => {
  let refugiados = await Refugiado.findAll();
  refugiados = refugiados.map((refugiado) => refugiados.dataValues);
  
  res.render('index', { refugiados });
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

app.post('/cadastro', async (req, res) => {
  const { nome, id,email,senha } = req.body;
  await Refugiado.create({ nome, id,email,senha });
  res.redirect('/');
});

app.get('/atualizar/:id', async (req, res) => {
  let refugiado = await Refugiado.findByPk(req.params.id);
  refugiado = refugiado.dataValues;
  
  res.render('atualizar', { refugiado});
});

app.post('/atualizar/:id', async (req, res) => {
  const { nome, id,email,senha } = req.body;
  await Refugiado.update({ nome, id,email,senha }, { where: { id: req.params.id } });
  res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
  await Refugiado.destroy({ where: { id: req.params.id } });
  res.redirect('/');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

