const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('index');
});

app.listen(port, () => {
  console.log('started up on port', port);
});