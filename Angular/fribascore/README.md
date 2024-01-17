# Fribascore - Angular

This project was made for the frontend-development course. The application allows the user to manage their disc golf scores. A logged in user can see all the scores and add and delete their own scores. Data is saved in a mock-database, that can be accessed with http-requests. 

Fetching, adding and deleting scores are implemented with [a service](https://github.com/TuikkaTommi/portfolio/blob/main/Angular/fribascore/src/app/score.service.ts) that provides methods for creating the necessary http-requests.

Inside the service the fetching of scores is implemented with the following method:

```
  getScores(): Observable<Score[]> {
    return this.http.get<Score[]>(this.scoresUrl);
  }
```

It makes a http GET-request to the url and returns the result as an Observable. Methods for adding and deleting scores work with a similar principle.

Then a component can fetch all scores by using the previous method for example in the following way:

```
// Import service to the component
import { ScoreService } from '../score.service';

// Scores have an interface that dictates their structure, so their type is Score[]
scores: Score[] = [];

// Method that gets data from service and sets it to a variable inside the component
getScores(): void {
    this.scoreService.getScores().subscribe(scores => this.scores = scores);
  }
```

To enforce the structure of scores, [an interface](https://github.com/TuikkaTommi/portfolio/blob/main/Angular/fribascore/src/app/score.ts) is implemented:

```
export interface Score {
  id: number;
  coursename: string;
  score: string;
  player: string;
  date: string;
}
```

## Users and login

User management in this app is also implemented with [another service](https://github.com/TuikkaTommi/portfolio/blob/main/Angular/fribascore/src/app/login.service.ts). The service holds the information about currently logged in user, and provides the methods for logging in and out of the app. The feature is only a very basic frontend-implementation and is mostly meant for conditional rendering of delete buttons and such. The user logs in to the application by using [this form-component](https://github.com/TuikkaTommi/portfolio/tree/main/Angular/fribascore/src/app/login). The component uses this login-method from login-service:

```
login(username: string) {
    this.logged = true;
    this.loggedUser = username;
  }
```

It simply sets the status of logged to 'true', and sets the username to a variable.

An example of conditional rendering based on the login-status is the delete-button in [this score-list component](https://github.com/TuikkaTommi/portfolio/tree/main/Angular/fribascore/src/app/score-list). The component fetches the login-status from the login-service and based on that either hides or shows the button. It also checks that the logged user is the same user that created the score:

```
 <button *ngIf="logged && score.player === loggedUser" type="button" class="delete" title="delete score" (click)="delete(score)">x</button>
```







This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
