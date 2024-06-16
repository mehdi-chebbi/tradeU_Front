import { Component, OnInit } from '@angular/core';
import { SondageService } from 'src/app/service/sondageservice.service';
import { QuestionserviceService } from 'src/app/service/questionservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Subscription, debounceTime, switchMap, timer } from 'rxjs';


@Component({
  selector: 'app-show-all-sondage',
  templateUrl: './showsondage.component.html',
  styleUrls: ['./showsondage.component.scss']
})
export class ShowsondageComponent implements OnInit {
  sondages: any[] = []; // Array to store fetched sondages
  questions: any[] = [];  // Object to store questions by sondageId
  filteredSondages: any[] = [];
  currentUserId: any;
  ActiveSondages: any[] = [];
  sondagesSubscription!: Subscription;
  deadlineSondages: any[] = [];
  searchCriteria: string = 'title';
  SearchedSondages: any[] = [];
  reponseSondages: any[] = [];




  

  constructor(
    private sondageService: SondageService,
    private questionService: QuestionserviceService,
    private snackBar: MatSnackBar, 

  ) {
   }

  ngOnInit(): void {
    this.fetchAllSondages();
    this.sondageService.getCurrentUser().subscribe((userId) => {
    this.currentUserId = userId;
    this.showSondagesEndingWithinWeekPeriodically();
      
    });
    
  }

  refreshpage():void{
    window.location.reload();
  }
  filterSondage(): void {
    if (!this.searchCriteria) {
      this.SearchedSondages = this.ActiveSondages; // If search term is empty, show all biens
      return;
    }

    const searchTermLC = this.searchCriteria.toLowerCase();
    this.SearchedSondages = this.ActiveSondages.filter(sondage => sondage.title.toLowerCase().includes(searchTermLC));
  }
  onSearchTermChange(): void {
    this.filterSondage();
  }

  fetchAllSondages(): void {
    this.sondageService.fetchSAllSondages().subscribe(
      (sondages) => {
        this.sondages = sondages;
        this.ActiveSondages = this.sondages.filter(sondage => sondage.active === true);
        console.log(sondages) // Assign fetched sondages to the array
  
        // Retrieve all questions
        this.questionService.retrieveAllQuestions().subscribe(
          (questions) => {
            this.questions = questions;
            console.log(questions) // Assign fetched questions to the array
          },
          (error) => {
            console.error('Error fetching questions:', error);
            // Handle error, e.g., display error message to user
          }
        );
      },
      (error) => {
        console.error('Error fetching sondages:', error);
        // Handle error, e.g., display error message to user
      }
    );
  }
  openSondageWindow(sondage: any): void {
    console.log('Sondage ID:', sondage.idSondage); // Log the sondage ID
    const currentDate = new Date();
    const endDate = new Date(sondage.endDate);
  
    if (endDate < currentDate) {
      Swal.fire({
        icon: 'info',
        title: 'Sorry',
        text: 'The poll has ended. You can no longer Participate in it.',
        confirmButtonText: 'OK'
      });
      return; 
    }
  
    // Retrieve questions by sondage ID
    this.questionService.getQuestionsBySondageId(sondage.idSondage).subscribe(
      (questions) => {
        // Use SweetAlert2 to open the window/modal and display the details
        Swal.fire({
          title: sondage.title,
          html: `
          <div class="sondage-details">
  <div class="details-header">
    <p class="sondage-description">Description: ${sondage.description}</p>
  </div>
  <div class="details-info">
    <div class="detail">
      <span class="detail-label">Start Date:${sondage.startDate}</span>
    </div>
    <div class="detail">
      <span class="detail-label">End Date:${sondage.endDate}</span>
    </div>
  </div>
  <!-- Display filtered questions -->
  <div class="questions-list" id="questionsList">
    <h4 class="list-title">Questions:</h4>
  </div>
</div>

<!-- Add a <style> container for CSS -->
<style>
  .sondage-details {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    margin-top: 20px;
    background-color: #f9f9f9;
  }

  .details-header {
    margin-bottom: 20px;
  }

  .sondage-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .sondage-description {
    font-size: 1.1rem;
  }

  .details-info {
    display: flex;
    flex-wrap: wrap;
  }

  .detail {
    flex: 0 0 50%; /* Each detail takes half the width */
    margin-bottom: 10px;
  }

  .detail-label {
    font-weight: bold;
  }

  .list-title {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .questions-list ul {
    padding-left: 20px;
  }

  .question-item {
    margin-bottom: 15px;
  }

  .question-text {
    font-weight: bold;
    margin-right: 10px;
  }

  .response-input-container {
    margin-bottom: 10px;
  }
  
  .response-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
</style>

          `,
          showCancelButton: false,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: 'Submit',
          didOpen: () => {
            // JavaScript code to populate questions dynamically
            var questionsList = document.getElementById("questionsList") as HTMLElement;
            questions.forEach(function(question) {
              var p = document.createElement("p");
              p.className = "question";
              p.textContent = question.text;
              questionsList.appendChild(p);
  
              // Add input field for each question
              var input = document.createElement("input");
              input.type = "text";
              input.placeholder = "Enter your response";
              input.setAttribute("data-question-id", question.id); // Set question ID as data attribute
              input.classList.add("response-input");
              questionsList.appendChild(input);
            });
          },
          preConfirm: () => {
            const currentUser = this.currentUserId; // Retrieve the currently logged-in user's ID
            const questionsInputs = document.querySelectorAll('.questions-list input') as NodeListOf<HTMLInputElement>;
            
            // Array to store promises for each response
            const responsePromises: any[] = [];
        
            questionsInputs.forEach((questionInput) => {
                const questionId = parseInt(questionInput.getAttribute("data-question-id") || "");
                const response = questionInput.value;
        
                const responseData = {
                    "textReponse": response,
                    "user": { "id": currentUser.id }
                };
        
                // Call the service function to add one response
                const responsePromise = this.questionService.addOneResponseSondage(questionId, responseData)
                    .toPromise() // Convert Observable to Promise to use async/await
                    .then(() => {
                        // Additional functionality after adding the response for each question
                        return this.sondageService.addUserToSondage(sondage.idSondage).toPromise();
                    })
                    .catch(error => {
                        if (error.error.includes('Duplicate entry')) {
                            // User already participated in this sondage
                            Swal.fire('Already Participated', 'You have already participated in this sondage.', 'warning');
                        } else {
                            console.error('Error adding response:', error);
                            // Handle other errors adding response
                            Swal.fire('Error', 'Failed to add response to sondage. Please try again later.', 'error');
                        }
                        return Promise.reject('Error adding response');
                    });
        
                responsePromises.push(responsePromise);
            });
        
            // Wait for all response promises to resolve
            return Promise.all(responsePromises)
                .then(() => {
                    // Display success message after all responses are added
                    this.openSnackBar('Responses added! Thank you for participating in this poll', 'OK');
                })
                .catch(error => {
                    // Handle error adding responses
                    this.openSnackBar('Error adding responses, Try again!', 'OK');
                    return Promise.reject('Error adding responses');
                });
        }
        
        
        
        

        });
      },
      (error) => {
        console.error('Error fetching questions:', error);
        // Handle error, e.g., display error message to user
      }
    );
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  isEndDateWithinNextWeek(endDate: string): boolean {
    const currentDate = new Date();
    const endDateTime = new Date(endDate).getTime();
    const nextWeekDateTime = currentDate.getTime() + (7 * 24 * 60 * 60 * 1000);
    return endDateTime <= nextWeekDateTime;
  }
  showSondagesEndingWithinWeekPeriodically(): void {
    this.sondageService.fetchSondagesEndingWithinNextWeekPeriodically(5000).pipe(
      debounceTime(1000) // Wait for 5 seconds after receiving data
    ).subscribe(
      (sondages) => {
        if (sondages.length > 0) {
          // Display SweetAlert alert
          this.openSnackBar('There are '+ sondages.length + ' Polls ending within the week. Check them out!', 'OK');
        }
      },
      (error) => {
        console.error('Error fetching sondages ending within the week:', error);
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
              this.ActiveSondages = this.ActiveSondages.filter(s => s.idSondage !== sondageId);
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
  openReponseWindow(sondage: any): void {
    console.log('Sondage ID:', sondage.idSondage); // Log the sondage ID
  
    this.questionService.getQuestionsBySondageId(sondage.idSondage).subscribe(
      (questions: any[]) => {
        // Array to store promises for retrieving responses
        const responsePromises: Promise<any>[] = [];
  
        questions.forEach((question: any) => {
          const questionId = question.id;
          const responsePromise = this.questionService.getResponsesByQuestionId(questionId)
            .toPromise() // Convert Observable to Promise to use async/await
            .then((responses: any[] | undefined) => {
              if (responses) {
                question.responses = responses.map((response: any) => response.textReponse || '');
              } else {
                question.responses = [];
              }
            })
            .catch(error => {
              console.error('Error retrieving responses:', error);
              // Handle error retrieving responses
              question.responses = []; // Assign an empty array if there is an error
            });
  
          responsePromises.push(responsePromise);
        });
  
        // Wait for all response promises to resolve
        Promise.all(responsePromises).then(() => {
          // Build HTML to display questions and responses
          const questionsHTML = questions
            .map((question: any) => {
              const responsesHTML = question.responses && Array.isArray(question.responses)
                ? question.responses.map((response: any) => `<li>${response}</li>`).join('')
                : '';
  
              return `
                <div class="question-container">
                  <p class="question">${question.text}</p>
                  <ul class="responses">
                    ${responsesHTML}
                  </ul>
                </div>
              `;
            })
            .join('');
  
          // Use SweetAlert2 to display the questions and responses
          Swal.fire({
            title: 'Poll Questions and Responses',
            html: `
              <style>
                .custom-swal-container {
                  width: 600px;
                  max-width: 100%;
                  padding: 20px;
                }
  
                .custom-swal-title {
                  font-size: 24px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
  
                .custom-swal-html-container {
                  max-height: 400px;
                  overflow-y: auto;
                }
  
                .custom-swal-close-button {
                  color: #999;
                  font-size: 20px;
                  position: absolute;
                  top: 10px;
                  right: 10px;
                }
  
                .custom-swal-content {
                  margin-top: 20px;
                }
  
                .question-container {
                  margin-bottom: 20px;
                }
  
                .question {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
  
                .responses {
                  list-style-type: none;
                  padding-left: 0;
                }
  
                .responses li {
                  margin-bottom: 5px;
                }
              </style>
  
              <div class="questions-list">
                ${questionsHTML}
              </div>
            `,
            showCancelButton: false,
            showCloseButton: true,
            focusConfirm: false
          });
        });
      },
      error => {
        console.error('Error retrieving questions:', error);
        // Handle error retrieving questions
      }
    );
  }
  
  }
  
  
  
  
