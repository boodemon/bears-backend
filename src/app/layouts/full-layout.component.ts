import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  styleUrls:['./full-layout.component.css']
})
export class FullLayoutComponent implements OnInit {
  private users:string;
  private user:any;

  constructor(
              private Auth:AuthService,
              private Router:Router 
            ){}

  public disabled = false;
  public status: {isopen: boolean} = {isopen: false};

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit(): void {
    this.users = window.localStorage.getItem('auth');
    if( this.users ){
      this.user = JSON.parse( this.users );
      console.log( 'this user = ', this.user );
    }else{
      alert('Please Login!!');
      this.Auth.logout();
    }
    

  }
}
