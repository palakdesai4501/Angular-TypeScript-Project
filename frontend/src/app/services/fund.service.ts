import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fund {
  name: string;
  strategies: string[];
  geographies: string[];
  currency: string;
  fundSize: number;
  vintage: number;
  managers: string[];
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class FundService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getAllFunds(): Observable<Fund[]> {
    return this.http.get<Fund[]>(`${this.apiUrl}/funds`);
  }

  getFundByName(name: string): Observable<Fund> {
    return this.http.get<Fund>(`${this.apiUrl}/funds/${name}`);
  }

  updateFund(name: string, fund: Fund): Observable<Fund> {
    return this.http.put<Fund>(`${this.apiUrl}/funds/${name}`, fund);
  }

  deleteFund(name: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/funds/${name}`);
  }
} 