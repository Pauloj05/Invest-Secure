import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinnhubService {
  private apiKey = 'cppafipr01qn2da2cr1gcppafipr01qn2da2cr20'; // Substitua pela sua chave de API
  private baseUrl = 'https://finnhub.io/api/v1';

  constructor(private http: HttpClient) { }

  getStockQuote(symbol: string): Observable<any> {
    const url = `${this.baseUrl}/quote?symbol=${symbol}&token=${this.apiKey}`;
    return this.http.get(url);
  }

  getCompanyProfile(symbol: string): Observable<any> {
    const url = `${this.baseUrl}/stock/profile2?symbol=${symbol}&token=${this.apiKey}`;
    return this.http.get(url);
  }

}
