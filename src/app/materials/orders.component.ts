import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { BsModalService,BsModalRef } from 'ngx-bootstrap';
import { HttpClient } from '@angular/common/http'
import { AuthService } from '../services/auth.service';
import { MaterialsService } from '../services/materials.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  filter:boolean=false;
  field:any=[];
  frmFilter:FormGroup;
  modalRef:BsModalRef;
  rows:any=[];
  selectAll:boolean = false;

  constructor(
    private http:HttpClient,
    private auth:AuthService,
    private modalService: BsModalService,
    private frm :FormBuilder,
    private materials: MaterialsService
  ) { 
    this.auth.online();
  }

  ngOnInit() {
    this.frmFilter = this.frm.group({
      field:['spec_no'],
    });
    this.fetchAll();
  }
  
  onFilter(template: TemplateRef<any>){
    this.filter = false;
    this.modalRef = this.modalService.show(template);
  }
  fetchAll(){
      this.materials.onIndex().subscribe((res) => {
        this.rows = res['data'];
      },
    (err) => {
      alert('Error!! ' + JSON.stringify( err ) );
    });
  }
  onDelete(id){
    if( confirm('Plese confirm delete this') )
    this.materials.onDestroy(id,'head').subscribe(res => {
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

    this.materials.onDestroy(getId.join('-'),'head').subscribe((response) => {
      if (response['result'] == 'successful') {
        this.fetchAll();
      } else {
        alert(response['msg']);
      }
    });
  }
  onExport(id){
      this.materials.onExport( id ).subscribe(res => {
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
