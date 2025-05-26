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

  loginError: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService){
    this.loginForm = this.fb.group({
      workerno: [null, [this.workerNoValidator()]],
      password: [null, [this.passwordValidator()]]
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

  passwordValidator(): ValidatorFn {
    return (control : AbstractControl): ValidationErrors | null => {
      const regexPassword = /^[a-z][0-9]{4}$/; //accepts only 1 letter lowercase from a to z and 4 digits between 0 and 9
      const value = control.value;

      if (value && !regexPassword.test(value)){
        return { invalidPassword: true };
      }

      return null;
    }
  }

  tooglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(){
    this.authService.login(this.loginForm.value.workerno, this.loginForm.value.password).subscribe({
      next: (res:any) => {
        if (res.userRole === 'Admin'){
          this.router.navigate(['/admin/dashboard']);
        }else{
          this.router.navigate(['/employees/refurbishment']);
        }
        this.authService.setUser(res);
      },
      error: (err:any) => {
        console.log(err);
        this.loginError = "Worker Number or Password doesn't exist. <br> Please try again ! "
        this.loginForm.controls['password'].setValue('')
      }
    })
  }

}
