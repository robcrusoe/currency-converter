import { SearchHistory } from './../../models/search-history.interface';
import { ConversionResponse } from './../../models/conversion-response.interface';
import { Urls } from './../../shared/urls';
import { environment } from './../../../environments/environment';
import { SymbolsData } from './../../models/symbols-data.interface';
import { CurrencyProcessorService } from './../../services/currency-processor.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	/* Declares API for fetching all currency symbols from server */
	_FETCHSYMBOLSAPI: string = environment.serverURL + Urls.fetchSymbols;
	/* Declares API for converting currency amount */
	_CONVERTCURRENCYAPI: string = environment.serverURL + Urls.convertCurrency;

	/* Class Field variables */
	symbolsData: SymbolsData[] = [];
	conversionForm: FormGroup;
	isInitialDataLoaded: boolean = false;
	maxConversionDate: Date;
	minConversionDate: Date;


	constructor(
		private _currencyProcessorService: CurrencyProcessorService,
		private _formBuilder: FormBuilder
	) { }


	ngOnInit(): void {
		this.fetchCurrencySymbols();
		this.initializeConversionForm();
	}


	/* Initializes Conversion Form on App Load */
	initializeConversionForm(): void {
		this.conversionForm = this._formBuilder.group({
			baseCurrencyVal: this._formBuilder.control(1, [Validators.required, Validators.min(0)]),
			baseCurrency: this._formBuilder.control('NOK', [Validators.required]),
			targetCurrencyVal: this._formBuilder.control({ value: null, disabled: true }),
			targetCurrency: this._formBuilder.control('USD', [Validators.required]),
			conversionDate: this._formBuilder.control(null)
		});

		this.maxConversionDate = new Date();
		this.minConversionDate = new Date(2000, 0, 1, 0, 0, 0)
		this.performConversion(true);
	}


	/** Computes the result for currency conversion [Default: NOK -> USD] 

		Arguments:
		optional param: initialLoad: Determines whether data is being fetched for first time on app bootstrap
		optional param: processedDate: For computation of amounts pertaining to Historical Data
	*/
	performConversion(initialLoad?: boolean, processedDate?: string): void {
		if (this.conversionForm.value.baseCurrencyVal === 0 || !this.conversionForm.value.baseCurrencyVal) {
			this.conversionForm.patchValue({
				targetCurrencyVal: 0
			});

			return;
		}

		this._currencyProcessorService.performConversion(this._CONVERTCURRENCYAPI, this.conversionForm.value.baseCurrency, this.conversionForm.value.baseCurrencyVal, this.conversionForm.value.targetCurrency, processedDate).subscribe((conversionResponse: ConversionResponse) => {
			console.log("Conversion Response: ", conversionResponse);

			this.saveDataToSearchHistory(conversionResponse.query.from, conversionResponse.query.amount, conversionResponse.query.to, conversionResponse.result);

			this.conversionForm.patchValue({
				targetCurrencyVal: conversionResponse.result
			});

			if (initialLoad) {
				this.isInitialDataLoaded = true;
			}
		}, (errorData: HttpErrorResponse) => {
			console.warn("Error [Convert -> Currency]: ", errorData);
		});
	}


	/** Stores data for amount conversion operation to the search history logs
	
		Arguments:
		param: baseCurrency: The currency to be converted from
		param: baseCurrencyVal: The amount to be converted from
		param: targetCurrency: The currency to be converted to
		param: convertedAmount: The converted amount received from web-service
	*/
	saveDataToSearchHistory(baseCurrency: string, baseCurrencyVal: number, targetCurrency: string, convertedAmount: number): void {
		let searchHistoryEl: SearchHistory = {
			baseCurrency: baseCurrency,
			targetCurrency: targetCurrency,
			baseAmount: baseCurrencyVal,
			convertedAmount: convertedAmount,
			exchangeDate: this.conversionForm.value.conversionDate ? this.conversionForm.value.conversionDate : new Date()
		}

		this._currencyProcessorService.updateSearchHistoryLog(searchHistoryEl);
	}


	/* Fetches all the current currency symbols on App Load */
	fetchCurrencySymbols(): void {
		this._currencyProcessorService.fetchCurrencySymbols(this._FETCHSYMBOLSAPI).subscribe((symbolsData: SymbolsData[]) => {
			console.log("Symbols Data [- Processed]: ", symbolsData);

			this.symbolsData = symbolsData;
		}, (errorData: HttpErrorResponse) => {
			console.warn("Error [Fetch -> Symbols]: ", errorData);
		});
	}


	/** Implements search on 'symbolsData' array to obtain selected symbol description

		Arguments:
		param: type: determines whether the description is for base currency or target currency

		Returns:
		A string with currency description
	*/
	getCurrencyDesc(type: string): string {
		let currencyCode: string;
		if (type == 'base') {
			currencyCode = this.conversionForm.controls.baseCurrency.value;
		}
		else if (type == 'target') {
			currencyCode = this.conversionForm.controls.targetCurrency.value;
		}

		for (let symbol of this.symbolsData.slice()) {
			if (symbol.code == currencyCode) {
				return symbol.desc;
			}
		}
	}


	/** Implements search on 'symbolsData' array to obtain selected symbol value

		Arguments:
		param: type: determines whether the description is for base currency or target currency

		Returns:
		A number with currency value
	*/
	getCurrencyValue(type: string): number {
		if (type == 'base') {
			return this.conversionForm.controls.baseCurrencyVal.value;
		}
		else if (type == 'target') {
			return this.conversionForm.controls.targetCurrencyVal.value;
		}
	}


	/* Updates currency conversion results on changes to baseCurrency | targetCurrency */
	onChangeBaseCurrency(): void {
		this.performConversion();
	}


	/* Updates currency conversion results on changes to baseCurrencyVal | targetCurrencyVal */
	onCurrencyUpdate(): void {
		this.performConversion();
	}


	/* Computes the amount based on the historic price data */
	onFetchHistoricPrice(): void {
		let processedDate: string = this.getConvertedDate(this.conversionForm.value.conversionDate);

		this.performConversion(false, processedDate);
	}


	/** Computes the accepted convention of date string format for the web-services
	
		Arguments:
		param: date: A 'Date' object to be converted to accepted string format of YYYY-MM-DD

		Returns:
		A string (date) of format YYYY-MM-DD
	*/
	getConvertedDate(date: Date): string {
		let processedDate: string = date.getFullYear().toString() + "-";

		if ((date.getMonth() + 1).toString().length == 1) {
			processedDate += ("0" + (date.getMonth() + 1).toString() + "-");
		}
		else {
			processedDate += ((date.getMonth() + 1).toString() + "-");
		}

		if (date.getDate().toString().length == 1) {
			processedDate += ("0" + (date.getDate() + 1).toString());
		}
		else {
			processedDate += ((date.getDate() + 1).toString());
		}

		return processedDate;
	}

}
