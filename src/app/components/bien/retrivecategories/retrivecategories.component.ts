import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BienserviceService } from 'src/app/service/bienservice.service';
import { JwtService } from 'src/app/service/jwt.service';

@Component({
  selector: 'app-retrivecategories',
  templateUrl: './retrivecategories.component.html',
  styleUrls: ['./retrivecategories.component.scss']
})
export class RetrivecategoriesComponent implements OnInit {

  categories: any[] = []; // Ajout de la liste des catégories
  biens: any[] = [];
  idCategorieSelectionnee: number = -1; // Pour stocker l'ID de la catégorie sélectionnée
  BASE_URL: string = 'http://localhost:8083/';

  constructor(private service: BienserviceService, private http: HttpClient ,private jwtService: JwtService ,
    private router: Router) { }

  ngOnInit(): void {
    this.service.getCategories().subscribe(
      (data: any[]) => {
        this.categories = data; // Assigner les catégories récupérées
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des catégories: ', error);
      }
    );
  }

  afficherBiensParCategorie(idCategorie: number): void {
    this.idCategorieSelectionnee = idCategorie; // Stocker l'ID de la catégorie sélectionnée
    this.service.getBiensParCategorie(idCategorie).subscribe(
      (data: any[]) => {
        this.biens = data; // Assigner les biens récupérés
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des biens de la catégorie: ', error);
      }
    );
  }
  deletecategorie(id: number): void {
    const token = localStorage.getItem('jwt');
  
    if (token) {
      this.service.deletecategorie(id).subscribe(
        (data: any) => {
          console.log(data);
       window.
          alert('categorie supprimé avec succès.');
          window.location.reload();
        },
        (error: any) => {
          console.error('Une erreur s\'est produite lors de la suppression du categorie: ', error);
          alert('Une erreur s\'est produite lors de la suppression du bien. Veuillez réessayer.');
        }
      );
    } else {
      console.error('Token not found');
      alert('Token not found');
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
