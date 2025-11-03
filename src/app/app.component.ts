import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from "./shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    LoadingSpinnerComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular Ecommerce Dashboard | TailAdmin';
}
