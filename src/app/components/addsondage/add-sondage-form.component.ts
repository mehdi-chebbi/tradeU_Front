import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray,FormControl } from '@angular/forms';
import { SondageService } from 'src/app/service/sondageservice.service';
import { QuestionserviceService } from 'src/app/service/questionservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'; 



@Component({
  selector: 'app-add-sondage',
  templateUrl: './add-sondage-form.component.html',
  styleUrls: ['./add-sondage-form.component.scss']
})
export class AddSondageComponent implements OnInit {
  questionForm!: FormGroup;
  sondageForm!: FormGroup;
  currentUserId: any;
  questionInputs: string[] = [];
  

  constructor(
    private sondageService: SondageService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private questionService: QuestionserviceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sondageForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      
    });
  
    this.questionForm = this.fb.group({
      questions: this.fb.array([])
    }) // Cast questionForm as a FormGroup
  
    this.sondageService.getCurrentUser().subscribe((userId) => {
      this.currentUserId = userId;
      this.sondageForm.patchValue({
        createdById: userId
      });
    });
  }

  submitSondageAndQuestions() {
    console.log('Sondage:', this.sondageForm.value);
    console.log('Questions:', this.questionForm.value.questions);
  
    // Combine the data for sondage and questions
    const sondageData = this.sondageForm.value;
    const questionsData = this.questionForm.value.questions;
  
    // Add the sondage along with its associated questions
    this.sondageService.addSondageAndQuestions(sondageData, questionsData).subscribe(
      (response) => {
        console.log('Sondage and questions added:', response);
        this.openSnackBar('Poll and questions added!', 'OK');
        Swal.fire({
          title: 'Poll Recieved!',
          text: 'Poll and Questions added sucessfully!.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        // Reset forms after successful submission
        this.sondageForm.reset();
        this.questionForm.reset();
        setTimeout(() => {
        this.router.navigate(['/showsondage']); // Replace '/desired-route' with the actual route
      }, 2000);

      },
      (error) => {
        console.log(error); // Log the entire error object

        // Handle error response
        if (error.error==='The deadline has already passed') {
          // Show error message in snackbar
          this.openSnackBar('The deadline has already passed', 'OK');
        } else {
          // Show generic error message
          this.openSnackBar('Error adding sondage', 'OK');
        }
      }
    );
  }
  
  addQuestionInput() {
    const control = this.fb.control('', Validators.required); // Initialize with null
    (this.questionForm.get('questions') as FormArray)?.push(control);
    console.log('Question Form Controls:', this.questionForm.controls); // Log controls
  }
  removeLastQuestionInput() {
    const questionsArray = this.questionForm.get('questions') as FormArray;
    if (questionsArray && questionsArray.length > 0) {
      questionsArray.removeAt(questionsArray.length - 1);
      console.log('Question Form Controls after removal:', this.questionForm.controls);
    }
  }
  
  
  questionCount(): number[] {
    const questionsArray = this.questionForm.get('questions');
    if (questionsArray instanceof FormArray) {
      return Array(questionsArray.length).fill(0);
    }
    return [];
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

  getQuestionControl(index: number): FormControl {
    return (this.questionForm.get('questions') as FormArray)?.controls[index] as FormControl;
  }
  
  
  

  // Other methods for adding inputs, questions, etc.
}
