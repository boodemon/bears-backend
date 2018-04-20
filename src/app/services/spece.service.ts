import { Injectable } from '@angular/core';
import { Base } from '../services/app.service';
import { HttpClient } from '@angular/common/http';
import { AuthService} from '../services/auth.service';
@Injectable()
export class SpeceService {
  api = Base.API_URI;
  constructor(private http:HttpClient,private auth:AuthService) { }
  token = 'token=' + this.auth.token();
  allSpec(searchText:string){
    return this.http.get( this.api + '/search/model?term=' + searchText + '&token=' + this.auth.token() );
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
