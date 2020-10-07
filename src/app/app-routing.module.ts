import { HistoryComponent } from './components/history/history.component';
import { CurrenciesComponent } from './components/currencies/currencies.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


/* Declares root level routes for the application */
const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent
	},
	{
		path: 'currencies',
		component: CurrenciesComponent
	},
	{
		path: 'history',
		component: HistoryComponent
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/home'
	},
	{
		path: '**',
		pathMatch: 'full',
		redirectTo: '/home'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
