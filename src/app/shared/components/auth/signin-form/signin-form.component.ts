import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/authService';
import { LoadingService } from '../../../../core/services/loadingService';

@Component({
  selector: 'app-signin-form',
  imports: [
    CommonModule,
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {

  
  showPassword = false;
  isChecked = false;

  email = '';
  password = '';
  errorMessage: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSignIn() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Remember Me:', this.isChecked);
    this.loadingService.show();
    if (this.email && this.password) {
      const result = await this.authService.login(this.email, this.password);
      this.loadingService.hide();
      if (result.success) {
        this.router.navigate(['/dashboard']); // Navigate to your main page
      } else {
        this.errorMessage = result.error;

      }
    }
  }
}
