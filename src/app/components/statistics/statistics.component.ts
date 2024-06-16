import { StatisticsService } from 'src/app/service/statistics/statistics.service'; // Assuming your service file is named statistics.service.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { Commande } from 'src/app/Model/commande';
Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  commandes!: Commande[];
  topSpendingUsers: any[] = [];
  limit = 10; 
  couponStatistics: any;
  activeCoupons!: number;
  redeemedCoupons!: number;
  totalRevenueData!: { [key: string]: number };

  @ViewChild('pieChart') pieChart!: ElementRef;
  @ViewChild('barChart') barChart!: ElementRef;


  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    this.loadTotalRevenueData();
    this.fetchCouponStatistics();

  }
  fetchCouponStatistics(): void {
    this.statisticsService.getCouponStatistics().subscribe(
      (data: any) => {
        this.couponStatistics = data;
        this.processCouponStatistics();
      },
      (error) => {
        console.error('Error fetching coupon statistics:', error);
      }
    );
  }

  processCouponStatistics(): void {
    this.activeCoupons = this.couponStatistics.active;
    this.redeemedCoupons = this.couponStatistics.redeemed;
    this.createPieChart();
  }
  createBarChart() {
    const labels = Object.keys(this.totalRevenueData);
    const data = Object.values(this.totalRevenueData);
  
    const ctx = this.barChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Revenue',
          data: data,
          backgroundColor: 'rgba(255, 255, 0, 0.5)', // Yellow color
          borderColor: 'rgba(255, 0, 0, 1)', // Red color
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  createPieChart(): void {
    const pieChartCtx = this.pieChart.nativeElement.getContext('2d');
    new Chart(pieChartCtx, {
      type: 'pie',
      data: {
        labels: ['Active Coupons', 'Redeemed Coupons'],
        datasets: [{
          data: [this.activeCoupons, this.redeemedCoupons],
          backgroundColor: [
            'rgba(255, 255, 0, 0.5)', // Yellow color
            'rgba(255, 0, 0, 0.5)' // Red color
          ],
          borderColor: ['rgb(255, 255, 0)', 'rgb(255, 0, 0)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 10,
              }
            }
          },
          title: {
            display: true,
            text: 'Coupon Statistics',
            font: {
              size: 10,
            }
          }
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.totalRevenueData) {
      this.createBarChart();
    }
  }

  loadTotalRevenueData() {
    this.statisticsService.getTotalRevenueByDay().subscribe(data => {
      this.totalRevenueData = data;
      if (this.barChart) {
        this.createBarChart();
      }
    });
  }

  
}