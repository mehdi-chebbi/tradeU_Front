import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaceService } from 'src/app/service/place.service';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {






  
  placeForm!: FormGroup;
  imageFile: File | undefined;

  constructor(
    private service: PlaceService,
    private fb: FormBuilder,
    private router: Router,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.placeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required]
    });
  }
  submitForm() {
    // Récupérer le nom de fichier de l'image sélectionnée depuis l'URL complète
    const imageUrl = this.placeForm.get('image')?.value;
    const fileName = imageUrl.split('\\').pop()?.split('/').pop(); // Extraire le nom de fichier
  
    // Créer l'URL complète avec le nom de fichier extrait
    const addRequest = {
      name: this.placeForm.get('name')?.value,
      description: this.placeForm.get('description')?.value,
      imageUrl: 'http://localhost/' + fileName // Concaténer avec la partie constante de l'URL
    };
  
    // Appeler la méthode addPlace() avec les données requises
    this.service.addPlace(addRequest).subscribe(
      (response: any) => {
        console.log(response);
        if (response != null) {
          console.log("Place added successfully");
          Swal.fire('Submitted!', 'Place added successfully', 'success');

          // Rediriger vers la page des places après l'ajout réussi
          this.router.navigate(['/getplaces']);

        }
      },
      (error: any) => {
        console.error("Error:", error);
        Swal.fire('error!', 'error adding place', 'error');

        // Afficher un message d'erreur sur le front-end si nécessaire
      }
    );
  }
  
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        // Ne rien faire ici, car nous n'avons pas besoin de lire les données du fichier
      };
      reader.readAsDataURL(file); // Lire le fichier comme une URL de données
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
  }}