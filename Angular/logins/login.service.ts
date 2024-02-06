import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JWTTokenService} from './jwttoken.service';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

/* This is a service to handle users login/user creation functionality. It contains functionality for
	logging in and out of the app, validating users login-status, registering and confirming a new account
	and resetting an users password. The methods send and receive data from the backend over http-requests
	and use localstorage for saving/reading/removing data in the application. Localstorage-actions are hndled
	by localStorageService. Validating users login-status uses JWTTokenService for validating the token. */

@Injectable({
	providedIn: 'root',
})
export class LoginService {


	private loginUrl = 'http://localhost:3000/users/signin';
	private logoutUrl = 'http://localhost:3000/users/signout';
	private registerUrl = 'http://localhost:3000/users/signup';
	private confirmUrl = 'http://localhost:3000/users/confirm';
	private resendCodeUrl = 'http://localhost:3000/users/resend';
	private sendPwResetUrl = 'http://localhost:3000/users/reset/sendcode';
	private confirmPwResetUrl = 'http://localhost:3000/users/reset/confirm';

	tokens: any;

	constructor(
		private http: HttpClient,
		private jwtservice: JWTTokenService,
		private localstorageservice: LocalStorageService
	) {}

	// Options for http-requests
	httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			authorization: String(this.localstorageservice.get('token')),
		}),
	};

	// Method that logs the user in. Returns the authorization token
	login(email: string, password: string) {
		return this.http.post(
			this.loginUrl,
			`{"email": "${email}", "password": "${password}"}`,
			this.httpOptions
		);
	}

	// Method that checks if the user is logged in and the jwt token hasn't expired
	validateLoginStatus(): boolean {
		if (this.localstorageservice.get('token')) {
			if (
				!this.jwtservice.isTokenExpired(
					String(this.localstorageservice.get('token'))
				) &&
				this.localstorageservice.get('loggedIn') === 'true'
			) {
				return true;
			} else {
				this.localstorageservice.remove('user');
				this.localstorageservice.remove('token');
				this.localstorageservice.set('loggedIn', 'false');
				return false;
			}
		} else {
			this.localstorageservice.remove('user');
			this.localstorageservice.remove('token');
			this.localstorageservice.set('loggedIn', 'false');
			return false;
		}
	}

	// Method to log the user out
	logout(email: string) {
		return this.http.post(
			this.logoutUrl,
			`{"email": "${email}"}`,
			this.httpOptions
		);
	}

	setLoggedOutStatus() {
		this.localstorageservice.remove('token');
		this.localstorageservice.remove('loggedIn');
		this.localstorageservice.remove('user');
	}

	// Method to register a new user to the service
	register(email: string, password: string) {
		return this.http.post(
			this.registerUrl,
			`{"email": "${email}", "password": "${password}"}`,
			this.httpOptions
		);
	}

	// Method to confirm a new account with the code sent to email
	confirmAccount(email: string, code: number) {
		return this.http.post(
			this.confirmUrl,
			`{"email": "${email}", "code": "${code}"}`,
			this.httpOptions
		);
	}

	// MEthod to resend the account confirmation code to users email
	resendConfirmationCode(email: string) {
		return this.http.post(
			this.resendCodeUrl,
			`{"email": "${email}"}`,
			this.httpOptions
		);
	}

	// Method to send a password reset code to users email
	sendPasswordResetCode(email: string) {
		return this.http.post(
			this.sendPwResetUrl,
			`{"email": "${email}"}`,
			this.httpOptions
		);
	}

	// Method to confirm the password reset with th code sent to users email
	resetPwWithCode(email: string, code: number, newPassword: string) {
		return this.http.post(
			this.confirmPwResetUrl,
			`{"email": "${email}", "confirmationCode": "${code}", "newPassword": "${newPassword}"}`,
			this.httpOptions
		);
	}
}
