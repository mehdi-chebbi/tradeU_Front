import { Component, OnInit } from '@angular/core';
import { QuestionserviceService } from 'src/app/service/questionservice.service';
import { SondageService } from 'src/app/service/sondageservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-reponse-sondage',
  templateUrl: './show-reponse-sondage.component.html',
  styleUrls: ['./show-reponse-sondage.component.scss']
})
export class ShowReponseSondageComponent implements OnInit {
  questions: any[] = [];
  sondages: any[] = [];
  reponseSondages: any[] = [];
  isAccordionOpen: { [key: number]: boolean } = {};

  constructor(
    private questionService: QuestionserviceService,
    private sondageService: SondageService,
    private snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.retrieveQuestions();
    this.retrieveSondages();
  }

  retrieveQuestions() {
    this.questionService.retrieveAllQuestions().subscribe(
      (questions: any[]) => {
        this.questions = questions;
        console.log('Questions:', questions);
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  retrieveReponseSondages(questionId: number) {
    console.log(questionId);
    this.questionService.retrieveAllReponses().subscribe(
      (allReponses: any[]) => {
        // Filter the responses based on the provided questionId
        this.reponseSondages = allReponses.filter(response => response.questionId === questionId);
        console.log('Filtered ReponseSondages for question:', this.reponseSondages);
      },
      (error) => {
        console.error('Error fetching reponseSondages:', error);
      }
    );
  }
  
  toggleAccordion(sondageId: number) {
    this.isAccordionOpen[sondageId] = !this.isAccordionOpen[sondageId];
  }

  toggleResponses(question: any) {
    question.showResponses = !question.showResponses;
    if (question.showResponses) {
      this.retrieveReponseSondages(question.id);
    } else {
      // If responses are hidden, clear the responses
      this.reponseSondages = [];
    }
    this.questions.forEach(q => {
      if (q !== question) {
        q.showResponses = false;
      }
    });
  }
  

  retrieveSondages() {
    this.sondageService.fetchSAllSondages().subscribe(
      (sondages: any[]) => {
        this.sondages = sondages;
        console.log('Sondages:', sondages);
      },
      (error) => {
        console.error('Error fetching sondages:', error);
      }
    );
  }

  toggleSondageStatus(sondageId: number, isActive: boolean): void {
    this.sondageService.updateSondageStatus(sondageId, isActive)
      .subscribe(
        (response) => {
          console.log(response);
          const sondage = this.sondages.find(s => s.idSondage === sondageId);
          if (sondage) {
            sondage.active = isActive;
          }    this.openSnackBar('Status changed!', 'OK');

        },
        (error) => {
          console.error(error);
        }
      );
  }
  deleteSondage(sondageId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this poll. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sondageService.deleteSondage(sondageId)
          .subscribe(
            (response) => {
              Swal.fire(
                'Deleted!',
                'The sondage has been deleted successfully.',
                'success'
              );
              // Remove the deleted sondage from the local sondages array
              this.sondages = this.sondages.filter(s => s.idSondage !== sondageId);
            },
            (error) => {
              console.error(error);
              Swal.fire(
                'Error',
                'An error occurred while deleting the sondage.',
                'error'
              );
            }
          );
      }
    });
  }
  downloadExcel(): void {
    this.sondageService.downloadExcel();
    this.openSnackBar('Poll Excel Downloaded! Check Your Downloads', 'OK');

    
  }
  downloadExcelForSondage(idSondage: number) {
    this.sondageService.downloadExcelForSingleSondage(idSondage);
    this.openSnackBar('Poll Excel Downloaded! Check Your Downloads', 'OK');

  
}
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 3000
  });
}
}