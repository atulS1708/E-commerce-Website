import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { Endpoints } from '../../../shared/endpoints';
import { CommonService } from '../../service/common/common.service';
import { ToastService } from '../../service/toast/toast.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit {
  readonly eye = Eye;
  readonly eyeOff = EyeOff;

  showPassword: boolean = false;

  form!: UntypedFormGroup;

  url = Endpoints.addUser;

  existingUsers: [] = [];

  existingUsersLength: number = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private commonService: CommonService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    // to get all the user
    this.getUsers();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: 'null',
      id: null,
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      avatar: 'https://www.flaticon.com/free-icon/man_2202112',
    });
  }

  getUsers() {
    // get all the users
    this.commonService.getData(this.url).subscribe((res) => {
      this.existingUsers = res;
      console.log(this.existingUsers);
      this.existingUsersLength = this.existingUsers.length;
    });
  }

  checkUser() {
    // Validate form and stop execution if invalid
    this.form.markAllAsTouched();
    if (this.form.invalid)
      return this.toastService.showToaster(
        'Login',
        'Please fill all the required fields',
        'error'
      );

    // Extracting form data
    const { email, password } = this.form.getRawValue();

    // Check for an existing user
    const userExists = this.existingUsers.find(
      (user: any) => user.email === email && user.password === password
    );

    if (userExists) {
      this.toastService.showToaster(
        'Login Successful',
        'You have logged in successfully.',
        'success'
      );
      this.addAccessToken({ email, password });
    } else {
      this.toastService.showToaster(
        'Login Failed',
        'User not found. Please register.',
        'error'
      );
      this.form.get('password')?.setValue('');
    }
  }

  addAccessToken(credentials: { email: string; password: string }): void {
    this.commonService.postData(Endpoints.authToken, credentials).subscribe({
      next: (res) => {
        if (res?.access_token) {
          this.authService.saveUserToLocalStorage(res.access_token);
          this.authService.isUserLoggedIn.next(true);
          this.initForm();
        } else {
          this.toastService.showToaster(
            'Login Failed',
            'Failed to retrieve access token. Please try again.',
            'error'
          );
        }
      },
      error: (err) => {
        this.toastService.showToaster(
          'Login Failed',
          'An error occurred while logging in. Please try again.',
          'error'
        );
        console.error('Error fetching access token:', err);
      },
    });
  }
}
