import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from 'src/app/service/reservation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/service/jwt.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-updatereservation',
  templateUrl: './updatereservation.component.html',
  styleUrls: ['./updatereservation.component.scss']
})
export class UpdatereservationComponent implements OnInit{
  reservationId: number = 0;
  reservation: any = {};
  updateForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    private jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reservationId = +params['id'];
      this.getReservationDetails(this.reservationId);
    });

    this.updateForm = this.formBuilder.group({
      reservationDate: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  getReservationDetails(reservationId: number): void {
    this.reservationService.getReservationById(reservationId).subscribe(
      (data: any) => {
        this.reservation = data;
        console.log("Reservation details:", this.reservation); // Vérifier les détails de la réservation dans la console
        this.updateForm.patchValue({
          reservationDate: this.reservation.reservationDate,
          heureDebut: this.reservation.heureDebut,
          heureFin: this.reservation.heureFin,
          description: this.reservation.description
        });
      },
      (error: any) => {
        console.error('Error retrieving reservation details:', error);
      }
    );
  }
  

  
  onSubmit(): void {
    if (this.updateForm.valid) {
      // Récupérez les nouvelles valeurs du formulaire
      const reservationDateControl = this.updateForm.controls['reservationDate'];
      const heureDebutControl = this.updateForm.controls['heureDebut'];
      const heureFinControl = this.updateForm.controls['heureFin'];
      const descriptionControl = this.updateForm.controls['description'];
  
      // Vérifiez si les contrôles de formulaire sont définis et non null
      if (reservationDateControl && heureDebutControl && heureFinControl && descriptionControl) {
        const newReservationDate = reservationDateControl.value;
        const newHeureDebut = heureDebutControl.value;
        const newHeureFin = heureFinControl.value;
        const newDescription = descriptionControl.value;
  
        // Ajoutez des journaux pour afficher les données avant la mise à jour
        console.log("Données soumises pour la mise à jour :", { reservationDate: newReservationDate, heureDebut: newHeureDebut, heureFin: newHeureFin, description: newDescription });
  
        // Appelez updateReservation avec les nouvelles valeurs
        this.reservationService.updateReservation(this.reservationId, { reservationDate: newReservationDate, heureDebut: newHeureDebut, heureFin: newHeureFin, description: newDescription }).subscribe(
          (response: any) => {
            console.log("Reservation updated successfully:", response);
            Swal.fire('Updated!', 'Reservation updated successfully.', 'success');

            this.router.navigate(['/getreservations']);
          },
          (error: any) => {
            console.error("Error updating reservation:", error);
            Swal.fire('Error!', 'Error updating reservation.', 'error');

          }
        );
      } else {
        console.error("Form controls are null or undefined.");
      }
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
