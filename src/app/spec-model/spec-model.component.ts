import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';

import { HttpClient } from '@angular/common/http'

import { AuthService } from '../services/auth.service';
import { Base } from '../services/app.service';


@Component({
  selector: 'app-spec-model',
  templateUrl: './spec-model.component.html',
  styleUrls: ['./spec-model.component.scss']
})
export class SpecModelComponent implements OnInit {
  row:any={};
  rows:any;
  api = Base.API_URI;
  token = localStorage.getItem('token');
  public loading = false;
  selectAll:boolean = false;
  onSelect:boolean = false;
  constructor(
    private http:HttpClient,
    private auth:AuthService
  ) { }

  ngOnInit() {
    this.getAll();
    this.auth.online();
  }
  
  getAll(){
    this.loading = true;
    this.http.get( this.api + '/spec-model?token=' + this.token ).subscribe((data)=>{
        this.rows = data['data'];
        this.loading = false;
        console.log('spec model rows ', this.rows );

    },
    err => {
      console.log( err );
      this.loading = false;
    })
  }
  onDelete(id){
    if(!confirm('Please confirm delete'))
        return false;

    this.http.post( this.api + '/spec-model/'+ id + '?token=' + this.token,{_method:'DELETE'}).subscribe((response)=>{
      if( response['result']== 'successful'){
        this.getAll();
      }else{ 
        alert(response['msg']);
      }
    });
  }
  multiDelete(){
    if (!confirm('Please confirm delete'))
      return false;

    let getId:any = [];
    for (var i = 0; i < this.rows.length; i++) {
      if( this.rows[i].selected == true){
        console.log('rows value : ', this.rows[i] );
        getId.push( this.rows[i].id );
      }
    }
    console.log('getId : ', getId ,' join is  ' , getId.join('-') );

    this.http.post( this.api + '/spec-model/'+  (getId.join('-')) + '?token=' + this.token,{_method:'DELETE'}).subscribe((response) => {
      if (response['result'] == 'successful') {
        this.getAll();
      } else {
        alert(response['msg']);
      }
    });
  }



  onSelectAll(){
    for (var i = 0; i < this.rows.length; i++) {
      console.log( i , '( ', this.rows[i].selected ,')');
      this.rows[i].selected = this.selectAll;
    }
  }

  checkIfAllSelected() {
    this.selectAll = this.rows.every(function (item: any) {
      return item.selected == true;
    })
  }

}
