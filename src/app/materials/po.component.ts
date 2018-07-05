import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { BsModalService,BsModalRef } from 'ngx-bootstrap';
import { AuthService } from '../services/auth.service';
import { PoService } from '../services/po.service';

@Component({
  selector: 'app-po',
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.scss']
})
export class PoComponent implements OnInit {
  filter:boolean=false;
  fields:any=[];
  frmFilter:FormGroup;
  modalRef:BsModalRef;
  rows:any=[];
  selectAll:boolean = false;


  constructor(
    private auth:AuthService,
    private modalService: BsModalService,
    private frm :FormBuilder,
    private po : PoService
  ) { 
    this.auth.online();
    this.frmFilter = this.frm.group({
      field:['spec_no'],
    });
  }

  ngOnInit() {
    this.fetchAll();
  }

  onFilter(template: TemplateRef<any>){
    this.filter = false;
    this.modalRef = this.modalService.show(template);
  }

  fetchAll(){
      this.po.index().subscribe((res) => {
          if( res['code'] ){
            this.rows = res['data'];
            console.log('fetch all result ' , this.rows );
          }
      },
      (err) => {
        alert('Error!!' + JSON.stringify( err ) );
      })
  }
  onDelete(id){
    if( confirm('Plese confirm delete this') )
    this.po.destroy(id,'head').subscribe(res => {
      if( res['code'] == 200 ){
        this.fetchAll();
      }
    },
    (err) =>{
      alert('Error !! ' + JSON.stringify(err));

    });
  }

  multiDelete(){
    if (!confirm('Please confirm delete'))
      return false;

    let getId:any = [];
    for (var i = 0; i < this.rows.length; i++) {
      if( this.rows[i].selected == true){
        //console.log('rows value : ', this.rows[i] );
        getId.push( this.rows[i].id );
      }
    }
    
    this.po.destroy(getId.join('-'),'head').subscribe((response) => {
      if (response['code'] == 200 ) {
        this.fetchAll();
      } else {
        alert(response['msg']);
      }
    });
  }
  
  onExport(id){
      this.po.onExport( id ).subscribe(res => {
        console.log('export result ' , res );
        if( res['code'] == 200){
          window.location.href = res['file'];
        }
      },
      err => {
        alert('Error !! ' + JSON.stringify( err ));
      })
  }

  onSelectAll(){
    for (var i = 0; i < this.rows.length; i++) {
      //console.log( i , '( ', this.rows[i].selected ,')');
      this.rows[i].selected = this.selectAll;
    }
  }

  checkIfAllSelected() {
    this.selectAll = this.rows.every(function (item: any) {
      return item.selected == true;
    })
  }
}
