import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { ForumService } from './service/forum.service';
import { QuestionserviceService } from './service/questionservice.service';
import { SondageService } from './service/sondageservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  


  
  title = 'TradeU';
  constructor(private router: Router, private services: ForumService) {}

  showNavBar(): string {
    const role = localStorage.getItem('role');
    // Check if the role is truthy and if it equals 'ADMIN' (case-insensitive)
    if (!!role && role.toUpperCase() === 'ADMIN') {
        return 'ADMIN';
    } else if (!!role && role.toUpperCase() === 'USER') {
        return 'USER';
    } else {
        return 'NULL';
    }
}



  

}
