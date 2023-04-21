/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const uc = require('../controllers/usercontroller');

// rekiteröityminen eli luodaan tunnukset
// localhost:3000/users/register
router.post('/register', uc.registerUser);

// kirjautuminen eli autentikaatio luoduilla tunnuksilla
// localhost:3000/users/login
router.post('/login', uc.authenticateUser);

module.exports = router;
