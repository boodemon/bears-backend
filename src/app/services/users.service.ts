import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule} from '@angular/common/http'
import { Base } from './app.service';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {
  private API_URI = Base.API_URI;

  constructor(
    private http : HttpClient,
  ) { }
  token = window.localStorage.getItem('token');
  getAdmin(){
    console.log( 'url ', this.API_URI );
    return this.http.get( this.API_URI + '/admin?token='+ this.token);
  }

  getUser( userID:number ){
    return this.http.get( this.API_URI + '/admin/' + userID +'?token='+ this.token);
  }

  addNew(data){
    console.log(' post data ', data );
    return this.http.post( this.API_URI + '/admin?token='+ this.token,data);
  }

  updateUser(id,data){
    return this.http.post( this.API_URI + '/admin/' + id + '?token='+ this.token ,data);
  }

  oneDelete(id){
    return this.http.post( this.API_URI +'/admin/' + id ,{'_method':'DELETE','token' : this.token });
  }

}
