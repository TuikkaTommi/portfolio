/* eslint-disable new-cap */
/*
Kontrolleri on olio, joka sisältää metodeja. Se tehty siksi, että
saadaan erotettua reitit ja tietokantahakujen sovelluslogiikka toisistaan.
Se on siis arkkitehtuuriratkaisu. Eli saamme aikaan järkevämmän arkkitehtuurin
kun jaamme eri asioita tekevän koodin eri tiedostoihin ja kansioihin.
*/

const Player = require('../models/Player'); // haetaan model

// Tietokannan käsittelymetodit tehdään olion sisään
// metodin nimi on avain ja sen runko on arvo
const PlayerController = {
  // findAll suorittaa kaikkien pelaajien haun
  findAll: (req, res) => {
    Player.find((error, players) => {
      if (error) {
        throw error;
      }
      res.json(players);
    });
  },
  // findByID hakee yhden pelaajan id:perusteella
  findByID: (req, res) => {
    Player.findOne({ _id: req.params.id }, (error, player) => {
      if (error) {
        throw error;
      }
      res.json(player);
    });
  },
  // addPlayer lisää uuden pelaajan tietokantaan
  addPlayer: (req, res) => {
    const newPlayer = Player(req.body);
    Player.create(newPlayer)
      .then((player) => {
        console.log('Player inserted succesfully: ' + player);
        res.json(player);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  // updatePlayer päivittää pelaajan tietoja
  updatePlayer: (req, res) => {
    Player.updateOne(
      { username: req.params.username },
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
        },
      }
    )
      .then((result) => {
        console.log('Player updated succesfully: ' + result);
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  // addScore lisää pelaajalle uuden tuloksen ja nostaa pelattuejen kierrosten määrää yhdellä
  addScore: (req, res) => {
    Player.updateOne(
      { username: req.params.username },
      {
        $push: {
          scores: {
            course: req.body.course,
            score: req.body.score,
          },
        },
        $inc: { roundsplayed: 1 },
      }
    )
      .then((result) => {
        res.json(result);
        console.log('Score added succesfully.');
        this.findAll;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  // updateScore päivittää jo lisätyn tuloksen
  updateScore: (req, res) => {
    Player.findOneAndUpdate(
      {
        // eslint-disable-next-line quote-props
        username: req.params.username,
        'scores._id': req.params._id,
      },
      {
        $set: { 'scores.$.score': req.body.score },
      }
    )
      .then((result) => {
        console.log('Score updated succesfully: ' + result);
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  // deleteByusername poistaa pelaajan käyttäjänimen perusteella
  deleteByUsername: (req, res) => {
    Player.findOneAndDelete(
      { username: req.params.username },
      (error, player) => {
        if (error) {
          throw error;
        }
        console.log('Player deleted');
        res.json(player);
      }
    );
  },
  // findPlayedLessThan hakee pelaajat, jotka ovat pelanneet alle tietyn määrän kierroksia
  findPlayedLessThan: (req, res) => {
    Player.find({ roundsplayed: { $lt: req.params.roundsplayed } })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
      });
  },
  // findPlayedMoreThan hakee pelaajat, jotka ovat pelanneet enemmän kuin tietyn määrän kierroksia
  findPlayedMoreThan: (req, res) => {
    Player.find({ roundsplayed: { $gt: req.params.roundsplayed } })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
      });
  },
};

module.exports = PlayerController;
