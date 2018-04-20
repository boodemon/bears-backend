import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { BsModalService,BsModalRef } from 'ngx-bootstrap';
import { HttpClient } from '@angular/common/http'

import { AuthService } from '../services/auth.service';
import { Base } from '../services/app.service';


@Component({
  selector: 'app-spec-model',
  templateUrl: './spec-model.component.html',
  styleUrls: ['./spec-model.component.scss']
})
export class SpecModelComponent implements OnInit {
  [x: string]: any;
  row:any={};
  rows:any;
  api = Base.API_URI;
  token = localStorage.getItem('token');
  public loading = false;
  selectAll:boolean = false;
  onSelect:boolean = false;
  opts:any = [       
        { field : 'spec_no', name : 'SPEC NO'},
        { field : 'type', name :'TYPE'},
        { field : 'material', name :'MATERIAL'},
        { field : 'color', name :'COLOR'},
        { field : 'filler', name :'FILLER'},
        { field : 'double_filler', name :'DOUBLE FILLER'},
        { field : 'lining', name :'LINING'},
        { field : 'stitch', name :'STITCH'},
        { field : 'paint', name :'PAINT'},
        { field : 'buckle', name :'BUCKLE'},
        { field : 'keeper', name :'KEEPER'},
        { field : 'keeper_type', name :'KEEPER TYPE'},
        { field : 'keeper_width', name :'KEEPER WIDTH'},
        { field : 'keeper_stich', name :'KEEPER STITCH'},
        { field : 'keeper2', name :'KEEPER2'},
        { field : 'keeper2_type', name :'KEEPER2 TYPE'},
        { field : 'keeper2_width', name :'KEEPER2 WIDTH'},
        { field : 'keeper2_stitch', name :'KEEPER2 STITCH'},
        { field : 'punch_hole_kensaki', name :'PUNCH HOLE KENSAKI'},
        { field : 'punch_hole_dia', name :'PUNCH HOLE KENSAKI DIA.'},
        { field : 'bijow_width', name :'BIJOW:WIDTH'},
        { field : 'punch_hole_length', name :'LENGTH(BIJOW)'},
        { field : 'size_tip', name :'SIZE/TIP'},
        { field : 'model_length', name :'LENGTH'},
        { field : 'total_thickness', name :'TOTAL THICKNESS'},
        { field : 'kanmoto_thickness', name :'KANMOTO THICKNESS'},
        { field : 'edge_thickness', name :'EDGE THICKNESS'},
        { field : 'matal_part', name :'PLASTIC PART'},
        { field : 'metal_keeper', name :'METAL KEEPER'},
        { field : 'end_piece_inside', name :'END PIECE (INSIDE)'},
        { field : 'end_piece_outside', name :'END PIECE (OUTSIDE)'},
        { field : 'eyelet', name :'EYELET'},
        { field : 'spring_bar', name :'SPRING BAR'},
        { field : 'cylinder', name :'CYLINDER (SS PIPE)'},
        { field : 'stamping', name :'STAMPING'},
        { field : 'remarks', name :'REMARK'}
    ];
  frmSearch:FormGroup;
  constructor(
    private http:HttpClient,
    private auth:AuthService,
    private modalService: BsModalService,
    private frm :FormBuilder
  ) { }

  ngOnInit() {
    this.getAll();
    this.auth.online();
    this.frmSearch = this.frm.group({
      field:['spec_no'],
      keywords:['']
    });
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
  onFilter(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  doSearch(){
    console.log( this.frmSearch.value );
    this.rows = [];
    let search =  '?field=' + this.frmSearch.get('field').value
               +  '&keywords=' + this.frmSearch.get('keywords').value 
               +  '&token=' + this.token;
    this.http.get( this.api + '/spec-model' + search ).subscribe((data)=>{
        this.rows = data['data'];
        this.loading = false;
        console.log('spec model rows ', this.rows );

    },
    err => {
      console.log( err );
      this.loading = false;
    })
  this.modalRef.hide();
  }
  exportPdf(id){
      this.http.get( this.auth.path_api() + '/spec-model/export-pdf/' + id +'?token=' + this.token ).subscribe((res) =>{

      },
    (err) => {
      alert('Error !!' + JSON.stringify(err) );
    })
  }
  exportXls(id){
    this.http.get( this.auth.path_api() + '/spec-model/export-xls/' + id  +'?token=' + this.token ).subscribe((res) =>{

    },
  (err) => {
    alert('Error !!' + JSON.stringify(err) );
  })
}
}
