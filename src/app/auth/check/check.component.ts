import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  
  selector: 'body',
  template: '<div class="text-center">Loading</div>',
  //styleUrls: ['./check.component.css']
  
})
export class CheckComponent implements OnInit {

  constructor(private Auth:AuthService, private Routes:Router ) { }

  ngOnInit() {
    let token = window.localStorage.getItem('token');
    let auth  = window.localStorage.getItem('auth');
    let res:any;
    if( token=== null || token === undefined || token === '' ){
      this.Routes.navigateByUrl('login');
    }else{
      res = JSON.parse(auth);
      if ( res ){
        this.Routes.navigateByUrl('dashboard');
      }else{
        this.Routes.navigateByUrl('login');
      }
    }
  }

}
