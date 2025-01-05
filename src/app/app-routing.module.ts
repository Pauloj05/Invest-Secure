import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RandomStocksComponent } from './random-stocks/random-stocks.component';

const routes: Routes = [
  { path: 'display', component: RandomStocksComponent },
  { path: 'search', component: RandomStocksComponent },
  { path: 'sell', component: RandomStocksComponent },
  { path: '', redirectTo: '/display', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
