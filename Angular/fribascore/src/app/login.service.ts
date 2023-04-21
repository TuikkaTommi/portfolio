import { Injectable } from '@angular/core';

// Service, joka käsittelee kirjautumiseen liittyviä toimintoja

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  logged!: boolean;
  loggedUser = '';

  constructor() { }

  // Metodi, joka saa parametrikseen LoginComponentista tulevan käyttäjätunnuksen
  // ja asettaa sen tällä hetkellä kirjautuneeksi käyttäjäksi. Asettaa myös this.loggedin
  // trueksi, eli kertoo sovellukselle että sivulle on kirjauduttu sisään.
  login(username: string) {
    this.logged = true;
    this.loggedUser = username;
  }

  // Metodi, joka kirjaa käyttäjän ulos palauttamalla kirjautumistilanteen, ja tyhjentää käyttäjätunnuksen
  logout() {
    this.logged = false;
    this.loggedUser = '';
  }

}
