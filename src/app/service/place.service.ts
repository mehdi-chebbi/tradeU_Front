import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

const BASE_URL = "https://backendtradeu.azurewebsites.net/";

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  BASE_URL = "https://backendtradeu.azurewebsites.net/";

  constructor(private http: HttpClient) {}

  addPlace(addRequest: any): Observable<any> {
    const token = localStorage.getItem('jwt');

    // Vérifiez si le token est présent dans le stockage local
    if (token) {
      // Définir les en-têtes de la requête avec le token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Effectuer la requête HTTP POST avec les en-têtes appropriés
      return this.http.post(BASE_URL + 'admin/saveplace', addRequest, { headers }).pipe(
        catchError((error) => {
          // Gérer les erreurs de requête HTTP ici
          console.error('Error in HTTP request:', error);
          return throwError('Failed to add place. Please try again later.');
        })
      );
    } else {
      // Gérer le cas où le token n'est pas présent
      console.error('Token not found');
      return throwError('Token not found');
    }
  }
  getPlaces(): Observable<any> {
    const token = localStorage.getItem('jwt');

    // Vérifiez si le token est présent dans le stockage local
    if (token) {
      // Définir les en-têtes de la requête avec le token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Effectuer la requête HTTP GET avec les en-têtes appropriés
      return this.http.get(BASE_URL + 'public/place', { headers });
    } else {
      // Gérer le cas où le token n'est pas présent
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  deletePlace(placeId: number): Observable<any>  {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      return this.http.delete(`${this.BASE_URL}admin/delete/place/${placeId}`, { headers, responseType: 'text' });
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  getPlaceById(placeId: number): Observable<any> {
    const token = localStorage.getItem('jwt');

    // Vérifiez si le token est présent dans le stockage local
    if (token) {
      // Définir les en-têtes de la requête avec le token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Effectuer la requête HTTP GET avec les en-têtes appropriés pour récupérer une place par son ID
      return this.http.get(`${this.BASE_URL}admin/getPlace/${placeId}`, { headers });
    } else {
      // Gérer le cas où le token n'est pas présent
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  updatePlace(placeId: number, newName: string, newDescription: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Créez un objet contenant les nouvelles données
      const updateRequest = {
        name: newName,
        description: newDescription
      };

      // Effectuez une requête POST avec les nouvelles données dans le corps de la requête
      return this.http.post(`${this.BASE_URL}admin/update/place/${placeId}`, updateRequest, { headers })
        .pipe(
          catchError(error => {
            console.error('Error updating place:', error);
            return throwError('Error updating place: ' + error.message);
          })
        );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
}

triPlaces(): Observable<any> {
  const token = localStorage.getItem('jwt');

  // Vérifiez si le token est présent dans le stockage local
  if (token) {
    // Définir les en-têtes de la requête avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Effectuer la requête HTTP GET avec les en-têtes appropriés pour trier les places
    return this.http.get(`${this.BASE_URL}admin/triplace`, { headers }).pipe(
      catchError(error => {
        console.error('Error sorting places:', error);
        return throwError('Error sorting places: ' + error.message);
      })
    );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}
}

