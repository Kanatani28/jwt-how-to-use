const express = require('express');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf')

const app = express();

app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));

const jwtSecret = 'secret123';

app.get('/jwt', (req, res) => {
  const token = jsonwebtoken.sign({ user: 'johndoe' }, jwtSecret);
  // Set-Cookieヘッダーにtokenをセットする処理
  res.cookie('token', token, { httpOnly: true });
  res.json({ token });
});

app.use(cookieParser());
app.use(jwt({
  secret: jwtSecret,
  algorithms: ['HS256'],
  getToken: req => req.cookies.token 
}));

const csrfProtection = csrf({
  cookie: true
});
app.use(csrfProtection);
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const foods = [
  { id: 1, description: 'burritos' },
  { id: 2, description: 'quesadillas' },
  { id: 3, description: 'churos' }
];

app.get('/foods', (req, res) => {
  res.json(foods);
});

app.post('/foods', (req, res) => {
  foods.push({
    id: foods.length + 1,
    description: 'new food'
  });
  res.json({
    message: 'Food created!'
  });
});

app.listen(3001);
console.log('App running on localhost:3001');