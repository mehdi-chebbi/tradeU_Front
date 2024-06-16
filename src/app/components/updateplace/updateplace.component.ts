import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceService } from 'src/app/service/place.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/service/jwt.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-updateplace',
  templateUrl: './updateplace.component.html',
  styleUrls: ['./updateplace.component.scss']
})
export class UpdatePlaceComponent implements OnInit {
  placeId: number = 0;
  place: any = {};
  updateForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService,
    private formBuilder: FormBuilder,
    private jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.placeId = +params['id'];
      this.getPlaceDetails(this.placeId);
    });

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  getPlaceDetails(placeId: number): void {
    this.placeService.getPlaceById(placeId).subscribe(
      (data: any) => {
        this.place = data;
        this.updateForm.patchValue({
          name: this.place.name,
          description: this.place.description
        });
      },
      (error: any) => {
        console.error('Error retrieving place details:', error);
      }
    );
  }

  
  onSubmit(): void {
    if (this.updateForm.valid) {
      // Récupérez les nouvelles valeurs du formulaire
      const nameControl = this.updateForm.get('name');
      const descriptionControl = this.updateForm.get('description');
  
      // Vérifiez si les contrôles de formulaire sont définis et non null
      if (nameControl && descriptionControl) {
        const newName = nameControl.value;
        const newDescription = descriptionControl.value;
  
        // Ajoutez des journaux pour afficher les données avant la mise à jour
        console.log("Données soumises pour la mise à jour :", { name: newName, description: newDescription });
  
        // Appelez updatePlace avec les nouvelles valeurs
        this.placeService.updatePlace(this.placeId, newName, newDescription).subscribe(
          (response: any) => {
            console.log("Place updated successfully:", response);
            Swal.fire('Updated!', 'Place updated successfully.', 'success');

            this.router.navigate(['/getplaces']);
          },
          (error: any) => {
            console.error("Error updating place:", error);
            Swal.fire('Error!', 'Error updating Place.', 'error');

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
