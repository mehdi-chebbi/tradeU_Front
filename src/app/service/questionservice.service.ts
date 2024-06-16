import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionserviceService {

  private baseUrl = 'https://backendtradeu.azurewebsites.net/QuestionController/'; // Replace this with your backend API URL
  private baseUrl2 = 'https://backendtradeu.azurewebsites.net/ReponseSonController/'

  constructor(private http: HttpClient) { }

  getQuestionsBySondageId(sondageId: number): Observable<any[]> {
    // Retrieve JWT token from local storage
    const token = localStorage.getItem('jwt');

    // Check if token exists
    if (token) {
      // Create HTTP headers with bearer token
      const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});

      // Pass headers with the HTTP GET request
      return this.http.get<any[]>(`${this.baseUrl}get-question-byIdSondage/${sondageId}`, { headers })
        .pipe(
          catchError(error => {
            console.error('Error fetching questions by sondage ID:', error);
            return throwError('Error fetching questions by sondage ID');
          })
        );
    } else {
      // Handle case where token is not found
      console.error('Token not found');
      return throwError('Token not found');
    }
  }
  retrieveAllQuestions(): Observable<any[]> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get<any[]>(`${this.baseUrl}retrieve-All-Question`, { headers })
        .pipe(
          catchError(error => {
            console.error('Error retrieving all questions:', error);
            return throwError('Error retrieving all questions');
          })
        );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }
  addQuestions(questions: any[]): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.post<any>(`${this.baseUrl2}retrieve-All-Reponse`, questions, { headers })
        .pipe(
          catchError(error => {
            console.error('Error adding questions:', error);
            return throwError('Error adding questions');
          })
        );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }
  /****service pour reponse***** */
  addListResponseSondage(questionId: number, responseDataList: any[]): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      return this.http.post<any[]>(`${this.baseUrl2}add-list-Reponse/${questionId}`, responseDataList, { headers }).pipe(
        catchError(error => {
          console.error('Error adding responses:', error);
          return throwError('Error adding responses');
        })
      );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
}
addOneResponseSondage(questionId: number, responseData: any): Observable<any> {
  const token = localStorage.getItem('jwt');

  if (token) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any[]>(`${this.baseUrl2}add-reponse/${questionId}`, responseData, { headers }).pipe(
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

  retrieveAllReponses(): Observable<any[]> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get<any[]>(`${this.baseUrl2}retrieve-All-Reponse`, { headers })
        .pipe(
          catchError(error => {
            console.error('Error retrieving all reponses:', error);
            return throwError('Error retrieving all reponses');
          })
        );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }
  getResponsesByQuestionId(questionId: number): Observable<any[]> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      return this.http.get<any[]>(`${this.baseUrl2}retrieve-Reponse-byIdQuestion/${questionId}`, { headers })
        .pipe(
          catchError(error => {
            console.error('Error retrieving reponses:', error);
            return throwError('Error retrieving reponses');
          })
        );
    } else {
      console.error('Token not found');
      return throwError('Token not found');
    }
  }






}
