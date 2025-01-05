import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { FinnhubService } from '../finnhub.service';  


@Component({
  selector: 'app-owned-stocks',
  templateUrl: './owned-stocks.component.html',
  styleUrls: ['./owned-stocks.component.css']
})
export class OwnedStocksComponent implements OnInit {
  ownedStocks: { symbol: string, quantity: number, preco_un: number }[] = [];
    stockQuotes: any[] = [];
    companyProfiles: any[] = [];
    symbols: string[] = ['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT', 'NVDA'];
    selectedCompanyIndex: number = -1;
    searchSymbol: string = '';
    buyQuantity: number = 1;
    sellQuantity: number = 1;
    balance: number = 10000; // Defina um valor inicial para o saldo
    errorMessage: string = ''; // Inicialize a mensagem de erro como vazia
  

  constructor(private walletService: WalletService, private finnhub: FinnhubService) { }

  ngOnInit(): void {
    this.walletService.getOwnedStocks().subscribe(
      stocks => {
        this.ownedStocks = stocks;
      },
      error => {
        console.error('Erro ao obter ações compradas:', error);
      }
    );
    this.symbols.forEach(symbol => {
      this.getStockData(symbol);
    });
  }

  getStockData(symbol: string): void {
    this.finnhub.getStockQuote(symbol).subscribe(
      data => {
        this.stockQuotes.push({ symbol, data });
      },
      error => {
        console.error('Erro ao obter a cotação das ações', error);
      }
    );

    this.finnhub.getCompanyProfile(symbol).subscribe(
      data => {
        this.companyProfiles.push({ symbol, data });
      },
      error => {
        console.error('Erro ao obter o perfil da empresa', error);
      }
    );
  }

  getStockQuote(symbol: string) {
    return this.stockQuotes.find(quote => quote.symbol === symbol);
  }

  selectCompany(index: number): void {
    this.selectedCompanyIndex = index;
  }

  searchCompany(): void {
    if (this.searchSymbol) {
      const symbol = this.searchSymbol.toUpperCase();

      this.finnhub.getStockQuote(symbol).subscribe(
        quoteData => {
          const existingQuoteIndex = this.stockQuotes.findIndex(quote => quote.symbol === symbol);
          if (existingQuoteIndex !== -1) {
            this.stockQuotes[existingQuoteIndex] = { symbol, data: quoteData };
          } else {
            this.stockQuotes.unshift({ symbol, data: quoteData });
          }

          this.finnhub.getCompanyProfile(symbol).subscribe(
            profileData => {
              const existingProfileIndex = this.companyProfiles.findIndex(profile => profile.symbol === symbol);
              if (existingProfileIndex !== -1) {
                this.companyProfiles[existingProfileIndex] = { symbol, data: profileData };
              } else {
                this.companyProfiles.unshift({ symbol, data: profileData });
              }

              if (this.companyProfiles.length > 6) {
                this.companyProfiles.pop();
              }

              this.searchSymbol = '';
            },
            error => {
              console.error('Erro ao obter o perfil da empresa', error);
              this.errorMessage = 'Erro ao obter o perfil da empresa';
            }
          );
        },
        error => {
          console.error('Erro ao obter a cotação das ações', error);
          this.errorMessage = 'Erro ao obter a cotação das ações';
        }
      );
    } else {
      this.errorMessage = 'Por favor, digite um símbolo de empresa.';
    }
  }
}
