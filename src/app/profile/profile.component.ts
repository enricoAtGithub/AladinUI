import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb.service';
import { AuthService } from '../auth/services/auth.service';
import { Password, Message } from 'primeng/primeng';
import { ErrorNotificationService } from '../shared/services/error-notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  safetyBarColor = 'red';
  safetyBarWidth = '0%';

  oldpass: string;
  newpass: string;
  repeatpass: string;

  constructor(private breadcrumbService: BreadcrumbService, private authService: AuthService, private errorNotificationService: ErrorNotificationService) {
    this.breadcrumbService.setItems([
        { label: 'Profil' }
    ]);
  }

  ngOnInit() {}

  submit() {
    if (this.newpass !== this.repeatpass) {
      this.errorNotificationService.addErrorNotification('', 'Die beiden Passwörter stimmen nicht überein!');
      return;
    }

    this.authService.changePassword(this.oldpass, this.newpass).subscribe(resp => {
      if (resp === true) {
        this.errorNotificationService.addSuccessNotification('', 'Das Passwort wurde erfolgreich geändert!');
      } else {
        this.errorNotificationService.addErrorNotification('', resp.toString());
      }
    });
  }

}
