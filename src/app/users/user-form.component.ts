import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  @Input() username:string;
  @Input() email:string;
  @Input() name:string;
  @Input() password:string;
  @Input() tel:string;
  @Input() userID:number;
  constructor() { }

  newUser(){
    this.username = '';
    this.email    = '';
    this.password = '';
    this.name     = '';
    this.tel      = '';
    this.userID   = 0;

  }
  updateUser(data){
    this.username = data.username;
    this.email    = data.email;
    this.name     = data.name;
    this.tel      = data.tel;
    this.userID   = data.userID;
  }
  onSubmit(){

  }

}
