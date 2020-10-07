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

	/* Class Field variables */
	symbolsData: SymbolsData[] = [];
	conversionForm: FormGroup;


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
			baseCurrencyVal: this._formBuilder.control(1, [Validators.required]),
			baseCurrency: this._formBuilder.control('NOK', [Validators.required]),
			targetCurrencyVal: this._formBuilder.control(0, [Validators.required]),
			targetCurrency: this._formBuilder.control('USD', [Validators.required])
		});

		this.performInitialConversion();
	}


	/* Computes the result for initial conversion [Default: NOK -> USD] */
	performInitialConversion(): void {

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
		if(type == 'base') {
			currencyCode = this.conversionForm.controls.baseCurrency.value;
		}
		else if(type == 'target') {
			currencyCode = this.conversionForm.controls.targetCurrency.value;
		}

		for(let symbol of this.symbolsData.slice()) {
			if(symbol.code == currencyCode) {
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
		if(type == 'base') {
			return this.conversionForm.controls.baseCurrencyVal.value;
		}
		else if(type == 'target') {
			return this.conversionForm.controls.targetCurrencyVal.value;
		}
	}

}
