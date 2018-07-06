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
  page:any=[];
  cpage:number=1;
  lpage:number=1;
  keyword:any = {};
  isFilter:boolean=false;

  constructor(
    private http:HttpClient,
    private auth:AuthService,
    private modalService: BsModalService,
    private frm :FormBuilder,
    private materials: MaterialsService
  ) { 
    this.auth.online();
    this.frmFilter = this.frm.group({
      onStart : [''],
      onEnd:['']
    });
  }

  ngOnInit() {
      this.fetchAll('');
  }
  
  Ymd(inDate){
    let startDate = new Date(inDate);
    let months = startDate.getMonth()+1;
    let month = months.toString();
    var returnDate = startDate.getFullYear() 
                  + '-' +   ( month.length == 1 ? '0'+month : month )
                  + '-' +   startDate.getDate();
    return returnDate.toString();
  }
  
  onPage(page){
    console.log('page is ', page );
    let onStart   = this.frmFilter.get('onStart').value;
    let param = '';
    if( page > 0 && this.page.length >= page ){
        if( onStart.length > 0 ){
            param += this.setParam();
        }
        param += '&page=' + page;
        this.page = [];
        this.fetchAll(param);
        window.scroll(0,0);
    }
    
  }

  onFilter(template: TemplateRef<any>){
    this.isFilter = false;
    this.modalRef = this.modalService.show(template);
  }

  doSearch(){
        let param = this.setParam();
        console.log('param is ' , param );
        this.fetchAll(param);
        this.keyword = this.frmFilter.value;
        console.log('search and result ' , this.frmFilter.value );
        this.modalRef.hide();
  }

  setParam(){
    let onStart   = this.frmFilter.get('onStart').value.toString();
    let onEnd     = this.frmFilter.get('onEnd').value.toString();
    this.isFilter = onStart ? true : false;
    return '&onStart='  + (onStart ? this.Ymd(onStart) : '')
          +  '&onEnd='    + (onEnd ? this.Ymd(onEnd) : '');
  }

  fetchAll(param){
    this.page = [];
    this.materials.onIndex(param).subscribe((res) => {
        this.rows   = res['data'];
        this.cpage  = res['cpage'];
        this.lpage  = res['lpage'];
        for(let p=1; p <= parseInt( res['lpage'] ); p++ ){
          this.page.push( p );
        }
      },
    (err) => {
      alert('Error!! ' + JSON.stringify( err ) );
    });
  }

  onDelete(id){
    if( confirm('Plese confirm delete this') )
    this.materials.onDestroy(id,'head').subscribe(res => {
      if( res['code'] == 200 ){
        this.fetchAll('');
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
        this.fetchAll('');
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
