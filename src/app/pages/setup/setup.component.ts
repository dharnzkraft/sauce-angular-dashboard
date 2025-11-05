import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { FirestoreService } from '../../core/services/firestoreService';
import { LoadingService } from '../../core/services/loadingService';
import { ModalComponent } from "../../shared/components/ui/modal/modal.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css'],
  imports: [PageBreadcrumbComponent, ModalComponent, CommonModule, FormsModule]
})
export class SetupComponent {
  isOpen:boolean=false;
  amount: any;
  serviceCharge: any[] | undefined;
  deliveryCharge: any[] | undefined;
  deliveryAmount: any;
  constructor(
    private fireservice: FirestoreService,
    private loading: LoadingService
  ) { 
this.getServiceCharge();
  }

  getServiceCharge(){
    this.fireservice.getCollection('serviceCharge').subscribe(data=>{
      console.log('Service Charge Data:', data);
      this.serviceCharge = data;
    });

    this.fireservice.getCollection('perDelivery').subscribe(data=>{
      console.log('Delivery Charge Data:', data);
      this.deliveryCharge = data;
    });
  }

  updateServiceCharge(){
    this.loading.show();
    this.fireservice.updateDocument('serviceCharge', this.serviceCharge![0].id, {amount: this.amount}).then(()=>{
      
      this.closeModal();
      this.getServiceCharge();
      this.loading.hide();
    });
  }

  updateDeliveryCharge(){
    this.loading.show();
    this.fireservice.updateDocument('perDelivery', this.deliveryCharge![0].id, {amount: this.deliveryAmount}).then(()=>{
      
      this.closeModal();
      this.getServiceCharge();
      this.loading.hide();
    });
  }

  openEditModal(){
    this.isOpen=true;
  }

  closeModal(){
    this.isOpen=false;
  }
}
