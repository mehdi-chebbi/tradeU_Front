import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/service/jwt.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private service: JwtService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]], // Minimum 3 caractères pour le nom
      password: ['', [Validators.required, Validators.minLength(5)]], // Minimum 5 caractères pour le mot de passe
      phone: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]], // Seulement des chiffres pour le numéro de téléphone
      adress: ['', [Validators.required]],
      role: ['USER', [Validators.required]], // Initialise le rôle à USER par défaut
    });
  }
  errorMessage: string = ''; // Déclaration de la propriété errorMessage

  emailExistsAlert: boolean = false;
  submitForm() {
    if (this.registerForm.valid) {
      this.service.register(this.registerForm.value).subscribe(
        (response) => {
          console.log(response);
          if (response && response.statusCode === 400) {
            swal.fire({
              title: 'Email already exists!',
              text: 'Email already exists',
              icon: 'error',
              confirmButtonText: 'OK'
            }); // Afficher le message d'erreur dans l'alerte
          } else {
            swal.fire({
              title: 'Sucess!',
              text: 'Logged In',
              icon: 'success',
              confirmButtonText: 'OK'
            }) // Afficher une alerte pour l'inscription réussie
          }
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

}
