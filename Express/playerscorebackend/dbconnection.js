const mongoose = require('mongoose');
require('dotenv').config(); //dotenv -moduuli tarvitaan jos aiotaan käyttää .env -filua

// yhteydenotto omalla koneella sijaitsevaan kantaan jossa ei ole autentikaatiota
// mongoose.connect('mongodb://@localhost:27017/testdb',{ useNewUrlParser: true });

// yhteydenotto Docker-kontissa sijaitsevaan kantaan, MONGODB_URL on .env tiedostossa:
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, // optioita eli konffimäärityksiä
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error: ' + err);
  });
