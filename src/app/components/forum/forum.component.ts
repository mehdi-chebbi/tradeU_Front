import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../service/forum.service';
import { Router } from "@angular/router";
import { Publication } from '../model/publication';
import {User} from "../model/User";
import Swal from 'sweetalert2';

import {HttpErrorResponse} from "@angular/common/http";
import {Reponse} from "../model/Reponse";
import {Observable} from "rxjs"; // Import the Publication interface

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {
  listPublication: any;
  listReponses: any;
  publicationContent: string = '';
  currentUserId!: User;
  publicationContents: { [key: number]: string } = {}; // Object to store publication contents by ID

  constructor(private forumService: ForumService, private router: Router) {}

  ngOnInit() {
    this.forumService.getAllPublications().subscribe((data) => {
      // Sort publications by datePublication in descending order
      this.listPublication = data.sort((a: any, b: any) => {
        return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime();
      });
      console.log(this.listPublication);
      this.GetAllReponses();
      console.log(this.listReponses)

    });

    this.forumService.getCurrentUser().subscribe((data)=>{
this.currentUserId=data
    })
  }
  refreshPage() {
    // Store the current scroll position
    var scrollPosition = window.scrollY || window.pageYOffset;

    // Reload the page
    window.location.reload();

    // Restore the scroll position after reload
    window.scrollTo(0, scrollPosition);
  }


  updatePublications(id: number, publication: Publication) {
    Swal.fire({
      title: 'Update Publication',
      input: 'text',
      inputValue: publication.publicationContent, // Set initial value if needed
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a new title!';
        }
        // If validation passes, return undefined (no error)
        return undefined;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        publication.publicationContent = result.value;
console.log(     "here",   publication)
        console.log(result.value)// Update publication title
        this.forumService.updatePublication(id, publication.publicationContent).subscribe(
          (response) => {
            console.log(response);
            // Handle success if needed
          },
          (error) => {
            console.error('Error updating publication:', error);
            // Handle error if needed
          }
        );
      }
    });
  }

  likePublication(id: number): void {
    this.forumService.likePublication(id).subscribe(
      response => {
        console.log(response);
        if (response && response.message === 'Publication liked successfully.') {
          // Success: Like alert
          Swal.fire({
            icon: 'success',
            title: 'Liked!',
            showConfirmButton: false,
            timer: 3000 // Auto close after 5 seconds
          }).then(() => {
            // Call refreshPage after the alert is closed
            this.refreshPage();
          });
        } else {
          // Dislike alert
          Swal.fire({
            icon: 'error',
            title: 'Like Removed!',
            showConfirmButton: false,
            timer: 3000 // Auto close after 5 seconds
          }).then(() => {
            // Call refreshPage after the alert is closed
            this.refreshPage();
          });
        }
      },
      error => {
        console.error("error");
      }
    );
  }

  dislikePublication(id: number): void {
    this.forumService.dislikePublication(id).subscribe(
      response => {
        console.log(response);
        if (response && response.message === 'Publication disliked successfully.') {
          // Success: Like alert
          Swal.fire({
            icon: 'success',
            title: 'Disliked!',
            showConfirmButton: false,
            timer: 3000 // Auto close after 5 seconds
          }).then(() => {
            // Call refreshPage after the alert is closed
            this.refreshPage();
          });
        } else {
          // Dislike alert
          Swal.fire({
            icon: 'error',
            title: 'Dislike Removed!',
            showConfirmButton: false,
            timer: 3000 // Auto close after 5 seconds
          }).then(() => {
            // Call refreshPage after the alert is closed
            this.refreshPage();
          });
        }
      },
      error => {
        console.error("error");
      }
    );
  }



  sharePublication(id: number) {
    this.forumService.tweetPublication(id).subscribe(
      (url: string) => {
        // Open the Twitter Web Intent URL in a new window/tab
        window.open(url, '_blank');
      },
      (error) => {
        console.error('Error tweeting publication:', error);
        // Handle the error here
      }
    );
  }
  addPublication(content: string) {
  // Check for bad words before adding the publication



  const newPublication: Publication = {
    publicationContent: content,
    reponses: [],
    likes: 0,
    dislikes: 0,
    likedByUsers: [],
    dislikedByUsers: []
  };

  this.forumService.addPublication(newPublication).subscribe((response) => {
    console.log(response );
    if (response.message === 'bad word') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Publication contains a prohibited word!',
        footer: '<a>Please review our content policy for more information.</a>'
      });
    } else {
      this.refreshPage();
    }
    // If needed, handle success response
    // For example, you can navigate to a different page or display a success message
  });

}
  removePublication(idPub: number) {
    // Display confirmation alert
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this publication!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed deletion, proceed with deletion
        this.forumService.removePublication(idPub).subscribe((response) => {
          console.log(response);
          // If needed, handle success response
          // For example, you can refresh the publication list after deletion
          this.refreshPage(); // Assuming you want to refresh the page after deletion
        }, (error) => {
          console.error('Error removing publication:', error);
          // If needed, handle error response
          // For example, you can display an error message to the user
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User cancelled deletion, do nothing
      }
    });
  }

  translatePublicationToArabic(id: number, index: number) {
    this.forumService.translatePublicationByIdToArabic(id).subscribe(
      (translatedContent) => {
        // Update the content of the publication at the specified index
        this.listPublication[index].publicationContent = translatedContent;
        console.log(translatedContent);
      },
      (error) => {
        console.error('Error translating publication:', error);
        this.listPublication[index].publicationContent = 'Error translating publication';
      }
    );
  }
  translatePublicationToSpanish(id: number, index: number) {
    this.forumService.translatePublicationByIdToSpanish(id).subscribe(
      (translatedContent) => {
        // Update the content of the publication at the specified index
        this.listPublication[index].publicationContent = translatedContent;
        console.log(translatedContent);
      },
      (error) => {
        console.error('Error translating publication:', error);
        this.listPublication[index].publicationContent = 'Error translating publication';
      }
    );
  }
  translatePublicationToFrench(id: number, index: number) {
    this.forumService.translatePublicationByIdToFrench(id).subscribe(
      (translatedContent) => {
        // Update the content of the publication at the specified index
        this.listPublication[index].publicationContent = translatedContent;
        console.log(translatedContent);
      },
      (error) => {
        console.error('Error translating publication:', error);
        this.listPublication[index].publicationContent = 'Error translating publication';
      }
    );
  }

  //---------------Fonctions-------Reponse----------------------
  GetAllReponses(): void {
    this.forumService.getAllReponses().subscribe(
      (data) => {
        console.log('Responses:', data);
        this.listReponses = data; // Assign fetched data to listReponses
      },
      (error) => {
        console.error('Error fetching responses in component:', error);
        // Handle error in your component
      }
    );
  }
  formatDate(dateString: string): string {
    // Create a new Date object from the provided date string
    const date: Date = new Date(dateString);

    // Define options for formatting the date
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

    // Format the date as desired (e.g., "20 April 2000")
    const formattedDate: string = date.toLocaleDateString('en-US', options);

    return formattedDate;
  }

  showResponses(publication: any) {
    // Get responses for the publication
    const responses = this.listReponses.filter((response: any) => response.publication === publication.idPublication);

    // Format responses for display
    let responseHTML = '';
    responses.forEach((response: any) => {
      // Concatenate user name and response content
      responseHTML += `
<style>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  font-size: 14px; /* Adjust the font size as needed */
  padding: 6px 8px; /* Adjust the padding as needed */
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 30px; /* Adjust the width as needed */
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 6px 8px; /* Adjust the padding as needed */
  font-size: 14px; /* Adjust the font size as needed */
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
</style>

<div class="response" style="display: flex; align-items: center; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
  <div style="display: flex; flex-direction: column;">
    <strong style="min-width: 100px;">${response.reponseCreatedBy.name} : </strong>
    <span style="font-size: 10px;">Answered on ${this.formatDate(response.date_reponse)}</span>
  </div>
  <div style="overflow-x: auto;margin-left: 20px" class="response-text" >
    ${response.reponse}
  </div>
  <div style="margin-left: auto;">
    <button type="button" class="btn btn-outline-success" data-response-id-like="${response.idReponse}">
      <i class="fa fa-thumbs-up"></i> ${response.likes}
    </button>
    <button type="button" class="btn btn-outline-danger" style="margin-left: 10px;" data-response-id-dislike="${response.idReponse}">
      <i class="fa fa-thumbs-down"></i> ${response.dislikes}
    </button>
    ${response.reponseCreatedBy.name === this.currentUserId.name ? `
    <div class="dropdown">
      <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        &#9776; Actions
      </button>
      <div class="dropdown-content">
        <button type="button" class="btn btn-outline-primary edit-button" data-response='${JSON.stringify(response)}'>
          <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="btn btn-outline-secondary delete-button" data-response-id="${response.idReponse}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    ` : `
    <div class="dropdown">
      <button class="btn btn-outline-info sharp-corner ">
        <i class="fa fa-language "></i>
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <a>
          <i class="flag-icon flag-icon-sa stylish-icon" data-response-id-arabic="${response.idReponse}"></i>
        </a>
        <a>
          <i class="flag-icon flag-icon-fr stylish-icon" data-response-id-french="${response.idReponse}"></i>
        </a>
        <a>
          <i class="flag-icon flag-icon-es stylish-icon" data-response-id-spanish="${response.idReponse}"></i>
        </a>
      </div>
    </div>
    `}
  </div>
</div>
`;
    });

    // Create custom HTML content for the SweetAlert modal
    const swalContent = `
    <div class="publication">
      <div style="margin-bottom: 10px; display: flex; align-items: center;">
        <input type="text" id="responseText" placeholder="Enter your Answer" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; flex: 1;">
        <button type="button" id="submitResponse" class="btn btn-primary" style="margin-left: 10px; padding: 8px 16px; border-radius: 4px; background-color: #007bff; color: #fff; border: none; cursor: pointer;">Submit</button>
      </div>
      <div class="responses">${responseHTML}</div>
    </div>
  `;

    // Open SweetAlert modal with custom HTML content
    Swal.fire({
      html: swalContent,
      showConfirmButton: false, // This hides the OK button
      width: 1000,
    });

    // Add event listener to submit button
    const submitButton = document.getElementById('submitResponse');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        const responseText = (<HTMLInputElement>document.getElementById('responseText')).value;
        if (responseText.trim() !== '') {
          // Call addResponse function with publication ID and response content
          this.addResponse(publication.idPublication, responseText);
          this.refreshPage()
        }
      });
    }

    const Deletereponse = document.querySelectorAll('.delete-button');
    Deletereponse.forEach((button: Element) => {
      button.addEventListener('click', (event) => {
        const responseId = button.getAttribute('data-response-id');
        if (responseId !== null) {
          console.log('Current Response ID:', responseId);
          this.removeReponse(parseInt(responseId, 10)); // Convert responseId to number
          // Perform your edit action here using the responseId
        }
      });
    });


    // Add event listener to delete buttons
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach((button: Element) => {
      button.addEventListener('click', (event) => {
        const responseString = button.getAttribute('data-response');
        if (responseString !== null) {
          const response = JSON.parse(responseString);
          console.log('Current Response Object:', response);
          this.updateReponse(response.idReponse,response.reponse)
          // Perform your delete action here using the response object
        } else {
          console.error('No data-response attribute found on the delete button.');
        }
      });
    });
    const saudiFlagButtons = document.querySelectorAll('.flag-icon-sa');

    saudiFlagButtons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('Saudi flag button clicked');

        // Find the closest response element
        const currentResponseElement = button.closest('.response');

        // Ensure that a response element is found before updating the response text
        if (currentResponseElement) {
          const responseTextElement = currentResponseElement.querySelector('.response-text');

          // Check if response text element is found
          if (responseTextElement) {
            // Update response text content to "Arabe"

            // Log the current response ID
            const responseIdString = button.getAttribute('data-response-id-arabic') ?? ''; // Ensure a string or an empty string
            const responseId = parseInt(responseIdString, 10); // Parse string to integer
            this.translateResponseToArabic(responseId).subscribe(
              (translatedResponse: string) => {
                // Use the translated response here
                console.log('Translated response:', translatedResponse);
                responseTextElement.textContent = translatedResponse;
                // Assign translatedResponse to a variable if needed
                // let ar: string = translatedResponse;
              },
              (error: any) => {
                // Handle errors here
                console.error('Error translating response:', error);
              }
            );


            if (responseId !== null) {
              console.log('Current Response ID:', responseId);
            } else {
              console.error('Response ID not found.');
            }
          } else {
            console.error('Response text element not found.');
          }
        } else {
          console.error('No response element found.');
        }
      });
    });




    const spanishFlagButtons = document.querySelectorAll('.flag-icon-es');

    spanishFlagButtons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('Saudi flag button clicked');

        // Find the closest response element
        const currentResponseElement = button.closest('.response');

        // Ensure that a response element is found before updating the response text
        if (currentResponseElement) {
          const responseTextElement = currentResponseElement.querySelector('.response-text');

          // Check if response text element is found
          if (responseTextElement) {
            // Update response text content to "Arabe"

            // Log the current response ID
            const responseIdString = button.getAttribute('data-response-id-spanish') ?? ''; // Ensure a string or an empty string
            const responseId = parseInt(responseIdString, 10); // Parse string to integer
            this.translateResponseToSpanish(responseId).subscribe(
              (translatedResponse: string) => {
                // Use the translated response here
                console.log('Translated response:', translatedResponse);
                responseTextElement.textContent = translatedResponse;
                // Assign translatedResponse to a variable if needed
                // let ar: string = translatedResponse;
              },
              (error: any) => {
                // Handle errors here
                console.error('Error translating response:', error);
              }
            );


            if (responseId !== null) {
              console.log('Current Response ID:', responseId);
            } else {
              console.error('Response ID not found.');
            }
          } else {
            console.error('Response text element not found.');
          }
        } else {
          console.error('No response element found.');
        }
      });
    });







    const FrenchFlagButtons = document.querySelectorAll('.flag-icon-fr');

    FrenchFlagButtons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('Saudi flag button clicked');

        // Find the closest response element
        const currentResponseElement = button.closest('.response');

        // Ensure that a response element is found before updating the response text
        if (currentResponseElement) {
          const responseTextElement = currentResponseElement.querySelector('.response-text');

          // Check if response text element is found
          if (responseTextElement) {
            // Update response text content to "Arabe"

            // Log the current response ID
            const responseIdString = button.getAttribute('data-response-id-french') ?? ''; // Ensure a string or an empty string
            const responseId = parseInt(responseIdString, 10); // Parse string to integer
            this.translateResponseToFrench(responseId).subscribe(
              (translatedResponse: string) => {
                // Use the translated response here
                console.log('Translated response:', translatedResponse);
                responseTextElement.textContent = translatedResponse;
                // Assign translatedResponse to a variable if needed
                // let ar: string = translatedResponse;
              },
              (error: any) => {
                // Handle errors here
                console.error('Error translating response:', error);
              }
            );


            if (responseId !== null) {
              console.log('Current Response ID:', responseId);
            } else {
              console.error('Response ID not found.');
            }
          } else {
            console.error('Response text element not found.');
          }
        } else {
          console.error('No response element found.');
        }
      });
    });






    const LikeButton = document.querySelectorAll('.btn-outline-success');
    LikeButton.forEach((button: Element) => {
      button.addEventListener('click', (event) => {
        const responseId = button.getAttribute('data-response-id-like');
        if (responseId !== null) {
          console.log('Current Response ID:', responseId);
          this.likeReponse(parseInt(responseId, 10)); // Convert responseId to number
          // Perform your edit action here using the responseId
        }
      });
    });

    const disLikeButton = document.querySelectorAll('.btn-outline-danger');
    disLikeButton.forEach((button: Element) => {
      button.addEventListener('click', (event) => {
        const responseId = button.getAttribute('data-response-id-dislike');
        if (responseId !== null) {
          console.log('Current Response ID:', responseId);
          this.dislikeReponse(parseInt(responseId, 10)); // Convert responseId to number
          // Perform your edit action here using the responseId
        }
      });
    });



  }

  updateReponse(id: number, newContent: string) {
    Swal.fire({
      title: 'Update Response',
      input: 'text',
      inputValue: newContent, // Set initial value if needed
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a new content!';
        }
        // If validation passes, return undefined (no error)
        return undefined;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedResponse: Reponse = {
          idReponse: id,
          reponse: result.value,
          // You can initialize other properties here if needed
        };

        this.forumService.updateReponse(id, updatedResponse).subscribe(
          (response) => {
            console.log('Response updated successfully:', response);
            // Call refreshPage function to refresh the page
            this.refreshPage();
          },
          (error) => {
            console.error('Error updating response:', error);
            // Handle error, if needed
          }
        );
      }
    });
  }
  removeReponse(idPub: number) {
    // Display confirmation alert
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this publication!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed deletion, proceed with deletion
        this.forumService.removeReponse(idPub).subscribe((response) => {
          console.log(response);
          // If needed, handle success response
          // For example, you can refresh the publication list after deletion
          this.refreshPage(); // Assuming you want to refresh the page after deletion
        }, (error) => {
          console.error('Error removing publication:', error);
          // If needed, handle error response
          // For example, you can display an error message to the user
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User cancelled deletion, do nothing
      }
    });
  }

  addResponse(idPublication: number, content: string): void {
    const response: Reponse = {
      reponse: content,
      publication: null!, // Assuming you'll set this after adding the response
      likedByUsers: [], // Assuming you'll set this after adding the response
      dislikedByUsers: [], // Assuming you'll set this after adding the response
      likes: 0,
      dislikes: 0
    };

    this.forumService.addReponse(idPublication, response)
      .subscribe(
        () => {
          console.log('Response added successfully');
          // Handle success as needed
        },
        error => {
          console.error('Error adding response:', error);
          // Handle error as needed
        }
      );
  }

  likeReponse(id: number): void {
    this.forumService.likeReponse(id).subscribe(
      response => {
        console.log(response);
        if (response && response.message === 'Reponse liked successfully.') {
          // Success: Like alert
          Swal.fire({
            icon: 'success',
            title: 'Liked!',
            showConfirmButton: false,
            timer: 3000 // Auto close after 5 seconds
          }).then(() => {
            // Call refreshPage after the alert is closed
            this.refreshPage();
          });
        } else {
          // Dislike alert
          Swal.fire({
            icon: 'error',
            title: 'Like Removed!',
            showConfirmButton: false,
            timer: 3000 // Auto close after 5 seconds
          }).then(() => {
            // Call refreshPage after the alert is closed
            this.refreshPage();
          });
        }
      },
      error => {
        console.error("error");
      }
    );
  }

  dislikeReponse(id: number): void {
    this.forumService.dislikeReponse(id).subscribe(
      response => {
        console.log(response);
        if (response && response.message === 'Reponse disliked.') {
          // Success: Like alert
          Swal.fire({
            icon: 'success',
            title: 'Disliked!',
            showConfirmButton: false,
            timer: 3000 // Auto close after 5 seconds
          }).then(() => {
            // Call refreshPage after the alert is closed
            this.refreshPage();
          });
        } else {
          // Dislike alert
          Swal.fire({
            icon: 'error',
            title: 'Dislike Removed!',
            showConfirmButton: false,
            timer: 3000 // Auto close after 5 seconds
          }).then(() => {
            // Call refreshPage after the alert is closed
            this.refreshPage();
          });
        }
      },
      error => {
        console.error("error");
      }
    );
  }

  translateResponseToArabic(id: number): Observable<string> {
    return this.forumService.translateReponseByIdToArabic(id);
  }
  translateResponseToFrench(id: number): Observable<string> {
    return this.forumService.translateReponseByIdToFrench(id);
  }
  translateResponseToSpanish(id: number): Observable<string> {
    return this.forumService.translateReponseByIdToSpanish(id);
  }


}
