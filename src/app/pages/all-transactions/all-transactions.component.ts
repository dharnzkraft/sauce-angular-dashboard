import { Component } from "@angular/core";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { ReusableTableComponent } from "../../shared/my-table/my-table.component";
import { FirestoreService } from "../../core/services/firestoreService";
import { LoadingService } from "../../core/services/loadingService";
import { DatePipe } from "@angular/common";
import { formatDate, formatDateCustom } from "../../core/utils/date-format";

@Component({
  selector: "app-all-transactions",
  templateUrl: "./all-transactions.component.html",
  styleUrls: ["./all-transactions.component.css"],
  providers: [DatePipe],
  imports: [PageBreadcrumbComponent, ReusableTableComponent],
})
export class AllTransactionsComponent {
  allTransactions: any[] | undefined;
  public transactionState: "viewAllTransactions" | "viewTransactionDetails" =
    "viewAllTransactions";
  selectedTransactions: any;

  constructor(
    private fireService: FirestoreService,
    private loading: LoadingService,
    private datePipe: DatePipe
  ) {
    this.getTransactions();
  }

  columns = [
    { key: "userName", label: "User Name", sortable: true },
    { key: "transactionId", label: "Transaction ID", sortable: true },
    { key: "userId", label: "User ID", sortable: true },
    { key: "amount", label: "Amount", sortable: true },
    { key: "description", label: "Description", sortable: true },
    { key: "timestamp", label: "Date", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ];

  getTransactions(): void {
    this.fireService.getCollection("transactions").subscribe((data) => {
      // console.log('Transactions data:', data);
      this.allTransactions = data;
    });
  }

  get formattedTransactions() {
    const txs = this.allTransactions || [];
    return txs.map((transaction) => ({
      ...transaction,
      // Choose your preferred format:
      // timestamp: transaction.timestamp ? formatDate(transaction.timestamp, 'medium') : '-',
      // OR
      timestamp: formatDateCustom(transaction.timestamp, "MMM dd, yyyy h:mm a"),
      // OR
      // timestamp: getRelativeTime(transaction.timestamp),
      amount:
        typeof transaction.amount === "number"
          ? `$${transaction.amount}`
          : transaction.amount ?? "-",
    }));
  }

  onPageChange(page: number): void {
    console.log("Current page:", page);
  }

  parseAndFormatDate(
    dateString: string,
    format: string = "MMM dd, yyyy"
  ): string {
    if (!dateString) return "-";

    try {
      // Remove " at " and timezone for easier parsing
      const cleanedDate = dateString
        .replace(" at ", " ")
        .replace(/UTC[+-]\d+/, "")
        .trim();

      const date = new Date(cleanedDate);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return dateString; // Return original if parsing fails
      }

      return this.datePipe.transform(date, format) || dateString;
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return dateString;
    }
  }
}
