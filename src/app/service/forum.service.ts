import {Injectable, Type} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Publication } from '../components/model/publication';
import {Reponse} from "../components/model/Reponse"; // Import the Publication interface

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  BASE_URL = 'https://backendtradeu.azurewebsites.net';

  constructor(private http: HttpClient) { }
  //----------------------Service----Publication----------------------------

  getAllPublications(): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get(`${this.BASE_URL}/PublicationController/Get-All-Publication`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching publications:', error);
          return throwError('Error fetching publications');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }
  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get(`${this.BASE_URL}/ReponseController/get-current-user`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching publications:', error);
          return throwError('Error fetching publications');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  addPublication(publication: Publication): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.post(`${this.BASE_URL}/PublicationController/add-publication`, publication, { headers }).pipe(
        catchError(error => {
          console.error('Error adding publication:', error);
          return throwError('Error adding publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  removePublication(idPub: number): Observable<any> {
    console.log(idPub); // Log the idPub parameter

    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.delete(`${this.BASE_URL}/PublicationController/Delete-Publication/${idPub}`, { headers }).pipe(
        catchError(error => {
          console.error('Error removing publication:', error);
          return throwError('Error removing publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  translatePublicationByIdToArabic(id: number): Observable<string> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get(`${this.BASE_URL}/PublicationController/translate_Publication/ar/${id}`, {
        headers,
        responseType: 'text' // Specify the response type as 'text'
      }).pipe(
        catchError(error => {
          console.error('Error translating publication:', error);
          return throwError('Error translating publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  translatePublicationByIdToSpanish(id: number): Observable<string> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get(`${this.BASE_URL}/PublicationController/translate_Publication/esp/${id}`, {
        headers,
        responseType: 'text' // Specify the response type as 'text'
      }).pipe(
        catchError(error => {
          console.error('Error translating publication:', error);
          return throwError('Error translating publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }
  translatePublicationByIdToFrench(id: number): Observable<string> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get(`${this.BASE_URL}/PublicationController/translate_Publication/fr/${id}`, {
        headers,
        responseType: 'text' // Specify the response type as 'text'
      }).pipe(
        catchError(error => {
          console.error('Error translating publication:', error);
          return throwError('Error translating publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }
  tweetPublication(id: number): Observable<string> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get(`${this.BASE_URL}/PublicationController/tweet/${id}`, { headers, responseType: 'text' }).pipe(
        catchError(error => {
          console.error('Error tweeting publication:', error);
          return throwError('Error tweeting publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  likePublication(id: number): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.post(`${this.BASE_URL}/PublicationController/like_publication/${id}`, null, { headers }).pipe(
        catchError(error => {
          console.error('Error liking publication:', error);
          return throwError('Error liking publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  updatePublication(id: number, newContent: string): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded' // Set the content type if needed
      });

      const params = new URLSearchParams();
      params.set('newcontent', newContent); // Set the new content as a request parameter

      return this.http.put(`${this.BASE_URL}/PublicationController/update-Publication/${id}`, params.toString(), { headers }).pipe(
        catchError(error => {
          console.error('Error updating publication:', error);
          return throwError('Error updating publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  dislikePublication(id: number): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.post(`${this.BASE_URL}/PublicationController/dislike_publication/${id}`, null, { headers }).pipe(
        catchError(error => {
          console.error('Error disliking publication:', error);
          return throwError('Error disliking publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  //----------------------Service----Reponse----------------------------
  getAllReponses(): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get(`${this.BASE_URL}/ReponseController/Get-All-Reponse`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching publications:', error);
          return throwError('Error fetching publications');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  addReponse(idPublication: number, reponse: Reponse): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.post(`${this.BASE_URL}/ReponseController/add-reponse/${idPublication}`, reponse, { headers }).pipe(
        catchError(error => {
          console.error('Error adding response:', error);
          return throwError('Error adding response');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  removeReponse(idPub: number): Observable<any> {
    console.log(idPub); // Log the idPub parameter

    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.delete(`${this.BASE_URL}/ReponseController/delete-Reponse/${idPub}`, { headers }).pipe(
        catchError(error => {
          console.error('Error removing Reponse:', error);
          return throwError('Error removing Reponse');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }


  updateReponse(id: number, reponse: Reponse): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.put(`${this.BASE_URL}/ReponseController/update-Reponse/${id}`, reponse, { headers }).pipe(
        catchError(error => {
          console.error('Error updating response:', error);
          return throwError('Error updating response');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  likeReponse(id: number): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.post(`${this.BASE_URL}/ReponseController/like_reponse/${id}`, null, { headers }).pipe(
        catchError(error => {
          console.error('Error liking Reponse:', error);
          return throwError('Error liking Reponse');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  dislikeReponse(id: number): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.post(`${this.BASE_URL}/ReponseController/dislike_reponse/${id}`, null, { headers }).pipe(
        catchError(error => {
          console.error('Error disliking publication:', error);
          return throwError('Error disliking publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }


  translateReponseByIdToArabic(id: number): Observable<string> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get(`${this.BASE_URL}/ReponseController/Translate-Reponse/Ar/${id}`, {
        headers,
        responseType: 'text' // Specify the response type as 'text'
      }).pipe(
        catchError(error => {
          console.error('Error translating publication:', error);
          return throwError('Error translating publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

  translateReponseByIdToSpanish(id: number): Observable<string> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get(`${this.BASE_URL}/ReponseController/Translate-Reponse/Sp/${id}`, {
        headers,
        responseType: 'text' // Specify the response type as 'text'
      }).pipe(
        catchError(error => {
          console.error('Error translating publication:', error);
          return throwError('Error translating publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }
  translateReponseByIdToFrench(id: number): Observable<string> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get(`${this.BASE_URL}/ReponseController/Translate-Reponse/Fr/${id}`, {
        headers,
        responseType: 'text' // Specify the response type as 'text'
      }).pipe(
        catchError(error => {
          console.error('Error translating publication:', error);
          return throwError('Error translating publication');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }

}

