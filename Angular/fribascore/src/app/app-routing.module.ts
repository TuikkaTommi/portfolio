import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NewScoreComponent } from './new-score/new-score.component';
import { ScoreListComponent } from './score-list/score-list.component';

// Sovelluksen reitit, eli sovelluksen käyttämät url-osoitteet
const routes: Routes = [
  {path: '', redirectTo: 'scores', pathMatch: 'full'}, // Jos url-osoite on tyhjä (localhost:4200) ohjataan käyttäjä suoraan listaan
  {path: 'scores', component: ScoreListComponent}, // Tuloslistan url
  {path: 'new', component: NewScoreComponent}, // Uuden tuloksen lisäyssivun url
  {path: 'login', component: LoginComponent} // Sisäänkirjaussivun url
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
