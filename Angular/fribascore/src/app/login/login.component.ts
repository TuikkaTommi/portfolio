import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // asetetaan kirjautumisen oletusarvoksi false, jotta sovelluksen avautuessa sovellukseen ei ole kirjauduttu
  logged = false;

  // Otetaan loginService käyttöön tässä komponentissa
  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  // Metodi, joka kirjaa käyttäjän sisään lähettämällä lomakkeelta saadun käyttäjätunnuksen
  // loginServicen login() -metodille
  login(username: string, password: string): void {
    username = username.trim();
    password = password;
    if (!username || !password) { 
      return; 
    }
    this.loginService.login(username);
  }

}
