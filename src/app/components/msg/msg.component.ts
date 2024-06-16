import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importer FormBuilder et Validators
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';

@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.scss']
})
export class MsgComponent implements OnInit {
  formGroup!: FormGroup; // Déclarer une variable pour stocker le formulaire
 
  constructor (     private router: Router, // Injecter le service Router
  private formBuilder: FormBuilder, private service: JwtService) {}

  ngOnInit(): void {
    // Créer le formulaire avec FormBuilder et définir les validateurs pour l'email
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]] // Définir les validateurs pour l'email
    });
  }

  sendVerificationCode(): void {
    // Vérifier si le formulaire est valide avant d'envoyer la demande
    if (this.formGroup.valid) {
      const email = this.formGroup.get('email')?.value; // Récupérer la valeur de l'email à partir du formulaire
      this.service.sendVerificationCode(email).subscribe(
        (response) => {
          console.log(response); // Afficher la réponse du backend
          if (response === "Code de vérification envoyé avec succès.") {
            this.router.navigateByUrl('/resetpassword');
          }
        },
        (error) => {
          console.error(error); // Afficher les erreurs éventuelles
          // Vous pouvez ajouter ici la logique pour afficher un message d'erreur à l'utilisateur
        }
      );
    }
  }
}
