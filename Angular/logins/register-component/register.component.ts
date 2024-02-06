import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {StateManagementService} from '../state-management.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
	constructor(
		private loginservice: LoginService,
		private stateservice: StateManagementService
	) {}

	// Variables for registration-form values
	email: string = '';
	password: string = '';
	passwordconfirm: string = '';

	// Variables to see if there was an error with passwords or registration
	pwError: boolean = false;
	registerError: boolean = false;
	invalidSchool: boolean = false;

	// Variables for account confirmation forn values.
	emailToConfirm: string = '';
	code!: number;

	// Variable to see if the user has accepted the terms of service
	acceptTerms: boolean = false;

	// Variable to see if there is an error confirming the useraccount
	confirmError: boolean = false;

	// Variable that is sent to the notification component to get correct notification content
	accountAlreadyExists: boolean = false;

	// confirmForm declares if the registration form or the confirmation form should be displayed. Received from the parent-component
	@Input() confirmForm!: boolean;

	// Declarations for the eventemitters
	@Output() logged = new EventEmitter();
	@Output() resetConfirmForm = new EventEmitter();

	ngOnInit(): void {}

	// Method that hides or displays the form
	changeVisibility() {
		this.stateservice.toggleRegisterFormVisibility();
		this.resetConfirmForm.emit();
	}

	// Method that registers a new useraccount
	onSubmit(formData: any) {
		if (formData.pw === formData.pwconfirm) {
			// Checks if the password was confirmed correctly. If yes, continue with the registration, otherwise display an error
			console.log(formData.email + ' ' + formData.pw);
			this.loginservice.register(formData.email, formData.pw).subscribe(
				() => {
					// Functionality of a successful registration
					console.log('Registered');
					this.emailToConfirm = formData.email;
					this.confirmForm = true;
				},
				(Error) => {
					// Error handling
					if (
						Error.error.message ===
						'An account with the given email already exists.'
					) {
						console.log(Error.error.message);
						this.accountAlreadyExists = true;
						this.toggleUserNotification();
					} else if (
						Error.error.message.match(/School with email*/)
					) {
						console.log('invalid school');
						this.invalidSchool = true;
					} else {
						console.log(
							'Error in registration: ' + Error.error.message
						);
						this.registerError = true;
					}
				}
			);
		} else {
			console.log(
				'Salasanat ei täsmää: ' + formData.pw + '' + formData.pwconfirm
			);
			this.pwError = true;
		}
	}

	// Method to confirm the users account
	confirmAccount(formData: any) {
		this.loginservice
			.confirmAccount(this.emailToConfirm, formData.code)
			.subscribe(
				() => {
					// Functionality when the confirmation is successful
					console.log('Confirmed');
					this.changeVisibility();
				},
				(Error) => {
					// Error handling
					this.confirmError = true;
					console.log('Error in confirmation');
				}
			);
	}

	// Method to resend the account confirmation code to the users email
	resendCode() {
		this.loginservice.resendConfirmationCode(this.emailToConfirm).subscribe(
			() => {
				// Functionality of succesfull resend
				console.log('New code sent');
			},

			(Error) => {
				// Error handling
				console.log('Virhe uuden koodin lähettämisessä');
			}
		);
	}

	// Method to reset the user-notification, so the wrong notification is not shown
	resetUserNotification() {
		this.accountAlreadyExists = false;
	}

	// Methods to manage the visibility of different forms and components
	showLoginForm() {
		this.toggleUserNotification();
		this.changeVisibility();
		this.stateservice.toggleLoginFormVisibility();
	}

	showConfirmForm() {
		this.toggleUserNotification();
		this.accountAlreadyExists = false;
		this.confirmForm = true;
	}

	get isUserNotificationVisible(): boolean {
		return this.stateservice.userNotificationVisible;
	}

	toggleUserNotification() {
		this.stateservice.toggleUserNotificationVisibility();
	}
}
