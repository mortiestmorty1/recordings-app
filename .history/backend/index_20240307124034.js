const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userroutes');
const textRoutes = require('./routes/textroutes');
const recordingsRoutes = require('./routes/recordingsroutes');
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);
app.use('/text', textRoutes);
app.use('/recordings', recordingsRoutes);

mongoose.connect(process.env.URI)
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