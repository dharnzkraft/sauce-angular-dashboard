import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { DatePipe } from '@angular/common';
import { FirestoreService } from '../../core/services/firestoreService';
import { LoadingService } from '../../core/services/loadingService';
import { TabPanelComponent, TabComponent, Tab } from "../../shared/tab/tab.component";
import { ReusableTableComponent, TableAction } from "../../shared/my-table/my-table.component";
import { formatDateCustom } from '../../core/utils/date-format';
import { PaystackService, TransferRecipient } from '../../core/services/paystack-payout.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-payout-requests',
  templateUrl: './payout-requests.component.html',
  styleUrls: ['./payout-requests.component.css'],
  providers: [DatePipe],
  imports: [PageBreadcrumbComponent, TabPanelComponent, TabComponent, ReusableTableComponent]
})
export class PayoutRequestsComponent {
  public vendorState: "listVendorPayouts" | "viewVendorPayouts" =
    "listVendorPayouts";
  public riderState: "listRiderPayouts" | "viewRiderPayouts" =
    "listRiderPayouts";
  activeTab1 = 'Riders Payout';
  basicTabs: Tab[] = [
    { id: 'Riders Payout', label: 'Riders Payout' },
    { id: 'Vendor Payout', label: 'Vendor Payout' },
    // { id: 'notifications', label: 'Notifications' },
    // { id: 'disabled', label: 'Disabled', disabled: true }
  ];
  vendorPayouts: any[] | undefined;
  riderPayouts: any[] | undefined;

   vendorTableActions: TableAction[] = [
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

        riderTableActions: TableAction[] = [
          {
            label: 'View More',
            callback: (item) => this.viewRiderItem(item)
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
  riderColumns = [
    { key: 'account_name', label: 'Account Name', sortable: true },
    { key: 'account_number', label: 'Account Number', sortable: true },
    { key: 'bank_name', label: 'Bank Name', sortable: true },
    { key: 'Amount', label: 'Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'timestamp', label: 'Date', sortable: true },
    { key: 'vendor_name', label: 'Vendor Name', sortable: true },
  ];
  selectedVendor: any;
  successMessage: string = '';
  transferReference: any;
  errorMessage: any;
  recipientCode: any;
  constructor(
    private fireService: FirestoreService,
    private loading: LoadingService,
    private datePipe: DatePipe,
    private paystackService: PaystackService,
    private notificationService: NotificationService

  ) {
    this.getPayoutRequests();
   }

   viewItem(item: any): void {
        this.vendorState = "viewVendorPayouts";
        console.log('View item:', item);
        this.selectedVendor = item
        // alert(`Viewing: ${item.action}`);
      }

      viewRiderItem(item: any): void {
        this.riderState = "viewRiderPayouts";
        console.log('View item:', item);
        this.selectedVendor = item
        // alert(`Viewing: ${item.action}`);
      }

      // editItem(item: any): void {
      //   console.log('Edit item:', item);
      //   alert(`Editing: ${item.action}`);
      // }

      // deleteItem(item: any): void {
      //   console.log('Delete item:', item);
      //   alert(`Deleting: ${item.action}`);
      // }
  getPayoutRequests(): void {
    this.fireService.getCollection('vendorPayout').subscribe(data => {
      console.log('Payout Requests data:', data);
      this.vendorPayouts = data;
    });   

    this.fireService.getCollection('riderPayout').subscribe(data => {
      console.log('Payout Requests data:', data);
      this.riderPayouts = data;
    });
  }

  get formattedVendorPayout() {
      const txs = this.vendorPayouts || [];
      return txs.map(payout => ({
        ...payout,
        // Choose your preferred format:
        // timestamp: transaction.timestamp ? formatDate(transaction.timestamp, 'medium') : '-',
        // OR
        timestamp: formatDateCustom(payout.timestamp, 'MMM dd, yyyy h:mm a'),
        // OR
        // timestamp: getRelativeTime(transaction.timestamp),
        amount: typeof payout.amount === 'number' ? `$${payout.amount}` : (payout.amount ?? '-')
      }));
    }

    get formattedRiderPayout() {
      const txs = this.riderPayouts || [];
      return txs.map(payout => ({
        ...payout,
        // Choose your preferred format:
        // timestamp: transaction.timestamp ? formatDate(transaction.timestamp, 'medium') : '-',
        // OR
        timestamp: formatDateCustom(payout.timestamp, 'MMM dd, yyyy h:mm a'),
        // OR
        // timestamp: getRelativeTime(transaction.timestamp),
        amount: typeof payout.amount === 'number' ? `$${payout.amount}` : (payout.amount ?? '-')
      }));
    }

    onPageChange(page: number): void {
    console.log("Current page:", page);
  }

  onTabChange(tabId: string) {
    console.log('Active tab changed to:', tabId);
    this.activeTab1 = tabId;
  }

  approveRiderPayout(payoutId: string) {
    console.log('Approving payout with ID:', payoutId);
    this.loading.show();
    const payoutData: TransferRecipient = {
      name: this.selectedVendor.account_name,
      account_number: this.selectedVendor.account_number,
      bank_code: this.selectedVendor.bank_code
    };
    // Implement approval logic here
    this.paystackService.createRecipient(payoutData).subscribe({
      next: (response) => {
        // this.loading = false;
        this.loading.hide();
        console.log(response);
        if (response.active) {
          this.successMessage = 'Payout request submitted successfully!';
          this.transferReference = response.reference || '';
          this.recipientCode = response.recipient_code || '';
          
          this.initiatePayout(payoutId, 'riderPayout');
        } else {
          this.errorMessage = response.message || 'Payout failed. Please try again.';
        }
      },
      error: (error) => {
        // this.submitting = false;
        this.loading.hide();
        this.errorMessage = error.message || 'An error occurred. Please try again.';
        console.error('Payout error:', error);
      }
    });
  }

  approvePayout(payoutId: string) {
    console.log('Approving payout with ID:', payoutId);
    this.loading.show();
    const payoutData: TransferRecipient = {
      name: this.selectedVendor.account_name,
      account_number: this.selectedVendor.account_number,
      bank_code: this.selectedVendor.bank_code
    };
    // Implement approval logic here
    this.paystackService.createRecipient(payoutData).subscribe({
      next: (response) => {
        // this.loading = false;
        this.loading.hide();
        console.log(response);
        if (response.active) {
          this.successMessage = 'Payout request submitted successfully!';
          this.transferReference = response.reference || '';
          this.recipientCode = response.recipient_code || '';
          
          this.initiatePayout(payoutId, 'vendorPayout');
        } else {
          this.errorMessage = response.message || 'Payout failed. Please try again.';
        }
      },
      error: (error) => {
        // this.submitting = false;
        this.loading.hide();
        this.errorMessage = error.message || 'An error occurred. Please try again.';
        console.error('Payout error:', error);
      }
    });
  }

  initiatePayout(payoutId: string, ref: any) {
    // Implement payout initiation logic here
    this.loading.show();
    const transferData = {
      amount: this.selectedVendor.Amount * 100, // Convert to kobo
      recipient: this.recipientCode,
      reason: 'Payout Transfer'
    };

    this.paystackService.initiateTransfer(transferData).subscribe({
      next: (response) => {
        this.loading.hide();
        console.log(response);
        if (response.status === 'success') {
          this.notificationService.success('Payout initiated successfully!');
          this.transferReference = response.reference || '';
          // Update payout status in Firestore
          this.fireService.updateDocument(ref , payoutId, { status: 'Approved' }).then(() => {
            this.getPayoutRequests();
          });
        } else {
          this.errorMessage = response.message || 'Payout initiation failed. Please try again.';
        }
      },
      error: (error) => {
        this.loading.hide();
        this.errorMessage = error.message || 'An error occurred during payout initiation. Please try again.';
        console.error('Payout initiation error:', error);
      }
    }); 
  }

  disapprovePayout(payoutId: string) {
    console.log('Disapproving payout with ID:', payoutId);
    // Implement disapproval logic here
  }
}

