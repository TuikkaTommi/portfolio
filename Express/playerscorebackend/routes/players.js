/* eslint-disable new-cap */

// reititystiedosto johon tulee tulostietokantaa manipuloivat reitit
const express = require('express');
const router = express.Router();

const pc = require('../controllers/playercontroller');

const authorize = require('../verifytoken'); // authorisointi

// localhost:3000/players/
router.get('/', pc.findAll);

// localhost:3000/players/624db08c2ee17c0bd0a6b81e
router.get('/:id', pc.findByID);

// localhost:3000/players/
router.post('/', authorize, pc.addPlayer);

// localhost:3000/players/updateplayer/Testaaja
router.put('/updateplayer/:username', authorize, pc.updatePlayer);

// localhost:3000/players/addscore/Tommi
router.put('/addScore/:username', authorize, pc.addScore);

// localhost:3000/players/updatescore/Tommi/624ec3b43d69b820ec4c8ff7
router.put('/updatescore/:username/:_id', authorize, pc.updateScore);

// localhost:3000/players/Testaaja1
router.delete('/:username', authorize, pc.deleteByUsername);

// localhost:3000/players/findplayedlessthan/1
router.get('/findplayedlessthan/:roundsplayed', pc.findPlayedLessThan);

// localhost:3000/players/findplayedmorethan/1
router.get('/findplayedmorethan/:roundsplayed', pc.findPlayedMoreThan);

module.exports = router;
