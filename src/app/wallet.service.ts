import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface OwnedStock {
  symbol: string;
  quantity: number;
  preco_un: number;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private ownedStocks: OwnedStock[] = [
    { symbol: 'AAPL', quantity: 10 , preco_un: 200},
    { symbol: 'GOOGL', quantity: 5 , preco_un: 190},
    { symbol: 'TSLA', quantity: 15 , preco_un: 170}
  ];

  constructor() { }

  getOwnedStocks(): Observable<OwnedStock[]> {
    return of(this.ownedStocks);
  }

  buyStock(symbol: string, quantity: number, preco_un: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const index = this.ownedStocks.findIndex(stock => stock.symbol === symbol);
      if (index !== -1) {
        this.ownedStocks[index].quantity += quantity;
      } else {
        this.ownedStocks.push({ symbol, quantity , preco_un});
      }
      console.log(`Compra realizada: ${symbol} - ${quantity} ações`);
      observer.next(true);
      observer.complete();
    });
  }

  sellStock(symbol: string, quantity: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const index = this.ownedStocks.findIndex(stock => stock.symbol === symbol);
      if (index !== -1) {
        if (this.ownedStocks[index].quantity >= quantity) {
          // Subtrai a quantidade
          this.ownedStocks[index].quantity -= quantity;
          // Se a quantidade for zero, remove a ação da lista
          if (this.ownedStocks[index].quantity === 0) {
            this.ownedStocks.splice(index, 1);
          }
          console.log(`Venda realizada: ${symbol} - ${quantity} ações`);
          observer.next(true);
        } else {
          console.log(`Falha na venda: quantidade insuficiente de ${symbol}`);
          observer.next(false);
        }
      } else {
        console.log(`Falha na venda: ${symbol} não encontrado`);
        observer.next(false);
      }
      observer.complete();
    });
  }}