import { Component, OnInit } from '@angular/core';
import { PlaceService } from 'src/app/service/place.service';
import { Router } from '@angular/router'; 
import { JwtService } from 'src/app/service/jwt.service';

@Component({
  selector: 'app-getplaces',
  templateUrl: './getplaces.component.html', 
  styleUrls: ['./getplaces.component.scss']
})
export class GetplacesComponent implements OnInit {

  places: any[] = [];

  constructor(private placeService: PlaceService, private router: Router,private jwtService: JwtService) { }

  ngOnInit(): void {
    this.getplaces();
  }

  getplaces(): void {
    this.placeService.getPlaces().subscribe(
      (data: any) => {
        console.log(data);
        this.places = data;
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des places: ', error);
      }
    );
  }

  onDelete(placeId: number): void {
    this.placeService.deletePlace(placeId).subscribe(
      (response) => {
        console.log("Place deleted successfully:", response);
        // Actualiser la liste des places après la suppression
        this.getplaces();
      },
      (error) => {
        console.error("Error deleting place:", error);
      }
    );
  }

  onUpdate(placeId: number): void {
    this.router.navigate(['/updateplace', placeId]);
  }

  onAdd(): void {
    this.router.navigate(['/addplace']);
  }

  onSort(): void {
    this.placeService.triPlaces().subscribe(
      (data: any) => {
        console.log("Places sorted:", data);
        this.places = data;
      },
      (error: any) => {
        console.error("Error sorting places:", error);
      }
    );
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
