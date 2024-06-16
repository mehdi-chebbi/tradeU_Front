import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  updateForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private jwtService: JwtService , private router: Router) { }

  ngOnInit(): void {
    // Récupérer les valeurs depuis le local storage
    const storedName = localStorage.getItem('name');
    const storedAddress = localStorage.getItem('adress');
    const storedPhone = localStorage.getItem('phone');

    // Initialiser le formulaire avec les valeurs récupérées, ou une chaîne vide si elles n'existent pas
    this.updateForm = this.formBuilder.group({
      name: [storedName || '', [Validators.required, Validators.minLength(3)]],
      adress: [storedAddress || '', Validators.required],
      phone: [storedPhone || '', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });




  }

  submitForm(): void {
    if (this.updateForm.valid) {
      const { name, adress, phone } = this.updateForm.value;
      const updateRequest = { name, adress, phone };

      this.jwtService.updateProfile(updateRequest).subscribe(
        (response) => {
          console.log(response);

          // Mettre à jour les valeurs dans le local storage
          localStorage.setItem('name', name);
          localStorage.setItem('adress', adress);
          localStorage.setItem('phone', phone);
          Swal.fire(
            'Updated!',
            'The Porfile has been updated successfully.',
            'success'
          );

          setTimeout(() => {
            this.router.navigate(['/homePage']); // Replace '/desired-route' with the actual route
          }, 2000);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
