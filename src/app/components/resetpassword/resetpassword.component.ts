import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup; // Déclarer une propriété de formulaire de type FormGroup

  constructor(private formBuilder: FormBuilder ,    private service: JwtService, private router: Router
  ) {} // Injecter le service FormBuilder dans le constructeur

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({ // Initialiser le formulaire avec FormBuilder
      email: ['', [Validators.required, Validators.email]], // Ajouter des validateurs pour l'email
      code: ['', Validators.required], // Ajouter un validateur pour le code
      newPassword: ['', Validators.required] // Ajouter un validateur pour le nouveau mot de passe
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) { // Vérifier si le formulaire est valide avant de soumettre
      const resetRequest = this.resetForm.value; // Récupérer les valeurs du formulaire
      this.service.resetpassword(resetRequest).subscribe(
        (response) => {
          console.log(response);
          


          this.router.navigateByUrl('/login');
   
          
          
          // Afficher la réponse du backend
          // Rediriger vers une autre page ou afficher un message de succès
        },
        (error) => {
          console.error(error); // Afficher les erreurs éventuelles
          // Afficher un message d'erreur à l'utilisateur
        }
      );
    }
  }
}