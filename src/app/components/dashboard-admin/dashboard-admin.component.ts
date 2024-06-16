import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {
  isExpanded: boolean = true;

  constructor(
    private jwtService: JwtService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Add any initialization logic here
  }

  logout(): void {
    const token = localStorage.getItem('jwt'); // Retrieve the JWT token from localStorage
    if (token) {
      this.jwtService.logout(token).subscribe(
        (response) => {
          console.log(response); // Display the backend response
          // Add your logic for redirection or handling after logout here
          localStorage.removeItem('jwt'); // Remove the JWT token from localStorage
          localStorage.removeItem('name');
          localStorage.removeItem('phone');
          localStorage.removeItem('adress');
          localStorage.removeItem('role');
          this.router.navigateByUrl('/login');
        },
        (error) => {
          console.error(error); // Display any potential errors
          // Add your logic to handle logout errors here
        }
      );
    } else {
      console.warn("No JWT token found in localStorage.");
      // Add your logic to handle the absence of JWT token in localStorage here
    }
  }
}