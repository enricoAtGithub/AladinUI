import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  msgs: Message[] = [];
  loginFailed = false;

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {}


  login(user, pass) {
    this.authService.login(user.value, pass.value).subscribe(success => {
      if (success) {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        const redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/dashboard';

        // Redirect the user
        this.router.navigateByUrl(redirect);
      } else {
        this.loginFailed = true;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: 'Der eingegebene Benutzername oder das Passwort ist falsch.' });
      }
    });
  }
}
