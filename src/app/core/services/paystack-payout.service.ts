// paystack.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface TransferRecipient {
  name: string;
  account_number: string;
  bank_code: string;
}

export interface TransferRequest {
  amount: number; // Amount in kobo (NGN) or pesewas (GHS)
  recipient: string; // Recipient code from createRecipient
  reason: string;
}

export interface BankDetails {
  name: string;
  code: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaystackService {
  // IMPORTANT: Never expose your secret key in frontend!
  // These API calls should be made from your backend server
  private apiUrl = 'https://api.paystack.co';
  
  // This is just for demonstration - USE BACKEND IN PRODUCTION!
  private secretKey = 'YOUR_PAYSTACK_SECRET_KEY'; // DO NOT USE IN FRONTEND!

  constructor(private http: HttpClient) {}

  /**
   * Get list of Nigerian banks
   * This is safe to call from frontend
   */
  getBanks(country: string = 'nigeria'): Observable<BankDetails[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.secretKey}`
    });

    return this.http.get<any>(`${this.apiUrl}/bank`, { 
      headers,
      params: { country, perPage: '100' }
    }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Verify account number
   * IMPORTANT: Call this from your backend
   */
  verifyAccountNumber(accountNumber: string, bankCode: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.secretKey}`
    });

    return this.http.get<any>(
      `${this.apiUrl}/bank/resolve`,
      { 
        headers,
        params: {
          account_number: accountNumber,
          bank_code: bankCode
        }
      }
    ).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Create transfer recipient
   * IMPORTANT: Call this from your backend
   */
  createRecipient(recipient: TransferRecipient): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(
      `https://sauce-payment-server.onrender.com/create-recipient`,
      recipient,
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Initiate transfer (payout)
   * IMPORTANT: Call this from your backend
   */
  initiateTransfer(transfer: TransferRequest): Observable<any> {
   

    return this.http.post<any>(
      `https://sauce-payment-server.onrender.com/transfer`,
      transfer,
    ).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Verify transfer status
   */
  verifyTransfer(reference: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.secretKey}`
    });

    return this.http.get<any>(
      `${this.apiUrl}/transfer/verify/${reference}`,
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Get transfer details
   */
  getTransfer(idOrCode: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.secretKey}`
    });

    return this.http.get<any>(
      `${this.apiUrl}/transfer/${idOrCode}`,
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * List all transfers
   */
  listTransfers(page: number = 1, perPage: number = 50): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.secretKey}`
    });

    return this.http.get<any>(
      `${this.apiUrl}/transfer`,
      { 
        headers,
        params: {
          page: page.toString(),
          perPage: perPage.toString()
        }
      }
    ).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Generate unique transfer reference
   */
  generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `TRF-${timestamp}-${random}`;
  }

  /**
   * Convert Naira to Kobo
   */
  nairaToKobo(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Convert Kobo to Naira
   */
  koboToNaira(amount: number): number {
    return amount / 100;
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || errorMessage;
    }
    
    console.error('Paystack Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}