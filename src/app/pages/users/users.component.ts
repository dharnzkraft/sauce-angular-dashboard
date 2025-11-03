import { Component } from '@angular/core';
import { TableAction, TableColumn, ReusableTableComponent } from '../../shared/my-table/my-table.component';
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { FirestoreService } from '../../core/services/firestoreService';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core/services/loadingService';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [ReusableTableComponent, PageBreadcrumbComponent, CommonModule]
})
export class UsersComponent {
  allUsers: any[] | undefined;
  public userState: "viewAllUsers" | "viewUserDetails" = "viewAllUsers";
  selectedUser: any;

  constructor(
    private fireService: FirestoreService,
    private loading: LoadingService
  ) {
    this.fireService.getCollection('users').subscribe(data => {
        // console.log('Users data:', data);
        this.allUsers = data;
      });
   }

  columns: TableColumn[] = [
    { key: 'userName', label: 'Names', sortable: true },
    { key: 'userEmail', label: 'Email', sortable: true },
    { key: 'phoneNumber', label: 'Phone Number', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
  ];

    tableActions: TableAction[] = [
    {
      label: 'View More',
      callback: (item) => this.viewItem(item)
    },
    {
      label: 'Edit',
      callback: (item) => this.editItem(item)
    },
    // {
    //   label: 'Delete',
    //   callback: (item) => this.deleteItem(item)
    // }
  ];


  getUsers(): void {
    this.fireService.getCollection('users').subscribe(data => {
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
    this.fireService.updateDocument('users', user, { status: 'Blocked' }).then(() => {
      // alert(`User ${user.userName} has been blocked.`);
      this.getUsers();
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
    this.fireService.updateDocument('users', user, { status: "approved" }).then(() => {
      // alert(`User ${user.userName} has been unblocked.`);
      this.getUsers();
      this.loading.hide();
      // Optionally, refresh the user list or update the UI accordingly
    }).catch(error => {
      this.loading.hide();
      console.error('Error unblocking user:', error);
      alert('An error occurred while unblocking the user.');
    });
  }

}
