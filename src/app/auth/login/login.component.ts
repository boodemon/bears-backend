import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  templateUrl: './login.component.html',
  //styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  frmAuth:FormGroup;
  constructor( private Auth:AuthService, private Router:Router,private frm:FormBuilder) { 
    // if( Auth.check() === true ){
    //   Router.navigateByUrl('dashboard');
    // }
    this.createFrom();
  }
  createFrom(){
    this.frmAuth = this.frm.group({
      username:[''],
      password:[''],
      _methos:['POST']
    })
  }
  private username:string;
  private password:string;
  private responsding:string;
  private result:boolean;

  ngOnInit() {
    this.Auth.token();
  }

  login(){
    this.Auth.postLogin( this.frmAuth.value ).subscribe((response)=>{
      //console.log('login result : ', response);
      if( response['result'] == 'successful'){
          this.responsding = 'Login successful';
          this.result = true;
          let result = response['auth'];
          //console.log('login token : ', result);
          window.localStorage.setItem('token',result);
          window.localStorage.setItem('auth',JSON.stringify(response['user']));
          this.Router.navigateByUrl('dashboard');
      }else{
          this.responsding = response['message'] ;
          this.username = '';
          this.password = '';
          this.result = false;
      }
      
    },
    err => {
      this.responsding = 'Error : ' + err.message
      this.result = false;
    });
  }

}
