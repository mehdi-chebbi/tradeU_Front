import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

const BASE_URL = "https://backendtradeu.azurewebsites.net/";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  BASE_URL = "https://backendtradeu.azurewebsites.net/";
  constructor(private http: HttpClient) { }

  getReservations(): Observable<any> {
    const token = localStorage.getItem('jwt');

    // Vérifiez si le token est présent dans le stockage local
    if (token) {
      // Définir les en-têtes de la requête avec le token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Effectuer la requête HTTP GET avec les en-têtes appropriés
      return this.http.get(BASE_URL + 'user/listReservation', { headers });
    } else {
      // Gérer le cas où le token n'est pas présent
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  deleteReservation(reservationId: number): Observable<any>  {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      return this.http.delete(`${this.BASE_URL}user/delete/reservation/${reservationId}`, { headers, responseType: 'text' });
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  getReservationById(reservationId: number): Observable<any> {
    const token = localStorage.getItem('jwt');

    // Vérifiez si le token est présent dans le stockage local
    if (token) {
      // Définir les en-têtes de la requête avec le token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Effectuer la requête HTTP GET avec les en-têtes appropriés pour récupérer une place par son ID
      return this.http.get(`${this.BASE_URL}user/getReservation/${reservationId}`, { headers });
    } else {
      // Gérer le cas où le token n'est pas présent
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  updateReservation(reservationId: number, updateRequest: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Ajoutez cet en-tête pour spécifier le type de contenu JSON
      });
      return this.http.post(`${this.BASE_URL}user/update/reservation/${reservationId}`, updateRequest, { headers });
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }


  addReservation(placeId: number, reservationRequest: any): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Assurez-vous que la clé "placeId" est ajoutée à l'objet reservationRequest
      reservationRequest.placeId = placeId;

      return this.http.post(`${this.BASE_URL}user/add-reservation1`, reservationRequest, { headers });
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }


  getAllPlaces(): Observable<any> {
    return this.http.get(`${this.BASE_URL}public/place`);
  }
}
