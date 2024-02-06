import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {JWTTokenService} from '../jwttoken.service';
import {StateManagementService} from '../state-management.service';
import {LocalStorageService} from '../local-storage.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	constructor(
		private loginservice: LoginService,
		private jwtservice: JWTTokenService,
		private stateservice: StateManagementService,
		private localstorageservice: LocalStorageService
	) {}

	// Variables to hold form-values
	email: string = '';
	password: string = '';

	// The jwt-tokens received from backend when logged in will be in this variable
	tokens: any;

	// Variable to see if there was an error during login
	loginError: boolean = false;

	// Variables used to display correct notification content. These are only sent to the notification component and not used here
	accountNotFound: boolean = false;
	accountNotConfirmed: boolean = false;

	// Declarations for eventemitters
	@Output() logged = new EventEmitter();
	@Output() confirm = new EventEmitter();

	ngOnInit(): void {}

	// Method that hides or displays the form
	changeVisibility() {
		this.stateservice.toggleLoginFormVisibility();
	}

	// Method to login
	onSubmit(formData: any) {
		console.log(formData.email + formData.password);
		this.loginservice.login(formData.email, formData.password).subscribe(
			(tokens) => {
				// Functionality when the login is successful
				this.tokens = tokens;
				this.jwtservice.setToken(this.tokens.accessToken);
				this.jwtservice.getDecodedToken();
				this.localstorageservice.set('token', this.tokens.accessToken);
				this.localstorageservice.set('loggedIn', 'true');
				this.localstorageservice.set('user', formData.email);
				this.changeVisibility();
				this.logged.emit();
			},
			(Error) => {
				// Error handling
				console.log(
					'Kirjautumiserrori' + JSON.stringify(Error.error.message)
				);
				this.loginError = true;
				if (Error.error.message === 'User does not exist.') {
					// Functionality if user tries to login to account that doesn't exist
					this.accountNotFound = true;
					this.toggleUserNotification();
				} else if (Error.error.message === 'User is not confirmed.') {
					// The functionality when user tries to login to an account that hasn't been confirmed
					this.accountNotConfirmed = true;
					this.toggleUserNotification();
				}
			}
		);
	}

	// Method to reset the usernotification, so notifications aren't displayed when they are not supposed to
	resetUserNotification() {
		this.accountNotConfirmed = false;
		this.accountNotFound = false;
	}

	// Methods to show/hide different sections and forms
	showRegisterForm() {
		this.toggleUserNotification();
		this.changeVisibility();
		this.stateservice.toggleRegisterFormVisibility();
	}

	showConfirmForm() {
		this.confirm.emit();
		this.toggleUserNotification();
		this.changeVisibility();
	}

	showPwReset() {
		this.changeVisibility();
		this.stateservice.toggleResetPasswordVisibility();
	}

	get isUserNotificationVisible(): boolean {
		return this.stateservice.userNotificationVisible;
	}

	toggleUserNotification() {
		this.stateservice.toggleUserNotificationVisibility();
	}
}
