import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
email = '';
password ='';
errorMessage: string = '';
constructor(private authService: AuthService, private router: Router){}

onLogin(){
  this.errorMessage = ''
  const credentials = {email: this.email, password: this.password};
  this.authService.login(credentials).subscribe({
    next: () =>{
      
      this.router.navigate(['/tasks'])
    },
    error: (err)=>{
      this.errorMessage = 'Invalid email or password';}
  })
}
}
