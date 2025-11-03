import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { ReusableTableComponent, TableAction, TableColumn } from "../../shared/my-table/my-table.component";
import { FirestoreService } from '../../core/services/firestoreService';
import { LoadingService } from '../../core/services/loadingService';

@Component({
  selector: 'app-riders',
  templateUrl: './riders.component.html',
  styleUrls: ['./riders.component.css'],
  imports: [PageBreadcrumbComponent, ReusableTableComponent]
})
export class RidersComponent {


    allUsers: any[] | undefined;
      public userState: "viewAllUsers" | "viewUserDetails" = "viewAllUsers";
      selectedUser: any;
    
      constructor(
        private fireService: FirestoreService,
        private loading: LoadingService
      ) {
        this.fireService.getCollection('riders').subscribe(data => {
            // console.log('Users data:', data);
            this.allUsers = data;
          });
       }
    
      columns: TableColumn[] = [
        { key: 'riderName', label: 'Names', sortable: true },
        { key: 'active', label: 'is Active', sortable: true },
        { key: 'earning', label: 'Earnings', sortable: true },
        { key: 'riderEmail', label: 'Email', sortable: true },
        { key: 'phoneNumber', label: 'Phone Number', sortable: false },
        { key: 'status', label: 'is Approved', sortable: false },
      ];
    
        tableActions: TableAction[] = [
        {
          label: 'View More',
          callback: (item) => this.viewItem(item)
        },
        // {
        //   label: 'Edit',
        //   callback: (item) => this.editItem(item)
        // },
        // {
        //   label: 'Delete',
        //   callback: (item) => this.deleteItem(item)
        // }
      ];
  
  
      getSellers(): void {
        this.fireService.getCollection('riders').subscribe(data => {
          // console.log('Users data:', data);
          this.allUsers = data;
        });
      }
    
      viewItem(item: any): void {
        this.userState = "viewUserDetails";
        console.log('View item:', item);
        this.selectedUser = item
        // alert(`Viewing: ${item.action}`);
      }
    
      editItem(item: any): void {
        console.log('Edit item:', item);
        alert(`Editing: ${item.action}`);
      }
    
      // deleteItem(item: any): void {
      //   console.log('Delete item:', item);
      //   if (confirm(`Are you sure you want to delete ${item.action}?`)) {
      //     this.allUsers = this.allUsers.filter(d => d.id !== item.id);
      //   }
      // }
    
      onPageChange(page: number): void {
        console.log('Current page:', page);
      }
    
      getStatusClass(status: string): string {
        const statusClasses: { [key: string]: string } = {
          'Paid': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
      }
    
      blockUser(user: any): void {
        console.log('Block user:', user);
        this.loading.show();
        this.fireService.updateDocument('riders', user, { active: false }).then(() => {
          // alert(`User ${user.userName} has been blocked.`);
          this.getSellers();
          // Optionally, refresh the user list or update the UI accordingly
          this.loading.hide();
        }).catch(error => {
          this.loading.hide();
          console.error('Error blocking user:', error);
          alert('An error occurred while blocking the user.');
        }); 
      }
    
      unblockUser(user: any): void {
        console.log('Unblock user:', user);
        this.loading.show();
        this.fireService.updateDocument('riders', user, { active: false }).then(() => {
          // alert(`User ${user.userName} has been unblocked.`);
          this.getSellers();
          this.loading.hide();
          // Optionally, refresh the user list or update the UI accordingly
        }).catch(error => {
          this.loading.hide();
          console.error('Error unblocking user:', error);
          alert('An error occurred while unblocking the user.');
        });
      }
  
      approveSeller(user: any): void {
        console.log('Approve seller:', user);
        this.loading.show();
        this.fireService.updateDocument('riders', user, { status: "approved" }).then(() => {
          // alert(`Seller ${user.sellerName} has been approved.`);
          this.getSellers();
          this.loading.hide();
          // Optionally, refresh the seller list or update the UI accordingly
        }).catch(error => {
          this.loading.hide();
          console.error('Error approving seller:', error);
          alert('An error occurred while approving the seller.');
        });
      }
  
      disapproveSeller(user: any): void {
        console.log('Disapprove seller:', user);
        this.loading.show();
        this.fireService.updateDocument('riders', user, { status: "disapproved" }).then(() => {
          // alert(`Seller ${user.sellerName} has been disapproved.`);
          this.getSellers();
          this.loading.hide();
          // Optionally, refresh the seller list or update the UI accordingly
        }).catch(error => {
          this.loading.hide();
          console.error('Error disapproving seller:', error);
          alert('An error occurred while disapproving the seller.');
        });
      }
    
}
