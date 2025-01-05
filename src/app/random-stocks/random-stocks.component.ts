import { Component, OnInit } from '@angular/core';
import { FinnhubService } from '../finnhub.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-random-stocks',
  templateUrl: './random-stocks.component.html',
  styleUrls: ['./random-stocks.component.css']
})
export class RandomStocksComponent implements OnInit {
  stockQuotes: any[] = [];
  companyProfiles: any[] = [];
  symbols: string[] = ['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT', 'NVDA'];
  selectedCompanyIndex: number = -1;
  searchSymbol: string = '';
  buyQuantity: number = 1;
  sellQuantity: number = 1;
  balance: number = 10000; // Defina um valor inicial para o saldo
  errorMessage: string = ''; // Inicialize a mensagem de erro como vazia

  constructor(private finnhubService: FinnhubService, private walletService: WalletService) { }

  ngOnInit(): void {
    this.symbols.forEach(symbol => {
      this.getStockData(symbol);
    });
  }

  getStockData(symbol: string): void {
    this.finnhubService.getStockQuote(symbol).subscribe(
      data => {
        this.stockQuotes.push({ symbol, data });
      },
      error => {
        console.error('Erro ao obter a cotação das ações', error);
      }
    );

    this.finnhubService.getCompanyProfile(symbol).subscribe(
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

      this.finnhubService.getStockQuote(symbol).subscribe(
        quoteData => {
          const existingQuoteIndex = this.stockQuotes.findIndex(quote => quote.symbol === symbol);
          if (existingQuoteIndex !== -1) {
            this.stockQuotes[existingQuoteIndex] = { symbol, data: quoteData };
          } else {
            this.stockQuotes.unshift({ symbol, data: quoteData });
          }

          this.finnhubService.getCompanyProfile(symbol).subscribe(
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

  buyStock() {
    if (this.selectedCompanyIndex !== -1 && this.buyQuantity > 0) {
      const symbol = this.companyProfiles[this.selectedCompanyIndex].symbol;
      const pricePerShare = this.getStockQuote(symbol)?.data.c;
  
      if (pricePerShare) {
        const totalCost = pricePerShare * this.buyQuantity;
  
        if (this.balance < totalCost) {
          console.error('Saldo insuficiente para realizar a compra');
          this.errorMessage = 'Saldo insuficiente para realizar a compra';
          return; // Encerra a função se o saldo for insuficiente
        }
  
        this.walletService.buyStock(symbol, this.buyQuantity, 200).subscribe(
          success => {
            if (success) {
              console.log('Compra realizada com sucesso');
              this.balance -= totalCost; // Atualiza o saldo após a compra
            } else {
              console.error('Erro ao comprar ações: não foi possível completar a compra');
              this.errorMessage = 'Erro ao comprar ações: não foi possível completar a compra';
            }
          },
          error => {
            console.error('Erro ao comprar ações:', error);
            this.errorMessage = 'Erro ao comprar ações';
          }
        );
      } else {
        console.error('Erro ao obter o preço da ação');
        this.errorMessage = 'Erro ao obter o preço da ação';
      }
    } else {
      this.errorMessage = 'Por favor, selecione uma empresa e insira uma quantidade válida para comprar.';
    }
  }

  sellStock() {
    if (this.selectedCompanyIndex !== -1 && this.sellQuantity > 0) {
      const symbol = this.companyProfiles[this.selectedCompanyIndex].symbol;
      const pricePerShare = this.getStockQuote(symbol)?.data.c;
  
      if (pricePerShare) {
        this.walletService.sellStock(symbol, this.sellQuantity).subscribe(
          success => {
            if (success) {
              console.log('Venda realizada com sucesso');
              this.balance += pricePerShare * this.sellQuantity;
            } else {
              console.error('Erro ao vender ações: quantidade insuficiente');
              this.errorMessage = 'Erro ao vender ações: quantidade insuficiente';
            }
          },
          error => {
            console.error('Erro ao vender ações:', error);
            this.errorMessage = 'Erro ao vender ações';
          }
        );
      } else {
        console.error('Erro ao obter o preço da ação');
        this.errorMessage = 'Erro ao obter o preço da ação';
      }
    } else {
      this.errorMessage = 'Por favor, selecione uma empresa e insira uma quantidade válida.';
    }
  }}
