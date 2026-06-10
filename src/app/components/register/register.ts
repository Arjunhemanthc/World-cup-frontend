import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  
  emailError = '';

  constructor(private authService: AuthService, private router: Router) {}



  onSubmit() {
    this.emailError = '';
    
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      return; // Handled by standard HTML5 validation
    }

    if (this.password !== this.confirmPassword) {
      return; // Simple handling, could add specific error message
    }

    this.authService.register(this.fullName, this.email, this.password).subscribe(result => {
      if (result.success) {
        alert('Registration successful! Please log in.');
        this.router.navigate(['/login']);
      } else {
        this.emailError = result.message || 'Registration failed.';
      }
    });
  }
}
