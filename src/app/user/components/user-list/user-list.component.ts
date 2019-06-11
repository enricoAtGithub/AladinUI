import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { UserItem } from '../../models/user-item';
import { MessageService, DialogService, ConfirmationService } from 'primeng/primeng';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [ ConfirmationService ]
})
export class UserListComponent implements OnInit {

  editUserId = -1;

  constructor(public usersService: UsersService, private messageService: MessageService,
    private dialogService: DialogService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.usersService.refreshUserList();
  }

  activateUser(user: UserItem) {
    this.usersService.activateUser(user).subscribe(() => user.active = true,
    err => this.messageService.add({severity: 'error', summary: '', detail: err['error']['message']}));
  }

  deactivateUser(user: UserItem) {
    this.usersService.deactivateUser(user).subscribe(() => user.active = false,
    err => this.messageService.add({severity: 'error', summary: '', detail: err['error']['message']}));
  }

  deleteUser(user: UserItem) {
    this.confirmationService.confirm({
      message: 'Sind Sie sicher, dass Sie diesen Benutzer löschen wollen?',
      accept: () => {
          this.usersService.deleteUser(user).subscribe(() =>
            this.usersService.userList = this.usersService.userList.filter((value, index, arr) => value !== user),
            err => this.messageService.add({severity: 'error', summary: '', detail: err['error']['message']})
          );
      }
    });
  }

  showAddUserDialog() {
    this.dialogService.open(AddUserDialogComponent, {
      header: 'Benutzer Hinzufügen',
      width: '25%'
    });
  }

}
