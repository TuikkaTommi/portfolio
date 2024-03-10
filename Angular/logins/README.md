## Login- and registration functionality for Angular app

These services and component were a part of our Ticorporate project DigiMajakka. The login-component holds a login-form, the register-component holds a registration-form and the services contain functionality for logging in/out, creating a new user, managing jwt-tokens and manipulating localstorage.

### Login

The form inside [login-component](https://github.com/TuikkaTommi/portfolio/tree/main/Angular/logins/login-component) takes users input from the form and uses the login()-method in [login-service](https://github.com/TuikkaTommi/portfolio/blob/main/Angular/logins/login.service.ts) for sending the credentials to the server. If the login is succesful, [jwttoken-service](https://github.com/TuikkaTommi/portfolio/blob/main/Angular/logins/jwttoken.service.ts) is used to save and decode the token. Then [localstorage-service](https://github.com/TuikkaTommi/portfolio/blob/main/Angular/logins/local-storage.service.ts) will save the users information to local storage. Errors in logging in are handled by logging the given error, and if the error is caused by either the user not existing or not being confirmed, a notification-popup is given.

The full method for logging in inside this component looks like this:

```
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
```

The login()-method in [login-service](https://github.com/TuikkaTommi/portfolio/blob/main/Angular/logins/login.service.ts) creates a http POST-request to the server with the given credentials, and returns a jwt-token if it is succesful:

```
login(email: string, password: string) {
		return this.http.post(
			this.loginUrl,
			`{"email": "${email}", "password": "${password}"}`,
			this.httpOptions
		);
	}
```

Validating that an user is actually logged in to the application is done with the validateLoginStatus()-method inside [login-service](https://github.com/TuikkaTommi/portfolio/blob/main/Angular/logins/login.service.ts). The method checks if a token exists in local storage. If it doesn't, the check fails, and the user is automatically logged out of the application. If a token exists, its expiration time is checked. If the token is still valid, and local storage has correct info, the method returns true, and the validation is successful. The full validation-method looks like this:


```
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
```

Logging out is handled with logout() and setLoggedOutStatus() -methods in [login-service](https://github.com/TuikkaTommi/portfolio/blob/main/Angular/logins/login.service.ts). The logout()-method sends a post-request to the server with the users email. The server then invalidates that users token. After that, the users details are removed from localStorage, and the user is logged out of the application with setLoggedOutStatus() -method.

### Registration

The registration-form has two views; one for entering the new users information, and one for confirming the account after registration. The variable for dictating which view is shown is received as an input from the parent component:


```
@Input() confirmForm!: boolean;
```

The password-inputs from the registration-form are validated by checking that both the password and its confirmation-field have the same value. If they are correct, the given information are sent to the server with register()-method inside [login-service](https://github.com/TuikkaTommi/portfolio/blob/main/Angular/logins/login.service.ts). If the registration is successful, the users email is saved inside a variable, so it can be autofilled in the accounts confirmation-form. The view is also then switched to the confirmation-form. Otherwise an error is displayed. The confirmation is done with a code that is sent to the users email. The user then inputs the code into the form. When the form is submitted, the code and users email is sent to the server where the code is validated. When the registration is successful, the form is closed.
