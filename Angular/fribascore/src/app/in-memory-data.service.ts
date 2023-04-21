import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Score } from './score';

// Service joka toimii valetietokantana sovellukseen. 

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  // Luodaan valetietokannassa valmiiksi olevat tulokset
  createDb() {
    const scores = [
      { id: 1, coursename: 'Hiiska DG', score: -1, player: 'Tommi', date: '2022-06-12' },
      { id: 2, coursename: 'Laajalahden Frisbeegolfrata', score: +2, player: 'Tommi', date: '2022-07-19'},
      { id: 3, coursename: 'Äänekosken Liikuntapuiston frisbeegofrata', score: +4, player: 'Joku', date: '2022-04-07' },
    ];
    return {scores};
  }


  // Metodi, joka luo käyttämättömän id:n tulokselle. Hakee taulukosta isoimman id:n arvon ja lisää siihen +1.
  // Jos taulukko on tyhjä, asetetaan tuloksen id:ksi 1.
  genId(scores: Score[]): number {
    return scores.length > 0 ? Math.max(...scores.map(score => score.id)) + 1 : 1;
  }
}