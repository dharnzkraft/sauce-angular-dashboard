import { Component } from '@angular/core';
import { EcommerceMetricsComponent } from '../../../shared/components/ecommerce/ecommerce-metrics/ecommerce-metrics.component';
import { MonthlySalesChartComponent } from '../../../shared/components/ecommerce/monthly-sales-chart/monthly-sales-chart.component';
import { MonthlyTargetComponent } from '../../../shared/components/ecommerce/monthly-target/monthly-target.component';
import { StatisticsChartComponent } from '../../../shared/components/ecommerce/statics-chart/statics-chart.component';
import { DemographicCardComponent } from '../../../shared/components/ecommerce/demographic-card/demographic-card.component';
import { RecentOrdersComponent } from '../../../shared/components/ecommerce/recent-orders/recent-orders.component';
import { FirestoreService } from '../../../core/services/firestoreService';

@Component({
  selector: 'app-ecommerce',
  imports: [
    EcommerceMetricsComponent,
    MonthlySalesChartComponent,
    MonthlyTargetComponent,
    StatisticsChartComponent,
    DemographicCardComponent,
    RecentOrdersComponent,
  ],
  templateUrl: './ecommerce.component.html',
})
export class EcommerceComponent {
  allUsers: any[] | undefined;
  totalOrders: any[] | undefined;
  totalRiders: any[] | undefined;
  totalSellers: any[] | undefined;
  constructor(
      private fireService: FirestoreService
    ) {
      this.fireService.getCollection('users').subscribe(data => {
        // console.log('Users data:', data);
        this.allUsers = data;
      });
  
      this.fireService.getCollection('orders').subscribe(data => {
        // console.log('Orders data:', data);
        this.totalOrders = data;
      });
  
      this.fireService.getCollection('orders').subscribe(data => {
        // console.log('Orders data:', data);
        this.totalOrders = data;
      });
  
      this.fireService.getCollection('riders').subscribe(data => {
        // console.log('Riders data:', data);
        this.totalRiders = data;
      });
  
      this.fireService.getCollection('sellers').subscribe(data => {
        // console.log('Riders data:', data);
        this.totalSellers = data;
      });
    }
}
