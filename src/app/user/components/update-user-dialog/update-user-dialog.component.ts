import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserItem } from '../../models/user-item';
import { UsersService } from '../../services/users.service';
import { MessageService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/primeng';

@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.component.html',
  styleUrls: ['./update-user-dialog.component.css']
})
export class UpdateUserDialogComponent implements OnInit {
  user: UserItem;

  constructor(private usersService: UsersService, public ref: DynamicDialogRef,  private messageService: MessageService
    , public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.user = this.config.data['user'];
  }

  updateUser(form: NgForm) {
    const updatedUser = Object.assign({}, this.user);
    updatedUser.lastName = form.value['lastName'];
    updatedUser.firstName = form.value['firstName'];
    updatedUser.email = form.value['email'];
    updatedUser.enforcePasswdChange = form.value['enforcePasswdChange'] === '' ? true : false;

    this.usersService.updateUser(updatedUser).subscribe(() => {
      Object.keys(updatedUser).forEach(key => this.user[key] = updatedUser[key]);
      this.ref.close(null);
    }, err => this.messageService.add({severity: 'error', summary: '', detail: err['error']['message']}));
  }
}
