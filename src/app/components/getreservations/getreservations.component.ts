import { Component, OnInit } from '@angular/core';
import { PlaceService } from 'src/app/service/place.service';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/service/reservation.service';
import { JwtService } from 'src/app/service/jwt.service';

@Component({
  selector: 'app-getreservations',
  templateUrl: './getreservations.component.html',
  styleUrls: ['./getreservations.component.scss']
})
export class GetreservationsComponent implements OnInit{
  reservations: any[] = [];
  filteredReservations: any[] = [];


  constructor(private reservationService: ReservationService, private router: Router,private jwtService: JwtService) { }

  ngOnInit(): void {
    this.getreservations();

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
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
}


  getreservations(): void {
    this.reservationService.getReservations().subscribe(
      (data: any) => {
        console.log(data);
        this.reservations = data;
        // Initialize filteredReservations with all reservations initially
        this.filteredReservations = this.reservations;
      },
      (error: any) => {
        console.error('An error occurred while fetching reservations: ', error);
      }
    );
  }

  searchReservations(): void {
    if (!this.searchTerm.trim()) {
      // If search term is empty, display all reservations
      this.filteredReservations = this.reservations;
    } else {
      // Filter reservations by name or description
      const searchTermLower = this.searchTerm.trim().toLowerCase();
      this.filteredReservations = this.reservations.filter(reservation =>
        reservation.placeName.toLowerCase().includes(searchTermLower) ||
        reservation.description.toLowerCase().includes(searchTermLower) ||
        reservation.reservationDate.toString().toLowerCase().includes(searchTermLower) ||
        reservation.heureDebut.toString().toLowerCase().includes(searchTermLower) ||
        reservation.heureFin.toString().toLowerCase().includes(searchTermLower)
      );
    }
  }




  searchTerm: string = '';






  onDelete(reservationId: number): void {
    this.reservationService.deleteReservation(reservationId).subscribe(
      (response) => {
        console.log("Reservation deleted successfully:", response);
        // Actualiser la liste des places après la suppression
        this.getreservations();
      },
      (error) => {
        console.error("Error deleting reservation:", error);
      }
    );
  }

  onUpdate(reservationId: number): void {
    this.router.navigate(['/updatereservation', reservationId]);
  }

  onAdd(): void {
    this.router.navigate(['/addreservation']);
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

}