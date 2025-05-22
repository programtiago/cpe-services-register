import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
      workerno: [null, [this.workerNoValidator()]],
      password: [null, [Validators.required]]
    })
  }

  workerNoValidator(): ValidatorFn {
    return (control : AbstractControl): ValidationErrors | null => {
      const regexWorkNumber = /^[0-9]{5}$/; //numbers between 0 and 9 and has 5 digits
      const value = control.value;

      if (value && !regexWorkNumber.test(value)){
        return { invalidWorkerNo: true };
      }

      return null;
    }
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
