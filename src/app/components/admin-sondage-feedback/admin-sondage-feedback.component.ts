import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/service/jwt.service';
import { Router } from '@angular/router';
import { FeedbackserviceService } from 'src/app/service/feedbackservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-sondage-feedback',
  templateUrl: './admin-sondage-feedback.component.html',
  styleUrls: ['./admin-sondage-feedback.component.scss']
})
export class AdminSondageFeedbackComponent implements OnInit {
  feedbacks: any[] = [];
  tableRows: HTMLTableRowElement[] = [];
  searchValue: string = '';

  constructor(
    private jwtService: JwtService,
    private router: Router,
    private feedbackService: FeedbackserviceService
  ) {}

  ngOnInit(): void {
    this.displayFeedbacks();
  }

  displayFeedbacks(): void {
    this.feedbackService.fetchSAllFeedbacks().subscribe(
      (response: any[]) => {
        this.feedbacks = response;
      },
      (error) => {
        console.error(error);
        // Add your error handling logic here
      }
    );
  } 
  deleteFeedback(idfeedback: number): void {
    this.feedbackService.deleteFeedbackn(idfeedback).subscribe(
      () => {
        // Feedback deleted successfully
        Swal.fire('Success', 'Feedback deleted successfully', 'success');
      },
      (error) => {
        Swal.fire('Error', 'Failed to delete feedback', 'error');
        console.error('Error deleting feedback:', error);
      }
    );
  }

  

  onSearchInput(): void {
    const lowerCaseSearchValue = this.searchValue.toLowerCase();

    this.feedbacks.forEach((feedback) => {
      const content = feedback.contenu.toLowerCase();
      feedback.isHidden = !content.includes(lowerCaseSearchValue);
    });
  }
}