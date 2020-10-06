import { SymbolsData } from './../models/symbols-data.interface';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CurrencyProcessorService {

	private symbols: SymbolsData[] = [];


	constructor(
		private _httpService: HttpService
	) { }


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
