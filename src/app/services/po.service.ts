import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
@Injectable()
export class PoService {

  constructor(
    private http : HttpClient,
    private auth : AuthService
  ) { }

  private api = this.auth.path_api() + '/materials-po';
  private token = 'token=' + this.auth.token();

  index(){
      return this.http.get( this.api + '?' + this.token )
  }

  create(){
    return this.http.get( this.api + '/create?' + this.token )
  }

  edit(id){
    return this.http.get( this.api + '/' + id + '/edit?' + this.token )
  }

  show(id){
    return this.http.get( this.api + '/' + id + '?' + this.token )
  }

  destroy(id,type){
    let params = { _method : 'DELETE', token : this.auth.token(),type : type }
    return this.http.post( this.api + '/' + id, params )
  }

  store(param){
    param.token = this.auth.token();
    return this.http.post( this.api , param )
  }

  update(id,param){
    param.token = this.auth.token();
    param._method = 'PUT';
    return this.http.post( this.api + '/' + id ,param)
  }

  onExport(id){
    return this.http.get( this.api + '/' + id + '/edit?' + this.token )
  }


}
