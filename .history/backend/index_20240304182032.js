const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose.connect('your_mongodb_connection_string', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define routes
app.get('/', (req, res) => res.send('Hello World!'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
