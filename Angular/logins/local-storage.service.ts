import {Injectable} from '@angular/core';

/* This service handles saving, reading and removing data in the browsers localstorage. 
	It consists of three methods, one to set data, one to read data and one to remove data
	from localstorage. */


@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	// Service that manages localstorage
	constructor() {}

	// Method to set data into localstorage
	set(key: string, value: string) {
		localStorage.setItem(key, value);
	}

	// Method to get data from localstorage by its key
	get(key: string) {
		return localStorage.getItem(key);
	}

	// Method to remove an item from localstorage by its key
	remove(key: string) {
		localStorage.removeItem(key);
	}
}
