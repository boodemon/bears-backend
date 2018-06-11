import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService} from '../services/auth.service';
@Injectable()
export class SpeceService {
  api = this.auth.path_api();
  constructor(private http:HttpClient,private auth:AuthService) { }
  token = 'token=' + this.auth.token();
  allSpec(searchText:string){
    return this.http.get( this.api + '/search/model?term=' + searchText + '&token=' + this.auth.token() );
  }

  onField(fields,terms){
    let param = { fields:fields,term:terms,token:this.auth.token() };
    return this.http.post( this.api + '/spec-model/search',param);
  }

  onNew(param:any){
    return this.http.post( this.api + '/spec-model',param);
  }

  onUpdate($id,param:any){
    return this.http.post( this.api + '/spec-model/' + $id ,param);
  }

  queryOne($id){
    return this.http.get( this.api + '/spec-model/' + $id + '?' + this.token );
  }
}
