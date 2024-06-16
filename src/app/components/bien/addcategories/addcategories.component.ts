import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BienserviceService } from 'src/app/service/bienservice.service';
import { JwtService } from 'src/app/service/jwt.service';

@Component({
  selector: 'app-addcategories',
  templateUrl: './addcategories.component.html',
  styleUrls: ['./addcategories.component.scss']
})
export class AddcategoriesComponent implements OnInit  {

  addcategorieForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private service: BienserviceService,private router: Router  , private jwtService: JwtService
  ) {
    this.addcategorieForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  ngOnInit(): void   { }
  submitForm(): void {
    if (this.addcategorieForm.valid) {
      const categorie = this.addcategorieForm.value;
      this.service.addCategorie(categorie).subscribe(
        (data: any) => {
          // Gérer la réponse réussie, par exemple, afficher un message de succès ou rediriger vers une autre page
          console.log('Categorie ajoutée avec succès:', data);
          this.router.navigate(['/retrivecategories']);
        },
        (error: any) => {
          console.error('Une erreur s\'est produite lors de l\'ajout de la catégorie:', error);
        }
      );
    } else {
      console.error('Le formulaire n\'est pas valide');
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