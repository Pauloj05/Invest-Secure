import { Component, OnInit } from '@angular/core';
import { FinnhubService } from './finnhub.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'finnhub-app';
  companies: any[] = [];
  symbols: string[] = ['AAPL', 'MSFT', 'TSLA'];

  constructor(private finnhubService: FinnhubService) {}

  ngOnInit() {
    this.symbols.forEach(symbol => {
      this.getCompanyData(symbol);
    });
  }

  getCompanyData(symbol: string) {
    this.finnhubService.getStockQuote(symbol).subscribe(
      quoteData => {
        this.finnhubService.getCompanyProfile(symbol).subscribe(
          profileData => {
            this.companies.push({
              symbol,
              quote: quoteData,
              profile: profileData
            });
            console.log(`Data for ${symbol}:`, { quote: quoteData, profile: profileData });
          },
          error => {
            console.error(`Error fetching company profile for ${symbol}`, error);
          }
        );
      },
      error => {
        console.error(`Error fetching stock quote for ${symbol}`, error);
      }
    );
  }
}
