import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  constructor(private jwtService: JwtService ,
    private router: Router

  ) { }
  users: any[] = [];
  ngOnInit(): void {
    this.retrieveusers();
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

retrieveusers(): void {
    this.jwtService.retrieveusers().subscribe(
      (data: any) => {
        console.log(data); // Vérifiez les données renvoyées dans la console
        this.users = data; // Attribuez les données à la variable biens
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des biens: ', error);
      }
    );
  }



  deleteUser(userId: number): void {
    this.jwtService.deleteUser(userId).subscribe(
      () => {
        // Rafraîchir la liste des utilisateurs après la suppression
        this.retrieveusers();
      },
      (error) => {
        console.error('Une erreur est survenue lors de la suppression de l\'utilisateur : ', error);
      }
    );
  }
  


  banuser(userId: number): void {
    // Appelez la méthode deleteUser du service pour supprimer l'utilisateur avec l'ID spécifié
    this.jwtService.banuser(userId).subscribe(
      () => {
        // Rafraîchissez la liste des utilisateurs après la suppression
        this.retrieveusers();
      },
      (error) => {
        console.error('Une erreur est survenue lors de la ban de l\'utilisateur : ', error);
      }
    );
  }





 unbanuser(userId: number): void {
    // Appelez la méthode deleteUser du service pour supprimer l'utilisateur avec l'ID spécifié
    this.jwtService.unbanuser(userId).subscribe(
      () => {
        // Rafraîchissez la liste des utilisateurs après la suppression
        this.retrieveusers();
      },
      (error) => {
        console.error('Une erreur est survenue lors de la ban de l\'utilisateur : ', error);
      }
    );
  }



}




  

