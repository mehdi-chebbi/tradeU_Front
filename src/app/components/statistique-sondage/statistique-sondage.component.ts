import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SondageService } from 'src/app/service/sondageservice.service';
import { JwtService } from 'src/app/service/jwt.service';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-statistique-sondage',
  templateUrl: './statistique-sondage.component.html',
  styleUrls: ['./statistique-sondage.component.scss']
})
export class StatistiqueSondageComponent implements OnInit {
  totalUsers: number = 0; // Total number of users
  participationRates: number[] = [];
  sondageTitles: string[] = [];

  constructor(private sondageService: SondageService, private jwtService: JwtService) { }

  ngOnInit(): void {
    // Fetch user data
    this.jwtService.retrieveusers().subscribe(users => {
      // Update totalUsers with the number of users
      this.totalUsers = users.length;

      // Fetch sondage data from the service
      this.sondageService.fetchSAllSondages().subscribe((sondages: any[]) => {
        // Process sondage data and draw pie chart
        const activeSondages = sondages.filter(sondage => sondage.active).length;
        const inactiveSondages = sondages.length - activeSondages;

        // Call function to draw pie chart with active and inactive counts
        this.drawPieChart(activeSondages, inactiveSondages);

        // Calculate participation rate for each sondage
        sondages.forEach(sondage => {
          this.calculateParticipationRate(sondage.idSondage, sondage.title);
        });
      });
    });
  }

  calculateParticipationRate(sondageId: number, sondageTitle: string): void {
    this.sondageService.getParticipantsBySondage(sondageId).pipe(
      map(participants => {
        // Calculate participation rate
        const participationRate = (participants.length / this.totalUsers) * 100;
        // Push the participation rate and sondage title into arrays
        this.participationRates.push(participationRate);
        this.sondageTitles.push(sondageTitle);
      }),
      finalize(() => {
        // If all participation rates are calculated, draw the bar chart
        if (this.participationRates.length === this.sondageTitles.length) {
          this.drawBarChart(this.sondageTitles, this.participationRates);
        }
      })
    ).subscribe();
  }

  drawPieChart(activeSondages: number, inactiveSondages: number): void {
    // Draw pie chart
    const ctxPie = document.getElementById('pieChart') as HTMLCanvasElement;
    new Chart(ctxPie, {
      type: 'pie',
      data: {
        labels: ['Active Polls', 'Inactive Polls'],
        datasets: [{
          label: 'Sondages',
          data: [activeSondages, inactiveSondages],
          backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  drawBarChart(sondageTitles: string[], participationRates: number[]): void {
    // Draw bar chart
    const ctxBar = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: sondageTitles,
        datasets: [{
          label: 'Participation Rate (%)',
          data: participationRates,
          backgroundColor: 'rgb(255, 159, 64)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100 // Set maximum y-axis value to 100

          }
        }
      }
    });
  }
}
