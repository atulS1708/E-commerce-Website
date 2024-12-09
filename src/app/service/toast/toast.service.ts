import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastService: ToastrService) {}

  showToaster(title: string, msg: string, type: string, timeout_sec?: number) {
    const timeout = timeout_sec ? timeout_sec * 100 : 5000;

    const toastOptions = {
      timeOut: timeout,
      extendedTimeOut: 1000,
      progressBar: true,
      tapToDismiss: true,
      closeButton: true,
    };

    switch (type) {
      case 'default':
        this.toastService.info(msg, title, toastOptions);
        break;
      case 'info':
        this.toastService.info(msg, title, toastOptions);
        break;
      case 'success':
        this.toastService.success(msg, title, toastOptions);
        break;
      case 'error':
        this.toastService.error(msg, title, toastOptions);
        break;
      case 'warning':
        this.toastService.warning(msg, title, toastOptions);
        break;
    }
  }

  hideToaster() {
    this.toastService.clear();
  }
}
