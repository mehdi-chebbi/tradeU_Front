import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';
import { ReservationService } from 'src/app/service/reservation.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  reservationForm!: FormGroup;
  places: any[] = [];

  constructor(
    private service: ReservationService,
    private fb: FormBuilder,
    private router: Router,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getPlaces();
  }

  initForm(): void {
    this.reservationForm = this.fb.group({
      reservationDate: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      description: ['', Validators.required],
      selectedPlace: ['', Validators.required] // Ajout d'un contrôle pour la sélection de la place
    });
  }

  getPlaces(): void {
    this.service.getAllPlaces().subscribe(
      (response: any) => {
        this.places = response; // Stockez les places récupérées dans la variable places
      },
      (error: any) => {
        console.error("Error fetching places:", error);
        // Gérez les erreurs si nécessaire
      }
    );
  }


  submitForm(): void {
    if (this.reservationForm.valid) {
      const reservationDate = this.reservationForm.get('reservationDate')?.value;
      const heureDebut = this.reservationForm.get('heureDebut')?.value;
      const heureFin = this.reservationForm.get('heureFin')?.value;
      const description = this.reservationForm.get('description')?.value;
      const selectedPlaceId = this.reservationForm.get('selectedPlace')?.value; // Utilisez 'selectedPlace' pour obtenir l'ID de la place
      // Construisez l'objet de la requête de réservation
      const reservationRequest = {
        reservationDate,
        heureDebut,
        heureFin,
        description
      };

      // Appelez le service pour ajouter la réservation avec l'ID de la place
      this.service.addReservation(selectedPlaceId, reservationRequest).subscribe(
        (response: any) => {
          console.log(response);
          if (response != null) {
            console.log("Reservation added successfully");
            Swal.fire('Submitted!', 'Reservation added successfully.', 'success');

            this.router.navigate(['/getreservations']);
          }
        },
        (error) => {
          console.error("Error:", error);
          
          // Show SweetAlert2 alert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Place reserved" // Assuming 'error' is an Error object and you want to show its message
          });
        }

      );
    } else {
      console.error("Form is invalid.");
    }
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