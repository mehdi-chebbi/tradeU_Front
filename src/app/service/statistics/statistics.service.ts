import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from 'src/app/Model/commande';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(private http: HttpClient) { }

  getCouponStatistics(): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      return this.http.get<any>('http://localhost:8083/coupons/statistics', { headers });
    } else {
      throw new Error('JWT token not found in local storage');
    }
  }
  getAllCommandes(): Observable<Commande[]> {
    const token = localStorage.getItem('jwt');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Commande[]>('http://localhost:8083/commandes', { headers });
  } else {
    throw new Error('JWT token not found in local storage');
  }
}

getTotalRevenueByDay(): Observable<{ [key: string]: number }> {
  const token = localStorage.getItem('jwt');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.get<{ [key: string]: number }>('http://localhost:8083/commandes/total-revenue-by-day', { headers });
} else {
  throw new Error('JWT token not found in local storage');
}
}
}