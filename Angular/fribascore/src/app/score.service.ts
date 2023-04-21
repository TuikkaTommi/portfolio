import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Score } from './score';

// Service, jolla käsitellään tuloksia

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private http: HttpClient) { }

  // url josta data tulee tässä sovelluksessa, koska oikeaa serveriä ei ole.
  private scoresUrl = 'api/scores'

  // Metodi, joka palauttaa Scores-datan
  getScores(): Observable<Score[]> {
    return this.http.get<Score[]>(this.scoresUrl);
  }


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // Metodi, joka lisää uuden tuloksen listaan http:n post() -metodilla
  addScore(score: Score): Observable<Score> {
    return this.http.post<Score>(this.scoresUrl, score, this.httpOptions);
  }

  // Metodi, joka poistaa tuloksen listasta http:n delete() -metodia käyttäen. 
  // Metodille tuodaan poistettavan tuloksen id parametrina
  deleteScore(id: number): Observable<Score> {
    const url = `${this.scoresUrl}/${id}`;

    return this.http.delete<Score>(url, this.httpOptions);
  }

}
