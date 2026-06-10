import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private ngZone: import('@angular/core').NgZone
  ) {}

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe(success => {
      if (success) {
        this.ngZone.run(() => {
          const user = this.authService.currentUserValue;
          if (user?.role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/user/dashboard';
          }
        });
      } else {
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    });
  }
}
