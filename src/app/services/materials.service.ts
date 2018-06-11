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

  onSearch(type,term){
      return this.http.get( this.api + '-search/' + type + '?term=' + term  + '&' + this.token )
  }
}
