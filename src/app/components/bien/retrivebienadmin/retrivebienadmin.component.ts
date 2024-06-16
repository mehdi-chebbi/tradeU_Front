import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BienserviceService } from 'src/app/service/bienservice.service';
import { FeedbackserviceService } from 'src/app/service/feedbackservice.service';
import { JwtService } from 'src/app/service/jwt.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-retrivebienadmin',
  templateUrl: './retrivebienadmin.component.html',
  styleUrls: ['./retrivebienadmin.component.scss']
})
export class RetrivebienadminComponent {
  biens: any[] = []; // Ajout de l'initialisation
  BASE_URL: string = 'http://localhost:8083/';

  constructor(private service: BienserviceService, private http: HttpClient,private jwtService :JwtService, private router: Router, private feedbackService: FeedbackserviceService) { 
   
   }

  ngOnInit(): void {
    this.retrievebiensadmin();
  }

  retrievebiensadmin(): void {
    this.service.retrievebiensadmin().subscribe(
      (data: any) => {
        console.log(data); // Vérifiez les données renvoyées dans la console
        this.biens = data; // Attribuez les données à la variable biens
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des biens: ', error);
      }
    );
  }
  deleteBienadmin(id: number): void {
    const token = localStorage.getItem('jwt');
  
    if (token) {
      this.service.deleteBienadmin(id).subscribe(
        (data: any) => {
          console.log(data);
        //  this.retrieveBiens();
          alert('Bien supprimé avec succès.');
          window.location.reload();
        },
        (error: any) => {
          console.error('Une erreur s\'est produite lors de la suppression du bien: ', error);
          alert('Une erreur s\'est produite lors de la suppression du bien. Veuillez réessayer.');
        }
      );
    } else {
      console.error('Token not found');
      alert('Token not found');
    }
  }
 
 
  changerEtatAutorisationBien(id: number): void {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.service.activerbien(id).subscribe(
        (data: any) => {
          console.log(data);
          alert('L\'état d\'autorisation du bien a été modifié avec succès.');
          // Recharger les données après la modification
          window.location.reload();
          
        },
        (error: any) => {
          console.error('Une erreur s\'est produite lors du changement d\'état d\'autorisation du bien: ', error);
          alert('Une erreur s\'est produite lors du changement d\'état d\'autorisation du bien. Veuillez réessayer.');
        }
      );
    } else {
      console.error('Token not found');
      alert('Token not found');
    }
  }
  




  changerEtatAutorisationBienfalse(id: number): void {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.service.desactiverbien(id).subscribe(
        (data: any) => {
          console.log(data);
          alert('L\'état d\'autorisation du bien a été modifié avec succès.');
          // Recharger les données après la modification
          window.location.reload();
        },
        (error: any) => {
          console.error('Une erreur s\'est produite lors du changement d\'état d\'autorisation du bien: ', error);
          alert('Une erreur s\'est produite lors du changement d\'état d\'autorisation du bien. Veuillez réessayer.');
        }
      );
    } else {
      console.error('Token not found');
      alert('Token not found');
    }
  }




  deleteBien(id: number): void {
    const token = localStorage.getItem('jwt');
  
    if (token) {
      this.service.deleteBien(id).subscribe(
        (data: any) => {
          console.log(data);
        //  this.retrieveBiens();
          alert('Bien supprimé avec succès.');
          window.location.reload();
        },
        (error: any) => {
          console.error('Une erreur s\'est produite lors de la suppression du bien: ', error);
          alert('Une erreur s\'est produite lors de la suppression du bien. Veuillez réessayer.');
        }
      );
    } else {
      console.error('Token not found');
      alert('Token not found');
    }
  }
  isOwner(bien: any): boolean {
    const token = localStorage.getItem('jwt');
    let userId = '';
  
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1].replace(/_/g, '/').replace(/-/g, '+')));
      userId = tokenPayload.sub;
    }
  
    return bien.user && userId === bien.user.id;
  }
  


  logout(): void {
    const token = localStorage.getItem('jwt'); // Récupérer le token JWT depuis le localStorage
    if (token) {
      this.jwtService.logout(token).subscribe(
        (response) => {
          console.log(response); // Afficher la réponse du backend
          // Ajoutez ici la logique de redirection ou de traitement après la déconnexion
          localStorage.removeItem('jwt');// Effacer le token JWT du localStorage
          localStorage.removeItem('name');
          localStorage.removeItem('phone');
          localStorage.removeItem('adress');
          localStorage.removeItem('role');
          this.router.navigateByUrl('/login');


        },
        (error) => {
          console.error(error); // Afficher les erreurs éventuelles
          // Ajoutez ici la logique pour gérer les erreurs de déconnexion
        }
      );
    } else {
      console.warn("No JWT token found in localStorage.");
      // Ajoutez ici la logique pour gérer l'absence de token JWT dans le localStorage
    }
  } 
  openFeedbackAlert(bienId: number): void {
    this.feedbackService.fetchSFeedbackbyBienId(bienId).subscribe(
        (feedbackDataList: any[]) => {
            // Check if feedback data list is not empty
            if (feedbackDataList.length > 0) {
                // Initialize HTML content to accumulate feedback details
                let htmlContent = '';

                // Iterate over each feedback
                feedbackDataList.forEach(feedbackData => {
                    // Format the submission date (assuming it's in ISO format)
                    const submissionDate = new Date(feedbackData.submissionDate2).toLocaleString();

                    // Convert numeric rating to descriptive term
                    const ratingText = this.convertRatingToText(feedbackData.rating);

                    // Add feedback details to the HTML content
                    htmlContent += `
                        <div>
                            <p><strong>Submission Date:</strong> ${submissionDate}</p>
                            <p><strong>Creator:</strong> ${feedbackData.user.email}</p>
                            <p><strong>Rating:</strong> ${ratingText}</p>
                            <p><strong>Message:</strong> ${feedbackData.contenu}</p>
                        </div>
                        <hr>`; // Add horizontal line to separate feedbacks
                });

                // Open Swal alert with the feedback data
                Swal.fire({
                    title: 'Feedback Details',
                    html: htmlContent,
                    icon: 'info',
                    confirmButtonText: 'Close'
                });
            } else {
                // No feedback data found for the given bienId
                Swal.fire('No Feedback', 'No feedback available for this property.', 'info');
            }
        },
        (error) => {
            // Error occurred while fetching feedback data
            console.error('Error fetching feedback data:', error);
            Swal.fire('Error', 'Failed to fetch feedback data. Please try again later.', 'error');
        }
    );
}

convertRatingToText(rating: string): string {
  switch (rating) {
      case 'ONE':
          return 'Very Bad';
      case 'TWO':
          return 'Bad';
      case 'TREE':
          return 'Neutral';
      case 'FOUR':
          return 'Good';
      case 'FIVE':
          return 'Very Good';
      default:
          return 'Unknown';
  }
}





}
