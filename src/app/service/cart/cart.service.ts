import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, tap  } from 'rxjs';import { Coupon } from 'src/app/Model/coupon';
;


@Injectable({
  providedIn: 'root'
})
export class CartService {
  createCommandeFromCartWithCoupon(cartId: number, couponCode: string) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8083/CartController';

  constructor(private http: HttpClient) { }

  addBiensToCart(bienIds: number[]): Observable<any> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/addCard`, bienIds, { headers });
  }

  getBiensInCart(cartId: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/cart/${cartId}/biens`, { headers });
  }

    getCurrentUser(): Observable<any> {
      const token = localStorage.getItem('jwt');

      if (token) {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

        return this.http.get<any>(`${this.apiUrl}/get-current-user`, { headers }).pipe(
          catchError(error => {
            console.error('Error fetching current user:', error);
            return throwError('Error fetching current user');
          })
        );
      } else {
        console.error('Token not found');
        return throwError('Token not found');
      }

    
  }
  deleteBienFromCart(cartId: number, bienId: number): Observable<void> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.delete<void>(`${this.apiUrl}/${cartId}/biens/${bienId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting bien from cart:', error);
        return throwError('Error deleting bien from cart');
      })
    );
  }


  


  generateCoupon(): Observable<Coupon> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post<Coupon>('http://localhost:8083/coupons/generate', {}, { headers }).pipe(
      tap(() => {
        localStorage.setItem('couponGenerated', 'true');
      }),
      catchError(error => {
        console.error('Error generating coupon:', error);
        return throwError(error);
      })
    );
  }
  
  
  
  
}
