import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {ForumService} from "../../service/forum.service";
import Swal from "sweetalert2";
import {Reponse} from "../model/Reponse";
import {User} from "../model/User";

@Component({
  selector: 'app-forum-admin',
  templateUrl: './forum-admin.component.html',
  styleUrls: ['./forum-admin.component.scss']
})
export class ForumAdminComponent implements OnInit {
  constructor(private forumService: ForumService) {  }
  listPublication: any;
  listReponses: any;
  responseData: any = {}; // Object to hold response data
  publicationData: any = {}; // Object to hold publication data
  lineChart: any; // Variable to hold the line chart
  selectedFilterOption: string = 'date'; // Default to 'date'
  searchQuery: string = '';
  applySearch(): void {
    if (this.searchQuery.trim() === '') {
      // If the search query is empty, show all publications
      this.forumService.getAllPublications().subscribe((data) => {
        // Sort publications by datePublication in descending order
        this.listPublication = data.sort((a: any, b: any) => {
          return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime();
        });
      });    } else {
      // Filter the listPublication array based on the search query
      this.listPublication = this.listPublication.filter((publication: any) => {
        // You can adjust this condition based on your search criteria
        return publication.publicationContent.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  }
  showCanvasInAlert(): void {
    Swal.fire({
      title: 'Forum Statistics',
      width: 1200,
      html: `
      <div style="display: flex; flex-wrap: wrap;">
        <div style="flex: 1 1 50%; max-width: 750px;">
          <canvas id="publicationLineChart" style="width: 100%; height: 500px;"></canvas>
        </div>
        <div style="flex: 1 1 50%; max-width: 750px;">
          <canvas id="publicationBarChart" style="width: 100%; height: 500px;"></canvas>
        </div>
        <div style="flex: 1 1 100%; max-width: 700px; margin-left: 300px; text-align: center;">
          <canvas id="activityPieChart" style="max-width: 700px; max-height: 600px;"></canvas>
        </div>
      </div>
    `,
      confirmButtonText: 'Close'
    });

    // After showing the dialog, initialize or update the canvas elements
    this.fetchPublicationData();
    this.fetchPublicationDataBar();
    this.fetchActivityData();
  }



  applyFilter(): void {
    const filterOption = this.selectedFilterOption;
    if (filterOption === 'date') {
      // Sort by date in ascending order
      this.listPublication.sort((a: any, b: any) => {
        return new Date(a.datePublication).getTime() - new Date(b.datePublication).getTime();
      });
    } else if (filterOption === 'date_desc') {
      // Sort by date in descending order
      this.listPublication.sort((a: any, b: any) => {
        return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime();
      });
    } else if (filterOption === 'responses') {
      // Sort by number of responses in ascending order
      this.listPublication.sort((a: any, b: any) => {
        const responsesA = this.countReponsesforPub(a);
        const responsesB = this.countReponsesforPub(b);
        return responsesA - responsesB;
      });
    } else if (filterOption === 'responses_desc') {
      // Sort by number of responses in descending order
      this.listPublication.sort((a: any, b: any) => {
        const responsesA = this.countReponsesforPub(a);
        const responsesB = this.countReponsesforPub(b);
        return responsesB - responsesA;
      });
    } else if (filterOption === 'likes') {
      // Sort by number of likes in ascending order
      this.listPublication.sort((a: any, b: any) => {
        return a.likes - b.likes;
      });
    } else if (filterOption === 'likes_desc') {
      // Sort by number of likes in descending order
      this.listPublication.sort((a: any, b: any) => {
        return b.likes - a.likes;
      });
    } else if (filterOption === 'dislikes') {
      // Sort by number of dislikes in ascending order
      this.listPublication.sort((a: any, b: any) => {
        return a.dislikes - b.dislikes;
      });
    } else if (filterOption === 'dislikes_desc') {
      // Sort by number of dislikes in descending order
      this.listPublication.sort((a: any, b: any) => {
        return b.dislikes - a.dislikes;
      });
    }
  }

  ngOnInit() {
this.fetchActivityData()
    this.forumService.getAllPublications().subscribe((data) => {
      // Sort publications by datePublication in descending order
      this.listPublication = data.sort((a: any, b: any) => {
        return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime();
      });
    });
    this.GetAllReponses()
    console.log(this.listReponses)
this.fetchPublicationDataBar()
console.log( this.fetchPublicationData())
  }

  refreshPage() {
    // Store the current scroll position
    var scrollPosition = window.scrollY || window.pageYOffset;

    // Reload the page
    window.location.reload();

    // Restore the scroll position after reload
    window.scrollTo(0, scrollPosition);
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

  ShowReponses(publication: any) {
    const responses = this.listReponses.filter((response: any) => response.publication === publication.idPublication);

    if (responses.length === 0) {
      Swal.fire({
        title: 'Empty',
        text: 'There are no responses for this publication.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
    } else {
      let responseTable = `<table style="border-collapse: collapse; width: 100%; border: 1px solid #dddddd;">
      <tr style="background-color: #f2f2f2;">
        <th style="padding: 10px;">User</th>
        <th style="padding: 10px;">Answer</th>
        <th style="padding: 10px;">Date</th>
        <th style="padding: 10px;">Likes</th>
        <th style="padding: 10px;">Dislikes</th>
        <th style="padding: 10px;">Actions</th>
      </tr>`;
      responses.forEach((response: any) => {
        responseTable += `<tr>
        <td style="padding: 10px; border: 1px solid #dddddd;">${response.reponseCreatedBy.username}</td>
        <td style="padding: 10px; border: 1px solid #dddddd;">${response.reponse}</td>
        <td style="padding: 10px; border: 1px solid #dddddd;">${response.date_reponse}</td>
        <td style="padding: 10px; border: 1px solid #dddddd;">${response.likes}</td>
        <td style="padding: 10px; border: 1px solid #dddddd;">${response.dislikes}</td>
        <td style="padding: 10px; border: 1px solid #dddddd;">
          <button type="button" class="btn btn-outline-danger delete-button" data-response-id="${response.idReponse}">Delete</button>
        </td>
      </tr>`;
      });
      responseTable += '</table>';

      Swal.fire({
        html: responseTable,
        confirmButtonText: 'OK',
        width: '80%' // Adjust the width of the dialog box
      });

      const Deletereponse = document.querySelectorAll('.delete-button');
      Deletereponse.forEach((button: Element) => {
        button.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent the event from propagating to the parent dialog

          const responseId = button.getAttribute('data-response-id');
          if (responseId !== null) {
            console.log('Current Response ID:', responseId);
            this.removeReponse(parseInt(responseId, 10)); // Convert responseId to number
            // Perform your edit action here using the responseId
          }
        });
      });
    }
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
          this.refreshPage();
          // If needed, handle success response
          // For example, you can refresh the publication list after deletion
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




  countReponsesforPub(publication: any) {
    const responses = this.listReponses.filter((response: any) => response.publication === publication.idPublication);
    const count = responses.length; // Get the count of responses
    return count; // Return the count
  }



  fetchPublicationData(): void {
    this.forumService.getAllPublications().subscribe(
      (publications: any[]) => {
        if (!publications || publications.length === 0) {
          console.log("No publication data available.");
          return;
        }

        const publicationData: { [date: string]: number } = {};
        const responseData: { [date: string]: number } = {}; // Object to hold response data

        // Process publication data
        publications.forEach((publication: any) => {
          const date = new Date(publication.datePublication).toISOString().slice(0, 10);
          publicationData[date] = (publicationData[date] || 0) + 1;
        });

        // Fetch all responses
        this.forumService.getAllReponses().subscribe(
          (responses: any[]) => {
            if (responses && responses.length > 0) {
              responses.forEach((response: any) => {
                const date = new Date(response.date_reponse).toISOString().slice(0, 10);
                responseData[date] = (responseData[date] || 0) + 1;
              });
            }

            const sortedPublicationDates = Object.keys(publicationData).sort();
            const sortedResponseDates = Object.keys(responseData).sort();
            const sortedDates = Array.from(new Set([...sortedPublicationDates, ...sortedResponseDates])).sort();
            const publicationCounts = sortedDates.map(date => publicationData[date] || 0);
            const responseCounts = sortedDates.map(date => responseData[date] || 0);

            this.createLineChart(sortedDates, publicationCounts, responseCounts);
          },
          error => {
            console.error("Error fetching responses:", error);
          }
        );
      },
      error => {
        console.error("Error fetching publication data:", error);
      }
    );
  }

  createLineChart(labels: string[], publicationData: number[], responseData: number[]): void {
    const ctx = document.getElementById('publicationLineChart');
    if (ctx instanceof HTMLCanvasElement) {
      this.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels.map(date => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })),
          datasets: [{
            label: 'Publications per Day',
            data: publicationData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }, {
            label: 'Answers per Day',
            data: responseData,
            fill: false,
            borderColor: 'rgb(192, 75, 192)',
            tension: 0.1
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Number Posts and Answers per day',
              font: {
                size: 30 // Adjust the size as needed
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1 // Set the step size to 1 to display integer labels
              }
            }
          }
        }
      });
    } else {
      console.error('Canvas element with ID "publicationLineChart" not found.');
    }
  }



  fetchPublicationDataBar(): void {
    this.forumService.getAllPublications().subscribe(
      (publications: any[]) => {
        if (!publications || publications.length === 0) {
          console.log("No publication data available.");
          return;
        }

        const publicationData: { [date: string]: { likes: number, dislikes: number } } = {};

        // Process publication data
        publications.forEach((publication: any) => {
          const date = new Date(publication.datePublication).toISOString().slice(0, 10);
          if (!publicationData[date]) {
            publicationData[date] = { likes: 0, dislikes: 0 };
          }
          publicationData[date].likes += publication.likes;
          publicationData[date].dislikes += publication.dislikes;
        });

        // Fetch all responses
        this.forumService.getAllReponses().subscribe(
          (responses: any[]) => {
            if (responses && responses.length > 0) {
              responses.forEach((response: any) => {
                const date = new Date(response.date_reponse).toISOString().slice(0, 10);
                if (!publicationData[date]) {
                  publicationData[date] = { likes: 0, dislikes: 0 };
                }
                publicationData[date].likes += response.likes;
                publicationData[date].dislikes += response.dislikes;
              });
            }

            const sortedDates = Object.keys(publicationData).sort();
            const likesData = sortedDates.map(date => publicationData[date].likes || 0);
            const dislikesData = sortedDates.map(date => publicationData[date].dislikes || 0);

            this.createBarChart(sortedDates, likesData, dislikesData);
          },
          error => {
            console.error("Error fetching responses:", error);
          }
        );
      },
      error => {
        console.error("Error fetching publication data:", error);
      }
    );
  }

  createBarChart(labels: string[], likesData: number[], dislikesData: number[]): void {
    const ctx = document.getElementById('publicationBarChart');
    if (ctx instanceof HTMLCanvasElement) {
      this.lineChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels.map(date => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })),
          datasets: [{
            label: 'Likes',
            data: likesData,
            backgroundColor: 'rgb(255, 99, 132)'
          }, {
            label: 'Dislikes',
            data: dislikesData,
            backgroundColor: 'rgb(54, 162, 235)'
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Number of Likes and Dislikes',
              font: {
                size: 30 // Adjust the size as needed
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      console.error('Canvas element with ID "publicationBarChart" not found.');
    }
  }

  fetchActivityData(): void {
    this.forumService.getAllPublications().subscribe(
      (publications: any[]) => {
        if (!publications || publications.length === 0) {
          console.log("No publication data available.");
          return;
        }

        // Calculate total likes and dislikes for publications
        let totalLikesPublications = 0;
        let totalDislikesPublications = 0;
        publications.forEach((publication: any) => {
          totalLikesPublications += publication.likes;
          totalDislikesPublications += publication.dislikes;
        });

        // Fetch all responses
        this.forumService.getAllReponses().subscribe(
          (responses: any[]) => {
            if (responses && responses.length > 0) {
              // Calculate total number of responses
              const totalResponses = responses.length;

              // Calculate total likes and dislikes for responses
              let totalLikesResponses = 0;
              let totalDislikesResponses = 0;
              responses.forEach((response: any) => {
                totalLikesResponses += response.likes;
                totalDislikesResponses += response.dislikes;
              });

              // Calculate total activity
              const totalLikes = totalLikesPublications + totalLikesResponses;
              const totalDislikes = totalDislikesPublications + totalDislikesResponses;

              // Create the pie chart
              this.createPieChart(totalLikes, totalDislikes, publications.length, totalResponses);
            } else {
              // If there are no responses, create the pie chart with publication data only
              const totalLikes = totalLikesPublications;
              const totalDislikes = totalDislikesPublications;
              this.createPieChart(totalLikes, totalDislikes, publications.length, 0);
            }
          },
          error => {
            console.error("Error fetching responses:", error);
          }
        );
      },
      error => {
        console.error("Error fetching publication data:", error);
      }
    );
  }

  createPieChart(totalLikes: number, totalDislikes: number, numPublications: number, numResponses: number): void {
    const ctx = document.getElementById('activityPieChart');
    if (ctx instanceof HTMLCanvasElement) {
      this.lineChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Total Likes', 'Total Dislikes', 'Number of Posts', 'Number of Answers'],
          datasets: [{
            label: 'Activity',
            data: [totalLikes, totalDislikes, numPublications, numResponses],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)'
            ],
            hoverOffset: 4
          }]
        },options: {
          plugins: {
            title: {
              display: true,
              text: 'Activity Summary',
              font: {
                size: 30 // Adjust the size as needed
              }
            }
          }
        }
      });

    } else {
      console.error('Canvas element with ID "activityPieChart" not found.');
    }
  }



}
