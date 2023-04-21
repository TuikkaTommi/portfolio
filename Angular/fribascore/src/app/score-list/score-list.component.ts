// score-list komponentin luokkamäärittelyt eli toiminnallisuus

import { Component, OnInit } from '@angular/core';

import { Score } from '../score';
import { ScoreService } from '../score.service';
import { LoginService } from '../login.service';
 

@Component({
  selector: 'app-score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.css']
})
export class ScoreListComponent implements OnInit {

  constructor(private scoreService: ScoreService, private loginService: LoginService) { }

  // Deklaraatiot eli muutujien esittelyt
  // Määrittää tulostaulukon Score -rajapintaluokan mukaiseksi ja esittelee sen tyhjänä
  scores: Score[] = [];
  // Hakee kirjautumisen tilan loginServicestä
  logged = this.loginService.logged;
  // Hakee kirjautuneen käyttäjän loginServicestä
  loggedUser = this.loginService.loggedUser;

  // Heti componentin latautuessa haetaan tulokset getScores() -metodilla.
  ngOnInit(): void {
    this.getScores();
  }

  // Metodi, joka tilaa ScoreServicestä getScores() -metodin eli tuo tulokset komponenttiin
  getScores(): void {
    this.scoreService.getScores().subscribe(scores => this.scores = scores);
  }


  // Metodi, joka poistaa tuloksen listasta kutsumalla scoreServicen deleteScore() -metodia ja vie sille poistettavan tuloksen
  // id:n parametrina
  delete(score: Score): void {
    this.scores = this.scores.filter(s => s !== score);
    this.scoreService.deleteScore(score.id).subscribe();
  }


  // Metodi, joka kutsuu loginServicen uloskirjausmetodia.
  // Tämän jälkeen päivittää kirjautumisen tilan ja kirjautuneen käyttäjän asettamalla
  // näiden arvot uudestaan.
  logout() {
    this.loginService.logout();
    this.logged = this.loginService.logged;
    this.loggedUser = this.loginService.loggedUser;
  }

  

}
