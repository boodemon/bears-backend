import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
@Injectable()
export class OrderSheetService {

  constructor(
    private auth:AuthService,
    private http:HttpClient
  ) { }
  token:string = '?token=' + this.auth.token();
  api   = this.auth.path_api() + '/order-sheet';
  param = '?token=' + this.token;

  fatchAll(params){
    return this.http.get( this.api  + this.token );
  }

  fatchOne(id){
    return this.http.get( this.api + '/' + id + this.token );
  }

  store( params ){
      return this.http.post( this.api , params );
  }

  update( id, params ){
      return this.http.post( this.api  + '/' + id , params );
  }

  destroy(id,type){
    let param = {
      token : this.auth.token(),
      _method:'DELETE',
      type:type
    };
    return this.http.post( this.api +'/' + id , param );
  }

  export(form,id){
    return this.http.get( this.api + '/export/' + form + '/' + id + this.token );
  }

}
