import { SymbolsData } from './../models/symbols-data.interface';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CurrencyProcessorService {

	/* Stores all the currency conversion data fetched from web-server */
	private symbols: SymbolsData[] = [];


	constructor(
		private _httpService: HttpService
	) { }

	
	/** Fetches all the current currency symbols 
	
		Arguments:
		param: API: The URL end-point for the web-service

		Returns:
		An Observable of generic type 'SymbolsData' (Processed using map operator - rxjs package)
	*/
	fetchCurrencySymbols(API: string): Observable<SymbolsData[]> {
		return this._httpService.fetchDataFromServer(API, 'GET').pipe(
			map((symbolsResponse: any) => {
				console.log("Symbols Response [- Unprocessed From Server]: ", symbolsResponse);

				let symbolsArray: any[] = Object.entries(symbolsResponse.symbols);
				symbolsArray.forEach(([key, value]) => {
					this.symbols.push({
						code: key,
						desc: value
					});
				});

				return this.symbols;
			})
		);
	}

}
