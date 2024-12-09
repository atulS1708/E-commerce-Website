import { CommonService } from './../common/common.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  public isUserLoggedIn = new BehaviorSubject<boolean>(false);

  saveUserToLocalStorage(token: string) {
    localStorage.setItem('access_token', JSON.stringify(token));
  }
}
