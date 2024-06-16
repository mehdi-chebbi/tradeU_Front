import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup ;

  constructor(
    private service: JwtService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    })
  }errorMessage: string = '';

  submitForm() {
    this.service.login(this.loginForm.value).subscribe(
      (response) => {
        console.log(response);
        if (response && response.token != null) {
          console.log("Login successful. Token:", response.token);
          localStorage.setItem('jwt', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('name', response.name);
          localStorage.setItem('phone', response.phone);
          localStorage.setItem('adress', response.adress);

          // Vérifier le rôle de l'utilisateur
          if (response.role === 'ADMIN') {
            this.router.navigateByUrl('/dashboard');
            console.log("Bonjour Admin!");
          } else if (response.role === 'USER') {
            console.log("Bonjour User!");
            this.router.navigateByUrl('homePage');
          } else {
            console.log("Bonjour!");
          }}
          else {
            console.log("Login failed. Response:", response);
            if (response && response.message) {
              this.errorMessage =  JSON.stringify(response.message);
            } else if (response && response.error) {
              this.errorMessage =  JSON.stringify(response.error);
            } else {
              this.errorMessage = "Unknown error occurred.";
            }
          }}

      ,
      (error: any) => {
        console.error("Login failed. Response:", error);
        console.log("Message d'erreur du serveur: ", error.message);
        if (error && error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = "An error occurred.";
        }
      }
    );
  }

  }
