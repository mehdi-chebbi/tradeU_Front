import { Component, OnInit } from '@angular/core';
import { BienserviceService } from 'src/app/service/bienservice.service';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';
import {ForumService} from "../../../service/forum.service";

@Component({
  selector: 'app-retrivebien',
  templateUrl: './retrivebien.component.html',
  styleUrls: ['./retrivebien.component.scss']
})
export class RetrivebienComponent implements OnInit {
  biens: any[] = []; // Ajout de l'initialisation
  BASE_URL: string = 'http://localhost:8083/';

  constructor(private service: BienserviceService, private http: HttpClient,private jwtService: JwtService,
    private router: Router, private forumservice:ForumService) { }
  currentUserId!:any
  ngOnInit(): void {
    this.retrieveBiens();
    this.forumservice.getCurrentUser().subscribe((data)=>{
      this.currentUserId=data
    })
console.log(this.biens)
  }

  triChanged(event: Event): void {
    const critere = (event.target as HTMLSelectElement).value;
    switch (critere) {
      case 'prixCroissant':
        this.biens = this.service.trierParPrixCroissant(this.biens);
        break;
      case 'prixDecroissant':
        this.biens = this.service.trierParPrixDecroissant(this.biens);
        break;
      case 'dateAjoutCroissante':
        this.biens = this.service.trierParDateAjoutCroissante(this.biens);
        break;
      case 'dateAjoutDecroissante':
        this.biens = this.service.trierParDateAjoutDecroissante(this.biens);
        break;
      default:
        break;
    }
  }

  retrieveBiens(): void {
    this.service.retrievebiens().subscribe(
      (data: any) => {
        console.log(data); // Vérifiez les données renvoyées dans la console
        this.biens = data; // Attribuez les données à la variable biens
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des biens: ', error);
      }
    );
  }


  deleteBien(id: number): void {
    const token = localStorage.getItem('jwt');

    if (token) {
      this.service.deleteBien(id).subscribe(
        (data: any) => {
          console.log(data);
          this.retrieveBiens();
          alert('Bien supprimé avec succès.');
        },
        (error: any) => {
          console.error('Une erreur s\'est produite lors de la suppression du bien: ', error);
          alert('Une erreur s\'est produite lors de la suppression du bien. Veuillez réessayer.');
        }
      );
    } else {
      console.error('Token not found');
      alert('Token not found');
    }
  }
  isOwner(bien: any): boolean {
    const token = localStorage.getItem('jwt');
    let userId = '';

    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1].replace(/_/g, '/').replace(/-/g, '+')));
      userId = tokenPayload.sub;
    }

    return bien.user && userId === bien.user.id;
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





