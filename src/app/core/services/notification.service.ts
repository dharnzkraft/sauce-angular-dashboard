// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  private defaultDuration = 5000; // 5 seconds

  /**
   * Show a success notification
   */
  success(message: string, title: string = 'Success', duration?: number) {
    this.show({
      type: 'success',
      message,
      title,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Show an error notification
   */
  error(message: string, title: string = 'Error', duration?: number) {
    this.show({
      type: 'error',
      message,
      title,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, title: string = 'Warning', duration?: number) {
    this.show({
      type: 'warning',
      message,
      title,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Show an info notification
   */
  info(message: string, title: string = 'Info', duration?: number) {
    this.show({
      type: 'info',
      message,
      title,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Show a custom notification
   */
  show(notification: Omit<Notification, 'id'>) {
    const id = this.generateId();
    const newNotification: Notification = {
      id,
      dismissible: true,
      ...notification
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    // Auto-dismiss after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, notification.duration);
    }
  }

  /**
   * Dismiss a specific notification
   */
  dismiss(id: string) {
    const currentNotifications = this.notificationsSubject.value;
    const filtered = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filtered);
  }

  /**
   * Clear all notifications
   */
  clearAll() {
    this.notificationsSubject.next([]);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}