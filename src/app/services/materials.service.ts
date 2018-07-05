import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
@Injectable()
export class MaterialsService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  api = this.auth.path_api() + '/materials';

  private token = 'token=' + this.auth.token();

  onIndex(){
    return this.http.get( this.api + '?' + this.token )
  }

  onShow(id){
    return this.http.get( this.api + '/' + id + '?' + this.token )
  }

  onSearch(type,term,status){
      return this.http.get( this.api + '-search/' + type + '?term=' + term  + '&' + this.token + '&status=' + status  )
  }

  searchPo(term,status){
    return this.http.get( this.api + '-search-po' + '?term=' + term  + '&' + this.token +'&status=' + status )
  }

  onStore(param){
    return this.http.post( this.api,param );
  }

  onUpdate(id, param){
    return this.http.post( this.api + '/' + id, param );
  }

  onDestroy(id,type){
    return this.http.post( this.api + '/' + id ,{_method:'DELETE',token:this.auth.token(),type:type});
  }
  onExport(id){
    return this.http.get( this.api + '/' + id + '/edit?' + this.token )
  }
}
