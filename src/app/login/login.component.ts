import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService
  ) {
    
  }

  ngOnInit() {
    // redirect to home if already logged in
    // if (this.loginService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.loginService.login(this.f.username.value, this.f.password.value)
      .pipe(first(),
        catchError(err => {
          return throwError(err);
        }))
      .subscribe({
        next: () => {
          // get return url from route parameters or default to '/'
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/shell/home';
          this.router.navigate([returnUrl]);
        },
        error: error => {
          console.log(error);
          this.error = error;
          this.loading = false;
          this.loginForm.reset();
          this.loginForm.controls['password'].setErrors(null);
          this.loginForm.controls['username'].setErrors(null);
          //this.loginForm.controls.reset;
          //this.loginForm.reset();
          //this.loginForm.clearValidators();
          //this.loginForm.updateValueAndValidity();
        }
      });
  }
}
