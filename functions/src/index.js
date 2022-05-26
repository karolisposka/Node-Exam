const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { port } = require('./config');
console.log(port);
console.log(port);
const app = express();
const usersRouter = require('../src/routes/v1/users');
const productsRouter = require('../src/routes/v1/products');
const collectionRouter = require('../src/routes/v1/collection');
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.send({ msg: 'server is running' });
});

app.use('/v1/users', usersRouter);
app.use('/v1/products', productsRouter);
app.use('/v1/collection', collectionRouter);

exports.app = functions.https.onRequest(app);
