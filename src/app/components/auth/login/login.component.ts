import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService){
    this.loginForm = this.fb.group({
      workerno: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }

  tooglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(){
    this.authService.login(this.loginForm.value.workerno, this.loginForm.value.password).subscribe({
      next: (res) => {
        this.router.navigate(['/refurbishment']);
        console.log(res)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
