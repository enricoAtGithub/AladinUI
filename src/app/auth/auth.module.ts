import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TooltipModule } from 'primeng/primeng';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MessagesModule,
    ButtonModule,
    FormsModule,
    SharedModule,
    TooltipModule
  ]
})
export class AuthModule { }
