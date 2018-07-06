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
  page:any=[];
  cpage:number=1;
  lpage:number=1;
  keyword:any = {};
  isFilter:boolean=false;
  field:any=[];

  opts:any = [       
    { field : 'no', name : 'NO'},
    { field : 'to', name :'TO'},
  ];

  constructor(
    private auth:AuthService,
    private modalService: BsModalService,
    private frm :FormBuilder,
    private po : PoService
  ) { 
    this.auth.online();
    this.frmFilter = this.frm.group({
      field : ['no'],
      keywords : [''],
      onStart : [''],
      onEnd:['']
    });
  }

  ngOnInit() {
    this.fetchAll('');
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
    //}
    this.modalRef.hide();

  }
  setParam(){
    let keyword = this.frmFilter.get('keywords').value;
    let field   = this.frmFilter.get('field').value;
    let onStart = this.frmFilter.get('onStart').value;
    let onEnd   = this.frmFilter.get('onEnd').value;
    this.isFilter = ( onStart || keyword.length > 0 ) ? true : false;
    return '&field='    + field
            +  '&keywords=' + keyword
            +  '&onStart='  + (onStart ? this.Ymd(onStart) : '')
            +  '&onEnd='    + (onEnd ? this.Ymd(onEnd) : '');
  }

  fetchAll(param){
    this.page = [];

    this.po.index(param).subscribe((res) => {
          if( res['code'] ){
            this.rows = res['data'];
            //console.log('fetch all result ' , this.rows );
            this.cpage  = res['cpage'];
            this.lpage = res['lpage'];
            //console.log('spec model rows ', this.rows );
            for(let p=1; p <= parseInt( res['lpage'] ); p++ ){
              this.page.push( p );
            }     
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
    
    this.po.destroy(getId.join('-'),'head').subscribe((response) => {
      if (response['code'] == 200 ) {
        this.fetchAll('');
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
