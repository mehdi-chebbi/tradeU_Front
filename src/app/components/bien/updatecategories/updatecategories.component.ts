import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BienserviceService } from 'src/app/service/bienservice.service';
import { JwtService } from 'src/app/service/jwt.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-updatecategories',
  templateUrl: './updatecategories.component.html',
  styleUrls: ['./updatecategories.component.scss']
})
export class UpdatecategoriesComponent implements OnInit{
   updateCategorieForm!: FormGroup;

  id!:number
  constructor(private act : ActivatedRoute, private service: BienserviceService,
    private fb: FormBuilder,private router: Router  , private notificationService: NotificationService ,private jwtService:JwtService){}

    ngOnInit() {
      this.id = this.act.snapshot.params['id'];
    
      this.updateCategorieForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required], // Le champ devrait être nommé "description" plutôt que "discription"
      });
    
      // Appeler le service pour récupérer les détails du categorie à partir de son ID
      this.service.getcategorieById(this.id).subscribe(
        (categorie: any) => {
          // Mettre à jour les champs du formulaire avec les données récupérées
          this.updateCategorieForm.patchValue({
            name: categorie.name,
            description: categorie.description, // Utiliser le nom de champ correct
          });
        },
        (error: any) => {
          console.error('Une erreur s\'est produite lors de la récupération des détails du categorie : ', error);
          // Afficher un message d'erreur ou gérer l'erreur ici si nécessaire
        }
      );
    }
    
    

    submitForm() {
      if (this.updateCategorieForm.valid) {
        const categorieData = {
          name: this.updateCategorieForm.get('name')!.value,
          description: this.updateCategorieForm.get('description')!.value
        };
    
        this.service.updatecategorie(this.id, categorieData).subscribe(
          (data: any) => {
            console.log(data);

            this.notificationService.showNotification('Votre categorie est modifier.');
            this.router.navigate(['/retrivecategories'])
            // Rediriger ou afficher un message de succès ici si nécessaire
          },
          (error: any) => {
            console.error('Une erreur s\'est produite lors de la mise à jour de la catégorie : ', error);
            // Afficher un message d'erreur ou gérer l'erreur ici si nécessaire
          }
        );
      } else {
        console.error('Formulaire invalide');
        // Afficher un message d'erreur ou gérer le formulaire invalide ici si nécessaire
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

