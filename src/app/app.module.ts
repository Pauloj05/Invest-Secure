import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FinnhubService } from './finnhub.service';
import { RandomStocksComponent } from './random-stocks/random-stocks.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { OwnedStocksComponent } from './owned-stocks/owned-stocks.component';

@NgModule({
  declarations: [
    AppComponent,
    RandomStocksComponent,
    OwnedStocksComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule
  ],
  providers: [FinnhubService],
  bootstrap: [AppComponent]
})
export class AppModule { }
