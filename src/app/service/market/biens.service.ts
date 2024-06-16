import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiensService {

  private baseURL = "http://localhost:8083/BienController";

  constructor(private httpClient: HttpClient) { }

  getAllBiens(): Observable<any[]> {
    const token = localStorage.getItem('jwt');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.httpClient.get<any[]>(`${this.baseURL}/get-all-bien`, { headers });
  }
}
