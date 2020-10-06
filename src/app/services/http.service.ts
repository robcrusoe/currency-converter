import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class HttpService {


	constructor(
		private _http: HttpClient
	) { }


	/** Declares method to consume web-services
	
		Arguments:
		param: API: The API Endpoint / Web-service URL
		param: method: Processes either 'GET' or 'POST'
		optional param: dataToPost: Data to be sent to server in case of 'POST' request

		Returns:
		An observable with standard HTTP Response
	*/
	fetchDataFromServer(API: string, method: string, dataToPost?: any): Observable<any> {
		if(method == 'GET') {
			return this._http.get(API);
		}
		else if(method == 'POST') {
			return this._http.post(API, dataToPost);
		}
	}

}
