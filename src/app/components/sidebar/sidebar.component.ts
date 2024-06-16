import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  
  constructor(private jwtService: JwtService ,
    private router: Router

  ) { }

  
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
          localStorage.removeItem('submittedFeedbackKey');
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
