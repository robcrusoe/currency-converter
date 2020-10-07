import { SearchHistory } from './../models/search-history.interface';
import { ConversionResponse } from './../models/conversion-response.interface';
import { SymbolsData } from './../models/symbols-data.interface';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LatestRates } from 'app/models/latest-rates.interface';

@Injectable({
	providedIn: 'root'
})
export class CurrencyProcessorService {

	/* Stores all the currency conversion data fetched from web-server */
	private symbols: SymbolsData[] = [];
	private latestRates: LatestRates[] = [];
	private searchHistoryLogs: SearchHistory[] = [];


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
				this.symbols = [];
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


	/** Performs conversion of rates based on baseCurrency and targetCurrency 

		Arguments:
		param: API: The URL end-point for the web-service
		param: baseCurrency: Currency to be converted from
		param: baseCurrencyVal: Currency (amount) to be converted from
		param: targetCurrency: Currency to be converted to
		optional param: processedDate: For computation based on historic data

		Returns:
		An object of type 'ConversionResponse' which includes the 'result' of conversion
	*/
	performConversion(API: string, baseCurrency: string, baseCurrencyVal: number, targetCurrency: string, processedDate?: string): Observable<ConversionResponse> {
		API += ('?from=' + baseCurrency + '&to=' + targetCurrency + "&amount=" + baseCurrencyVal);
		if (processedDate) {
			API += ("&date=" + processedDate);
		}

		return this._httpService.fetchDataFromServer(API, 'GET');
	}


	/** Fetches the latest currency exchange rates for a base currency
	
		Arguments:
		param: API: The URL end-point for the web-service
		param: baseCurrency: The currency for which the exchange rates are fetched for

		Returns:
		An Observable of generic type 'Array of LatestRates'
	*/
	fetchLatestCurrencyRates(API: string, baseCurrency: string): Observable<LatestRates[]> {
		API += ("?base=" + baseCurrency);
		return this._httpService.fetchDataFromServer(API, 'GET').pipe(
			map((latestRates: any) => {
				let exchangeRatesArray: any[] = Object.entries(latestRates.rates);
				this.latestRates = [];
				exchangeRatesArray.forEach(([key, value]) => {
					this.latestRates.push({
						currency: key,
						rate: value
					});
				});

				return this.latestRates;
			})
		);
	}


	/** Updates the logger array which maintains app search history for currency conversions
	
		Arguments:
		param: searchHistoryEl: An object of type 'SearchHistory' (The logger object)
	*/
	updateSearchHistoryLog(searchHistoryEl: SearchHistory): void {
		this.searchHistoryLogs.push(searchHistoryEl);
	}


	/** Method to return the updated search history logs for currency conversion
	
		Returns:
		param: An array of type 'SearchHistory' (The search history logger array)
	*/
	getSearchHistoryLog(): SearchHistory[] {
		return [...this.searchHistoryLogs];
	}

}
