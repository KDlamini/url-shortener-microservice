require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;

//database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlSchema = new Schema({
  original: { type: String, required: true },
  short: Number
})

const Url = mongoose.model('Url', urlSchema);

app.post('api/shorturl/new', bodyParser.urlencoded({extended: false}) , (req, res) => {
  
  console.log(req.body);
  res.json({})
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
