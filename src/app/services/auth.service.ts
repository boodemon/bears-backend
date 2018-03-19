import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Base } from './app.service';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  private API = Base.API_URI; 

  constructor(
    private http:HttpClient,
    private Router:Router
  ) { }

  token(){
    return window.localStorage.getItem('token');
  }
  
  postLogin(username:string,password:string){
    return this.http.post( this.API + '/auth/login',{username,password,_method:'POST'});
  }

  online(){
      let token = window.localStorage.getItem('token');
      let auth = window.localStorage.getItem('auth');
      let data:any;
      if (token !== null && token !== '' && token !== undefined ){
        this.http.get(this.API + '/auth/check?token=' + token )
          .subscribe((response)=>{
           // alert('response code : ' + response['code']);
            if( response['code'] != 200){
              alert('Error !! '+ response['msg'] );
              this.logout();
            }
          },
          err => {
            alert('cannot connect server please try again');
            this.logout();
          });
        }
  }

  code(res){
    console.log('check code ' , res );
  }

  logout(){
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('auth');
    window.location.href = "/";
  }

}