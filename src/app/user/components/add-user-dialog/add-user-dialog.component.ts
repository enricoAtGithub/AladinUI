import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserItem } from '../../models/user-item';
import { UsersService } from '../../services/users.service';
import { MessageService, DynamicDialogRef } from 'primeng/primeng';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  constructor(private usersService: UsersService, public ref: DynamicDialogRef,  private messageService: MessageService) { }

  ngOnInit() {
  }

  createUser(form: NgForm) {
    const newUser = new UserItem();
    newUser.loginName = form.value['loginName'];
    newUser.lastName = form.value['lastName'];
    newUser.firstName = form.value['firstName'];
    newUser.email = form.value['email'];
    newUser.active = form.value['active'] === '' ? true : false;

    this.usersService.createUser(newUser).subscribe(() => {
        this.usersService.userList$.pipe(first()).subscribe((currentUserList: UserItem[]) => {
          currentUserList.push(newUser);
          this.usersService.updateUserListLocally(currentUserList);
        });
        this.ref.close(null);
      },
      err => this.messageService.add({severity: 'error', summary: '', detail: err['error']['message']}));
  }
}
