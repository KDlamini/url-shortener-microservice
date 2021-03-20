require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const validate = require('url-validator');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const app = express();

//database connection
let uri = mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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
  original_url: { type: String, required: true },
  short_url: String
})

const Url = mongoose.model('Url', urlSchema);

app.post('/api/shorturl/new', bodyParser.urlencoded({extended: false}) , (req, res) => {
  let requested_url = validate(req.body.url);

  if(requested_url) {

    let suffix = shortid.generate();
    let shorturl = suffix;

    let url_document = new Url({
      original_url: requested_url,
      short_url: shorturl
    });

    url_document.save((error, doc) => {
      if(error) {
        console.log(error);
      } else {
        console.log("Successfuly saved document!")
        res.json({
          original_url: doc.original_url,
          short_url: doc.short_url
        })
      }
    });
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short', (req, res) => {
   
  Url.findOne({short_url: req.params.short}, (error, data) => {
    if(error) {
      console.log(error);
    } else {
      res.redirect(data.original_url);
    }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
