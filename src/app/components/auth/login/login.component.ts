import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private router: Router){
    this.loginForm = this.fb.group({
      workerno: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }

  tooglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(){
    console.log("something")
  }

}
