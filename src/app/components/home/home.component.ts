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
	_CONVERTCURRENCYAPI: string = environment.serverURL + Urls.convertCurrency;

	/* Class Field variables */
	symbolsData: SymbolsData[] = [];
	conversionForm: FormGroup;
	isInitialDataLoaded: boolean = false;


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
			targetCurrency: this._formBuilder.control('USD', [Validators.required])
		});

		this.performConversion(true);
	}


	/** Computes the result for currency conversion [Default: NOK -> USD] 

		Arguments:
		optional param: initialLoad: Determines whether data is being fetched for first time on app bootstrap
	*/
	performConversion(initialLoad?: boolean): void {
		if (this.conversionForm.value.baseCurrencyVal === 0) {
			this.conversionForm.patchValue({
				targetCurrencyVal: 0
			});

			return;
		}

		this._currencyProcessorService.performConversion(this._CONVERTCURRENCYAPI, this.conversionForm.value.baseCurrency, this.conversionForm.value.baseCurrencyVal, this.conversionForm.value.targetCurrency).subscribe((conversionResponse: ConversionResponse) => {
			console.log("Conversion Response: ", conversionResponse);

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

}
