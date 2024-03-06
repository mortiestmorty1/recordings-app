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

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
    console.log("connected to database!");
    })
    .catch((err) => {
    console.log("Error connecting to database", err);
    });

    app.get('/', (req, res) => {
        res.send("welcome to recorder-app");
    });
  
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
})