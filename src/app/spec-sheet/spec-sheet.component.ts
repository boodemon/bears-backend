import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OrderSheetService } from '../services/order-sheet.service';
import {Router, ActivatedRoute} from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-spec-sheet',
  templateUrl: './spec-sheet.component.html',
  styleUrls: ['./spec-sheet.component.scss']
})
export class SpecSheetComponent implements OnInit {
  rows:any[]=[];
  sheets:any[]=[];
  chkd:any={};
  loading:boolean=true;
  selectAll:boolean = false;
  page:any=[];
  cpage:number=1;
  lpage:number=1;
  keyword:any = {};
  isFilter:boolean=false;
  field:any=[];

  opts:any = [       
    { field : 'po_no', name : 'PO NO'},
    { field : 'customer', name :'CUSTOMER'},
    { field : 'form_type', name :'FORM TYPE'},
    { field : 'form_name', name :'FORM NAME'},
  ];
  frmSearch:FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private auth:AuthService,
    private order:OrderSheetService,
    private frm : FormBuilder,
    private modalService: BsModalService,
   // private ModalRef:BsModalRef
  ) { 
    this.auth.online();
    this.frmSearch = this.frm.group({
      field : ['po_no'],
      keywords : [''],
      onStart : [''],
      onEnd:['']
    });
  }

  optName(key){
    let opt = this.opts.length;
    let name ='';
    for (let i = 0; i < opt; i++){
      if( this.opts[i].field == key )
        name = this.opts[i].name;
    }
    return name;
  }

  ngOnInit() {
    this.getAll('');
  }

  getAll(param){
    this.rows = [];
    this.sheets = [];
    this.page = [];
    this.loading = true;
    this.order.fatchAll(param).subscribe((res:object) => {

        if( res['code'] == 200 ){
            console.log('order sheet result ', res);
            this.rows = res['data'];
            this.sheets = res['sheets'];
            this.cpage  = res['cpage'];
            this.lpage = res['lpage'];
            this.loading = false;
            console.log('spec model rows ', this.rows );
            for(let p=1; p <= parseInt( res['lpage'] ); p++ ){
              //console.log('p => ', p);
              this.page.push( p );
            }        
        }
    },
    (err) => {
      alert('Error!! ' + JSON.stringify( err ) );
    });
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
    let keyword = this.frmSearch.get('keywords').value;
    let field   = this.frmSearch.get('field').value;
    let onStart   = this.frmSearch.get('onStart').value;
    let onEnd   = this.frmSearch.get('onEnd').value;
    let param = '';
    if( page > 0 && this.page.length >= page ){
        this.rows = [];
        if( keyword.length > 0 ){
            param += '&field='    + field
                  +  '&keywords=' + keyword;
            this.isFilter = true;
        }

        if( onStart.length > 0 ){
            param += '&onStart='  + onStart 
                  +  '&onEnd='    + onEnd;
            this.isFilter = true;
        }
        param += '&page=' + page;
        this.page = [];
        this.getAll(param);
        window.scroll(0,0);
    }
    
  }
  modalRef: BsModalRef;
  onFilter(template: TemplateRef<any>){
    this.isFilter = false;
    this.modalRef = this.modalService.show(template);
  }

  doSearch(){
    let keyword = this.frmSearch.get('keywords').value;
    let field   = this.frmSearch.get('field').value;
    let onStart   = this.frmSearch.get('onStart').value.toString();
    let onEnd   = this.frmSearch.get('onEnd').value.toString();
   // if( keyword.length > 0 || onStart.length > 0 ){
        let param =  '&field='    + field
                  +  '&keywords=' + keyword
                  +  '&onStart='  + (onStart ? this.Ymd(onStart) : '')
                  +  '&onEnd='    + (onEnd ? this.Ymd(onEnd) : '');
        console.log('param is ' , param );
        this.getAll(param);
        this.isFilter = true;
        this.keyword = this.frmSearch.value;
        console.log('search and result ' , this.frmSearch.value );
    //}
    this.modalRef.hide();

  }
  onDelete(id){
    if(!confirm('Please confirm delete'))
        return false;
    this.order.destroy(id,'main').subscribe((response)=>{
      if( response['result']== 'successful'){
        this.getAll('');
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
        //console.log('rows value : ', this.rows[i] );
        getId.push( this.rows[i].id );
      }
    }
    console.log('getId : ', getId ,' join is  ' , getId.join('-') );
    this.order.destroy(getId.join('-'),'main').subscribe((response) => {
      if (response['result'] == 'successful') {
        this.getAll('');
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


  goCard( id ){
    this.router.navigateByUrl('spec-sheet/order-card/' + id);
  }
  onExport( id ){
    this.order.export('order-sheet',id ).subscribe( (res) => {
        if( res['code'] == 200 ){
            window.location.href = res['file'];
        }else{
          alert('Error!! /nCannot export excel file please try again later');
        }
    },
    (err) => {
      alert('Error !!' + JSON.stringify( err ) );
    })
  }


}
