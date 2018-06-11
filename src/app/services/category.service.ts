import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { AuthService } from './auth.service';
@Injectable()
export class CategoryService {
  api = this.auth.path_api();
  token = window.localStorage.getItem('token');

  constructor(
    private http:HttpClient,
    private router:Router,
    private auth:AuthService
  ) { }

  getAll(){
    return this.http.get( this.api + '/category?token='+this.token );
  }
  getEdit(id){
    return this.http.get(this.api + '/category/' + id + '/edit?token=' + this.token );
  }

  postNew(data){
    return this.http.post( this.api + '/category',data);
  }

  postUpdate(id, data){
    return this.http.post( this.api + '/category/' + id , data );
  }

  getDelete(id){
    return this.http.post(this.api + '/category/' + id + '?token=' + this.token ,{_method:'DELETE'});
  }

}
