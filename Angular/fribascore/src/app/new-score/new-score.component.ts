// new-score komponentin luokkamäärittelyt eli toiminnallisuus

import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Score } from '../score';
import { ScoreService } from '../score.service';

@Component({
  selector: 'app-new-score',
  templateUrl: './new-score.component.html',
  styleUrls: ['./new-score.component.css']
})
export class NewScoreComponent implements OnInit {

  // Asetetaan scores-taulukko Score-rajapintaluokan mukaiseksi
  scores: Score[] = [];
  // Haetaan kirjattu käyttäjä loginServicestä
  loggedUser = this.loginService.loggedUser;
  
  // Injektoidaan eli otetaan käyttöön servicet 
  constructor(private scoreService: ScoreService, private loginService: LoginService) { }

  ngOnInit(): void {
  }


  // Metodi, joka lisää uuden tuloksen listaan kutsumalla scoreServicen addScore() -metodia ja antaa sille tiedot parametreina.
  add(coursename: string, score: string, player: string, date: string): void {
    coursename = coursename.trim();
    score = score;
    player = this.loggedUser;
    date = date; 
    
    if (!coursename || !score) { 
      return; 
    }
    this.scoreService.addScore({ coursename, score, player, date } as Score)
      .subscribe(score => {
        this.scores.push(score);
      });
  }
}
