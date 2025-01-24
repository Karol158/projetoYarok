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


app.get('/index', async (req, res) => {
    try {
      let refugiados = await Refugiado.findAll();
      refugiados = refugiados.map((refugiado) => refugiado.dataValues); 
      res.render('index', { refugiados });
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao buscar os refugiados.');
    }
  });
app.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

app.post('/cadastro', async (req, res) => {
  const { nome, id,email,senha } = req.body;
  await Refugiado.create({ nome, id,email,senha });
  res.redirect('/index');
});



app.get('/edit/:id', async (req, res) => {
  let refugiado = await Refugiado.findByPk(req.params.id);
  refugiado = refugiado.dataValues;
  res.render('edit', { refugiado});
});

app.post('/edit/:id', async (req, res) => {
  const { nome,email,senha } = req.body;
  await Refugiado.update({ nome,email,senha },{ where: { id: req.params.id } });
  res.redirect('index');
});



app.get('/delete/:id', async (req, res) => {
  await Refugiado.destroy({ where: { id: req.params.id } });
  res.redirect('/index');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
