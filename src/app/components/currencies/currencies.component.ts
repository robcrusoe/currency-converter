import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyProcessorService } from './../../services/currency-processor.service';
import { SymbolsData } from './../../models/symbols-data.interface';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Urls } from 'app/shared/urls';

@Component({
	selector: 'app-currencies',
	templateUrl: './currencies.component.html',
	styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {

	/* Declares API for fetching all currency symbols from server */
	_FETCHSYMBOLSAPI: string = environment.serverURL + Urls.fetchSymbols;

	/* Class field variables */
	symbolsData: SymbolsData[] = [];


	constructor(
		private _currencyProcessorService: CurrencyProcessorService
	) { }


	ngOnInit(): void {
		this._currencyProcessorService.fetchCurrencySymbols(this._FETCHSYMBOLSAPI).subscribe((onFetchSymbolsData: SymbolsData[]) => {
			this.symbolsData = onFetchSymbolsData;
		}, (errorData: HttpErrorResponse) => {
			console.warn("Error [Fetch -> Symbols]: ", errorData);
		});
	}

}
