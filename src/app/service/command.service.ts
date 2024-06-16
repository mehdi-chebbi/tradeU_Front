import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Commande } from 'src/app/Model/commande';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  private apiUrl = 'https://backendtradeu.azurewebsites.net';

  constructor(private http: HttpClient) { }

  createCommandeFromCurrentUser(cartId: number, couponCode?: string): Observable<Commande> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Assuming the content type required by the backend
      });

      const url = `${this.apiUrl}/commandes/create-commande/${cartId}${couponCode ? `?couponCode=${couponCode}` : ''}`;

      return this.http.post<Commande>(url, null, { headers }).pipe(
        catchError(error => {
          console.error('Error creating commande:', error);
          return throwError('Error creating commande');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }
}
