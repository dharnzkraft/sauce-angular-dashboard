import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  user,
  authState
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingService } from './loadingService';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private router: Router,
    private loadingService: LoadingService
  ) {
    // Observable of the current user
    this.user$ = authState(this.auth);
  }

  // Get the current user
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Register new user with email and password
  async register(email: string, password: string, displayName?: string): Promise<any> {
    try {
      const credential = await createUserWithEmailAndPassword(
        this.auth, 
        email, 
        password
      );
      
      // Update display name if provided
      if (displayName && credential.user) {
        await updateProfile(credential.user, { displayName });
      }
      
      return { 
        success: true, 
        user: credential.user 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.handleError(error) 
      };
    }
  }

  // Login with email and password
  async login(email: string, password: string): Promise<any> {
    try {
      const credential = await signInWithEmailAndPassword(
        this.auth, 
        email, 
        password
      );
      
      return { 
        success: true, 
        user: credential.user 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.handleError(error) 
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/signin']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<any> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { 
        success: true, 
        message: 'Password reset email sent' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.handleError(error) 
      };
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  // Get user ID
  getUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  // Get user email
  getUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  // Handle Firebase errors
  private handleError(error: any): string {
    let message = 'An error occurred';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        message = 'Operation not allowed';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection';
        break;
      default:
        message = error.message || 'An error occurred';
    }
    
    return message;
  }
}