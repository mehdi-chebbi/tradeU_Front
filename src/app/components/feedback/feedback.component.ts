import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FeedbackserviceService } from 'src/app/service/feedbackservice.service';
import { BadWordValidator } from 'src/app/Validators/badWord-validator';
import swal from 'sweetalert2';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'] 
})
export class FeedbackComponent implements OnInit {
  feedbackForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private feedbackService: FeedbackserviceService
  ) { }

  ngOnInit(): void {
    this.feedbackForm = this.formBuilder.group({
      contenu: ['', [Validators.required, BadWordValidator.validate(['bad1', 'bad2', 'bad3'])]]
    });
  }

  submitFeedback(): void {
    if (this.feedbackForm.invalid) {
      return;
    }
  
    const feedbackData = {
      contenu: this.feedbackForm.value.contenu
    };

    this.feedbackService.addFeedback(feedbackData)
      .subscribe(
        response => {
          console.log('Feedback added successfully!', response);
          swal.fire({
            title: 'Feedback Recieved!',
            text: 'Thank You For The Feedback.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.resetForm();
        },
        error => {
          console.error('Error adding feedback:', error);
        }
      );
  }

  resetForm(): void {
    this.feedbackForm.reset();
  }

  // Method to check for bad words in the content
  hasBadWord(content: string): boolean {
    const badWords = ['bad1', 'bad2', 'bad3'];
    const value = content.toLowerCase();
    return badWords.some(badWord => value.includes(badWord.toLowerCase()));
  }

  // Method to display Swal alert for bad word detection
  displayBadWordAlert(): void {
    swal.fire({
      title: 'Bad Word Detected!',
      text: 'Please refrain from using inappropriate language.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  // Method to handle input change in the feedback content
  onContentChange(): void {
    const content = this.feedbackForm.get('contenu')?.value;
    if (this.hasBadWord(content)) {
      this.displayBadWordAlert();
    }
  }
}
