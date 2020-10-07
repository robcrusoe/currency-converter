import { LatestRates } from './../../models/latest-rates.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
	/* Declares API to fetch the latest currency conversion rates */
	_FETCHLATESTRATES: string = environment.serverURL + Urls.latestRates;

	/* Class field variables */
	symbolsData: SymbolsData[] = [];
	isCurrencyEvalLoaded: boolean = false;
	currencyEvalForm: FormGroup;
	latestRates: LatestRates[] = [];


	constructor(
		private _currencyProcessorService: CurrencyProcessorService,
		private _formBuilder: FormBuilder
	) { }


	ngOnInit(): void {
		this.fetchSymbolsData();
	}


	fetchSymbolsData(): void {
		this._currencyProcessorService.fetchCurrencySymbols(this._FETCHSYMBOLSAPI).subscribe((onFetchSymbolsData: SymbolsData[]) => {
			this.symbolsData = onFetchSymbolsData;
			this.isCurrencyEvalLoaded = true;

			this.initializeCurrencyEvalForm();
		}, (errorData: HttpErrorResponse) => {
			console.warn("Error [Fetch -> Symbols]: ", errorData);
		});
	}


	initializeCurrencyEvalForm(): void {
		this.currencyEvalForm = this._formBuilder.group({
			selectedCurrency: this._formBuilder.control('USD', [Validators.required])
		});

		this.fetchLatestRates();
	}


	fetchLatestRates(): void {
		this._currencyProcessorService.fetchLatestCurrencyRates(this._FETCHLATESTRATES, this.currencyEvalForm.value.selectedCurrency).subscribe((latestRates: LatestRates[]) => {
			this.latestRates = latestRates;
		});
	}


	onRefreshExchangeRates(): void {
		this.fetchLatestRates();
	}

}
