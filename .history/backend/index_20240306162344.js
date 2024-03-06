const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');


const app = express();
dotenv.config();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
app.use('/user', userRoutes);
app.use('/product', productRoutes);

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
    console.log("connected to database!");
    })
    .catch((err) => {
    console.log("Error connecting to database", err);
    });

    app.get('/', (req, res) => {
        res.send("welcome to E-commerce website");
    });
  
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
})