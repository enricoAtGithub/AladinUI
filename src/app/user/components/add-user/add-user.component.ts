import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UserItem } from '../../models/user-item';
import { UserListComponent } from '../user-list/user-list.component';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/primeng';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  constructor(private usersService: UsersService, private messageService: MessageService) { }

  ngOnInit() {
  }

  createUser(form: NgForm) {
    const newUser = new UserItem();
    newUser.loginName = form.value['loginName'];
    newUser.lastName = form.value['lastName'];
    newUser.firstName = form.value['firstName'];
    newUser.email = form.value['email'];
    newUser.active = form.value['active'] === '' ? true : false;

    this.usersService.createUser(newUser).subscribe(() => this.usersService.userList.push(newUser),
      err => this.messageService.add({severity: 'error', summary: '', detail: err['error']['message']}));
  }

}
