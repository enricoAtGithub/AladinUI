import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Observable } from 'rxjs';
import { UserItem } from '../../models/user-item';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList$: Observable<UserItem[]>;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.userList$ = this.usersService.getUserList();
  }

}
