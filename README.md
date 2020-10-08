# Currency Converter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Component Description

`Home` component allows the user to perform a `currency conversion` based on the latest exchange rates. The conversion operation is performed when any of the following inputs are changed:

1. Base currency
2. Target currency
3. Base currency value 
4. Date (An optional parameter)

The currency converter app makes use of the latest data at every instance for computing the converted currency amount.

`Currencies` component allows the user to obtain the `latest exchange rates` for a specific base currency.

`History` component allows the user to view his/her `past currency conversions`. The default search conversion is omitted by default from the history logs.