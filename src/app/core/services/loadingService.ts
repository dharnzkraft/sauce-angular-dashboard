import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // Show loading spinner
  show(): void {
    this.loadingSubject.next(true);
  }

  // Hide loading spinner
  hide(): void {
    this.loadingSubject.next(false);
  }

  // Get current loading state
  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}