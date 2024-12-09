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
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css',
})
export class SignupPageComponent {
  readonly eye = Eye;
  readonly eyeOff = EyeOff;

  showPassword: boolean = false;

  form!: UntypedFormGroup;

  url = Endpoints.addUser;

  existingUsers: any = [];

  existingUsersLength: number = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private commonService: CommonService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    // to get all the user
    this.getUsers();
  }

  initForm(): void {
    this.form = this.fb.group({
      id: null,
      name: ['', Validators.required],
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
    const userExists = this.existingUsers.some(
      (user: any) => user.email === email && user.password === password
    );

    if (userExists) {
      this.toastService.showToaster('Sign Up', 'User already exists', 'info');
    } else {
      this.addUser();
    }
  }

  addUser() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return this.toastService.showToaster(
        'Sign Up',
        'Please fill all the required fields',
        'error'
      );
    }
    const data = {
      ...this.form.getRawValue(),
      id: this.existingUsers.length + 1,
    };

    this.commonService.postData(this.url, data).subscribe({
      next: (res) => {
        this.toastService.showToaster(
          'Sign Up',
          'User added successfully',
          'success'
        );
        this.existingUsers = [...this.existingUsers, res];
        this.router.navigate(['/login']);
        this.initForm();
      },
      error: (err) => {
        this.toastService.showToaster(
          'Sign Up',
          'Failed to add user. Please try again.',
          'error'
        );
        console.error('Error adding user:', err);
      },
    });
  }
}
