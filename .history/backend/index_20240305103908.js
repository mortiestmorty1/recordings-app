const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); 

mongoose.connect('mongodb+srv://Shoaib:123456789q_@cluster0.nfjcdlr.mongodb.net/recorder');

  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
