import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FeedbackserviceService {
  private baseUrl = 'https://backendtradeu.azurewebsites.net/FeedbackController/';
  private baseUrl2 = 'https://backendtradeu.azurewebsites.net/FeedbackBienController/';



  constructor(private http: HttpClient) { }
  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get('https://backendtradeu.azurewebsites.net/auth/get-current-user', { headers }).pipe(
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
addFeedback(feedbackData: any): Observable<any> {
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.baseUrl}add-feedback`, feedbackData, { headers }).pipe(
      catchError(error => {
        console.error('Error adding feedback:', error);
        return throwError('Error adding feedback');
      })
    );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}
fetchSAllFeedbacks(): Observable<any> {
  // Retrieve JWT token from local storage
  const token = localStorage.getItem('jwt');

  // Check if token exists
  if (token) {
    // Create HTTP headers with bearer token
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

    // Pass headers with the HTTP GET request
    return this.http.get<any>(`${this.baseUrl}retrieve-All-Feedback`, { headers });
  } else {
    // Handle case where token is not found
    console.error('Token not found');
    // You can choose to return an observable with an error or handle it in another way
    return throwError('Token not found');
  }
}
deleteFeedbackn(idFeedback: number): Observable<any> {
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.baseUrl}/${idFeedback}delete-feedbackn`;
    return this.http.delete<any>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting feedback:', error);
        return throwError('Error deleting feedback:');
      })
    );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}








/***********************FEEDBACK BIEN SERVICE *******************************************/





/********************************************************* */
fetchSAllFeedbackBiens(): Observable<any> {
  // Retrieve JWT token from local storage
  const token = localStorage.getItem('jwt');

  // Check if token exists
  if (token) {
    // Create HTTP headers with bearer token
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

    // Pass headers with the HTTP GET request
    return this.http.get<any>(`${this.baseUrl2}retrieve-All`, { headers });
  } else {
    // Handle case where token is not found
    console.error('Token not found');
    // You can choose to return an observable with an error or handle it in another way
    return throwError('Token not found');
  }
}
addFeedbackBien(feedbackData: any): Observable<any> {
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.baseUrl2}add-feedbackbien`, feedbackData, { headers }).pipe(
      catchError(error => {
        console.error('Error adding feedback:', error);
        return throwError('Error adding feedback');
      })
    );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}
deleteFeedbackBien(idFeedbackbien: number): Observable<any> {
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.baseUrl2}/${idFeedbackbien}/delete`;
    return this.http.delete<any>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting feedbackbien:', error);
        return throwError('Error deleting feedbackbien:');
      })
    );
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}
fetchSFeedbackbyBienId(bienId:number): Observable<any> {
  // Retrieve JWT token from local storage
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

    return this.http.get<any>(`${this.baseUrl2}retrieve-feedback-byBienId/${bienId}`, { headers });
  } else {
    console.error('Token not found');
    return throwError('Token not found');
  }
}

}
