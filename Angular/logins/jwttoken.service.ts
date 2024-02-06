import {Injectable} from '@angular/core';
import jwt_decode from 'jwt-decode';

/* This service handles functionalities for jwt-tokens. Decoding of tokens is implemented with
	'jwt-decode' library. The methods allow setting and decoding tokens, getting data from the tokens
	and validating the expiry-status.  */

@Injectable({
	providedIn: 'root',
})
export class JWTTokenService {
	
	// Variable that the token is stored in
	jwtToken: string = '';

	// Variable where the token is stored after decoding
	decodedToken!: {[key: string]: string};

	constructor() {}

	// Method to set the token into a variable
	setToken(token: string) {
		if (token) {
			this.jwtToken = token;
			console.log('In jwtservice setToken: ' + this.jwtToken);
		}
	}

	// Method to decode the JWT by using the jwt_decode library method
	decodeToken(token: string) {
		this.decodedToken = jwt_decode(token);
	}

	// Method that gets the decoded token
	getDecodedToken() {
		console.log(jwt_decode(this.jwtToken));
		return jwt_decode(this.jwtToken);
	}

	// Method to get the username from the decoded token.
	getUser(token: string) {
		this.decodeToken(token);
		console.log(
			'User ' + this.decodedToken
				? String(this.decodedToken.username)
				: null
		);
		return this.decodedToken ? this.decodedToken.username : null;
	}

	// Method to get the time of expiration for the token
	getExpiryTime(token: string) {
		this.decodeToken(token);
		return this.decodedToken ? this.decodedToken.exp : null;
	}

	// Method to check if the token has expired
	isTokenExpired(token: string): boolean {
		const expiryTime: string | null = this.getExpiryTime(token);
		if (expiryTime) {
			console.log(
				'Is token expired: ' +
					(1000 * parseInt(expiryTime) - new Date().getTime() < 5000)
			);
			return 1000 * parseInt(expiryTime) - new Date().getTime() < 5000;
		} else {
			return false;
		}
	}
}
