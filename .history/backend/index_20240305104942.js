const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');


const app = express();
dotenv.config();
const PORT = process.env.PORT || 3002;
app.use(express.json());
app.use(cors());
mongoose.connect('')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
