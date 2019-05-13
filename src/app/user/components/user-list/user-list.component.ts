import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { UserItem } from '../../models/user-item';
import { MessageService } from 'primeng/primeng';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  editUserId = -1;

  constructor(private usersService: UsersService, private messageService: MessageService) {

  }

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
    this.usersService.deleteUser(user).subscribe(() =>
      this.usersService.userList = this.usersService.userList.filter((value, index, arr) => value !== user),
      err => this.messageService.add({severity: 'error', summary: '', detail: err['error']['message']})
    );
  }

}
