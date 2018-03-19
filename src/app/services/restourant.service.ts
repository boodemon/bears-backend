import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Base } from './app.service';

@Injectable()
export class RestourantService {
  api   = Base.API_URI;
  token = window.localStorage.getItem('token');


  constructor(
    private http:HttpClient,
    private router:Router
  ) { }
  getAll() {
    return this.http.get(this.api + '/restourant?token=' + this.token );
  }
  getEdit(id) {
    return this.http.get(this.api + '/restourant/' + id + '/edit?token=' + this.token);
  }

  postNew(data) {
    return this.http.post(this.api + '/restourant', data);
  }

  postUpdate(id, data) {
    return this.http.post(this.api + '/restourant/' + id, data);
  }

  getDelete(id) {
    return this.http.post(this.api + '/restourant/' + id, { _method: 'DELETE',token:this.token });
  }
}
