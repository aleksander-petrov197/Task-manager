import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email = '';
  password = '';
  errorMessage: string = '';
  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    if(this.email.toLowerCase() === this.password.toLocaleLowerCase()){
      this.errorMessage = "Security Alert: Your password cannot be the same as your email.";
      return;
    }
    this.errorMessage = '';
    const credentials = {email: this.email, password: this.password};
    this.authService.register(credentials).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
    error: (err) => {
      if (Array.isArray(err.error.message)) {

        this.errorMessage = err.error.message.join(' & ');
      } 
     
      else if (err.status === 500 || err.error.message === 'Internal server error') {
        this.errorMessage = 'This email is already in use. Please try another or login.';
      } 
     
      else {
        this.errorMessage = err.error.message || 'Registration failed. Try again';
      }
    }

    })
  }
}
