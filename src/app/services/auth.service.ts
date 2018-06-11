import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(
    private http:HttpClient,
    private Router:Router
  ) { }
  path_api(){
    return 'http://localhost/2018/bears-kmg/bears-api';
    //return 'http://ex.saiimog.com/bears/api';
  }
  
  token(){
    return window.localStorage.getItem('token');
  }
  
  postLogin(param:any=[]){
    return this.http.post( this.path_api() + '/auth/login',param);
  }

  online(){
      let token = window.localStorage.getItem('token');
      let auth = window.localStorage.getItem('auth');
      let data:any;
      if (token !== null && token !== '' && token !== undefined ){
        this.http.get(this.path_api() + '/auth/check?token=' + token )
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