import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb.service';
import { AuthService } from '../auth/services/auth.service';
import { Password, Message } from 'primeng/primeng';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  msgs: Message[] = [];
  safetyBarColor = 'red';
  safetyBarWidth = '0%';

  constructor(private breadcrumbService: BreadcrumbService, private authService: AuthService) {
    this.breadcrumbService.setItems([
        { label: 'Profil' }
    ]);
  }

  passwordChanged(password: string): void {
    let passwordSafety = 0;
    if (password.length >= 0) {
      passwordSafety += (password.length) * (password.length) / 3;
      if (password !== password.toLowerCase() && password !== password.toUpperCase()) {
        passwordSafety *= 1.5;
      }
      if (password.match(/\d/) !== null) {
        passwordSafety *= 1.2;
      }
      if (password.match(/[^A-Za-z0-9]/) !== null) {
        passwordSafety *= 1.3;
      }
    }

    if (passwordSafety > 100) {
      passwordSafety = 100;
    }
    this.safetyBarColor = 'hsl(' + passwordSafety * 1.2 + ', 100%, 50%)';
    this.safetyBarWidth = passwordSafety + '%';
  }

  submit(oldpass, newpass, repeatpass) {
    if (newpass !== repeatpass) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '', detail: 'Die beiden Passwörter stimmen nicht überein!' });
      return;
    }

    this.authService.changePassword(oldpass, newpass).subscribe(resp => {
      this.msgs = [];
      if (resp === true) {
        this.msgs.push({ severity: 'success', summary: '', detail: 'Das Passwort wurde erfolgreich geändert!' });
      } else {
        this.msgs.push({ severity: 'error', summary: '', detail: resp.toString()});
      }
    });
  }

  ngOnInit() {}

}
