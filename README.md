# Currency Converter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Component Description

`Home` component allows the user to perform a `currency conversion` based on the latest exchange rates. The conversion operation is performed when any of the following inputs are changed:

1. Base currency
2. Target currency
3. Base currency value 
4. Date (An optional parameter)

The currency converter app makes use of the latest data at every instance for computing the converted currency amount.

`Currencies` component allows the user to obtain the `latest exchange rates` for a specific base currency.

`History` component allows the user to view his/her `past currency conversions`. The default search conversion is omitted by default from the history logs.