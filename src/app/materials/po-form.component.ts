import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { PoService } from '../services/po.service';
import { MaterialsService } from '../services/materials.service';

@Component({
  selector: 'app-po-form',
  templateUrl: './po-form.component.html',
  styleUrls: ['./po-form.component.scss']
})
export class PoFormComponent implements OnInit {
  private fields: Array<any> = [];
  newSet:Array<any> = [];
  headField:any   = {};
  eIndex:number   = 0;
  orderId:number  = 0;
  newRow:any      = {};
  head:any        = {};
  searches:any    = [];
  specModel:any   = [];

  isEdit:boolean      = false;
  isActive:boolean    = false;
  isPrinter:boolean   = false;
  isPoSearch:boolean  = false;

  constructor(
    private frm: FormBuilder,
    private route: ActivatedRoute,
    private router:Router,
    private auth:AuthService,
    private materials: MaterialsService,
    private po : PoService
  ) { 
      this.auth.online();
      this.route.params.subscribe( params => {
        this.orderId = params.id !== undefined ? params.id : 0;
        this.isPrinter = params.print !== undefined ? true : false;
        console.log('params => ', params,' id = ', params.id ,' print = ', params.print , ' order id = ', this.orderId );
      });
  }

  ngOnInit() {
    this.newRow.qty_unit = 'set';
    this.fetchShow();
  }
  fetchShow(){
    if( this.orderId != 0){
      this.po.show(this.orderId).subscribe((res) => {
          if( res['code'] == 200 ){
              let data = res['data'];
              if( data.status == 1){
                this.isActive = true;
              }
              this.headField = {
                dated_at : data['onDate'],
                no : data['no'],
                to : data['to']
              }
              for(let i = 0; i <= (data['detail'].length -1 ); i++){
                  let item = [];
                  item = data['detail'][i];
                  console.log('item is ' , item );
                  console.log('item sheets is ' , item['sheets'] );
                // item.push( item['sheets'] );
                if(item && item['sheets'])
                  this.fields.push( this.setVal( item['sheets'], item ) );
              }
                console.log('sheet', this.fields)
                console.log('data = ', data );
              if( this.isPrinter ){
                setTimeout(function(){
                  window.print();
                },1000);
                setTimeout(function(){
                    //this.locate.back();
                    window.history.back();
                },1500);
              }
          }
      },
    (err) => {
      alert('Error!! ' + JSON.stringify( err ) );
    });
    }
  }

  onSearch(input,event){
      //console.log('event is ', event );
      let term = event;
      this.searches = [];
      if( term.length >= 1 && term !== null){
      this.materials.onSearch(input,term,4).subscribe((res)=>{
        let data = res['data'] ;
        this.specModel = res['data'];
        for(let x = 0; x < data.length; x++){
          let specNo = data[x]['spec_no'];
          if( input == 'spec' ){
            this.searches.push(specNo['name'] + '  ' + specNo['descript'] + '('+ data[x]['order_prefix'] + '-' + data[x]['order_number'] +')');
          }
          if( input == 'order' ){
            let head = data[x]['header'];
            this.searches.push( data[x]['order_prefix'] + '-' + data[x]['order_number'] +'('+ specNo['name'] + '  ' + specNo['descript'] +')');
          }
        }
        //console.log(' this.searches = ' , this.searches );
      },
      (err)=>{
          alert('Error!!'+ JSON.stringify(err) );
      });
      }else{
          this.searches = [];
      }
  }

  searchPo(event){
    let term = event;
    this.searches = [];
    if( term.length >= 1 && term !== null){
      this.materials.searchPo(term,4).subscribe((res)=>{
        let data = res['data'] ;
        this.specModel = data;
        for(let x = 0; x < data.length; x++){
          let header = data[x];
            this.searches.push(header['po_no'] );
        }
      },
      (err)=>{
          alert('Error!!'+ JSON.stringify(err) );
      });
    }else{
        this.searches = [];
    }

  }
  showDate(onDate){
    console.log('onDate is ', onDate );
    if( onDate == '0000-00-00' ) return '-';
    return onDate;
  }

  deliYmd(addDate){
    let startDate = new Date();
    var returnDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + addDate,
          startDate.getHours(),
          startDate.getMinutes(),
          startDate.getSeconds());
    return returnDate;
  }

  setField(field,index,node){
    if( field == 'newRow'){
        this.isPoSearch = false;
        let item        = this.specModel[index];
        this.newRow     = this.setVal(item,this.newRow);
    }

    if( field == 'poNo'){
      this.isPoSearch = true;
      let sheets      = this.specModel[index]['sheets'];
      let head        = this.specModel[index];
      console.log('head is ', head);
      this.newRow.po_no = head.po_no;
      this.newSet     = sheets;
      for(let i=0; i <= sheets.length-1; i++){
          this.newSet[i].quantity = 1; 
          this.newSet[i] = this.setVal( sheets[i] , this.newSet[i] );
      }
    }
  }

  setVal(item,n){
    console.log( 'data item ' , item, ' n ' , n );
    this.searches = [];
    let onDate = n.onDate ? n.onDate : '';
    let kmg_date_required = n.kmg_date_required ? n.kmg_date_required : '';
    let customer_date_required = n.customer_date_required ? n.customer_date_required : '';
    let quantity = n.quantity ? n.quantity : item['quantity'];
    let unit_price_hk = n.unit_price_hk ? n.unit_price_hk : '';
    let import_invoice = n.import_invoice ? n.import_invoice : '';
    let balance_quantity = n.balance_quantity ? n.balance_quantity : '';
    let qty_unit = n.qty_unit ? n.qty_unit : 'set';
    let sheet_id = (item['sheet_id'] !== undefined ? item['sheet_id'] : item['id'] );

    return {
      id:(n.id !== undefined ? n.id : 0),
      for_order : item.order_prefix + '-' + item.order_number,
      for_model : item['spec_no'] ? item['spec_no'].name : '',
      description : item['buckle'] ? item['buckle'].name : '',
      kmg_date_required : kmg_date_required,
      customer_date_required : customer_date_required,
      quantity : quantity,
      qty_unit : qty_unit,
      unit_price_hk :unit_price_hk,
      import_invoice :import_invoice,
      onDate : onDate,
      balance_quantity :balance_quantity,
      sheet_id :sheet_id,
    }
  }

  newfield(){
    return {
      id:0,
      for_order :'',
      for_model :'',
      description : '',
      kmg_date_required :'',
      customer_date_required :'',
      quantity : '',
      qty_unit : 'set',
      unit_price_hk :'',
      import_invoice :'',
      onDate :'',
      balance_quantity :'',
      sheet_id :'',
    };
  }

  validate(){
    let result = 'true';
    let itm = this.newRow;
    if( this.isPoSearch == false ){
        if( itm.for_order == '' || itm.for_order === undefined){
          alert('Please enter For Order');
          result = 'false';
        }else if( itm.for_model == '' || itm.for_model === undefined){
          alert('Please enter For Model');
          result = 'false';
        }else if( itm.customer_date_required == '' || itm.customer_date_required === undefined){
          alert('Please enter CUSTOMER DATE REQUIRED');
          result = 'false';
        }else if( itm.kmg_date_required == '' || itm.kmg_date_required === undefined){
          alert('Please enter KMG DATE REQUIRED');
          result = 'false';
        }else if( itm.customer_date_required == '' || itm.customer_date_required === undefined){
          alert('Please enter Customer Date Required');
          result = 'false';
        }else if( itm.quantity == '' || itm.quantity === undefined){
          alert('Please enter quantity');
          result = 'false';
        }
    }
    return result;
  }

  headValidate(){
    let result = 'true';
    let itm = this.headField;
        if( itm.dated_at == '' || itm.dated_at === undefined){
          alert('Please enter DATE');
          result = 'false';
        }else if( itm.to == '' || itm.to === undefined){
          alert('Please enter TO');
          result = 'false';
        }else if( itm.no == '' || itm.no === undefined){
          alert('Please enter NO');
          result = 'false';
        }
    
    return result;  
  }

  checkSome(sheet_id){
      let fields = this.fields;
      let x:number = 0;
      for(let i = 0; i<= (fields.length - 1); i++){
          console.log('fields = ', fields[i].sheet_id +'|'+ sheet_id );
          if( sheet_id == fields[i].sheet_id )
            x++;
      }
      console.log('result x ', x);
      return x;
  }

  clearRow(){
    this.newRow = this.newfield();
    this.isEdit = false;
    this.newSet = [];
    this.isPoSearch = false;
  }

  addRow() {
    let itm = this.newRow;
    console.log('itm value => ' , itm );
    if( this.validate() == 'true' ){
      if( this.isPoSearch == false ){
          this.fields.push(this.newRow)
      }else{ 
        for(let i=0; i<= this.newSet.length-1; i++){
          console.log(this.newSet[i])
          let chk = this.checkSome( this.newSet[i].sheet_id );
          if(chk == 0)
          this.fields.push( this.newSet[i] );
        }
          this.isPoSearch = false;
      }
      this.newRow = this.newfield();
      this.isEdit = false;
      console.log( 'this field is ', this.fields );
    }else{
      return false;
    }
  }

  updateRow(){
    let itm = this.newRow;
    console.log('itm value => ' , itm );
    if( this.validate() == 'true' ){
      this.fields[this.eIndex] = this.newRow;
      this.newRow = this.newfield();
      this.isEdit = false;
      this.eIndex = 0;
    }
  }

  removeRow(index) {
    let sheetId = this.fields[index].id;
    console.log('remove id ' , this.fields[index] );
    if( sheetId != 0){
      if( confirm('Please confirm delete this') ){
          this.po.destroy(sheetId,'row').subscribe((res)=>{
              if( res['code'] == 200 ){
                this.fields.splice(index, 1);
              }
          },
        (err) =>{
          alert('Error !! ' + JSON.stringify(err));
        });
      }
    }else{
      this.fields.splice(index, 1);
    }

  }

  editRow(idx){
    let field = this.fields[idx];
    console.log( 'field edit ', field );
    this.newRow = this.fields[idx];
    this.isEdit = true;
    this.eIndex = idx;

  }

  goBack(){
    this.router.navigate(['/materials/po']);
  }

  onPrint(){
    this.isPrinter    = true;
    window.print();
    setTimeout(function(){
      this.isPrinter  = false;
    },1000);
  }

  onSubmit(){
      this.headField.status = this.isActive;
      let param = {
        data: this.fields,
        head:this.headField,
      };
      let access;
      if(  this.orderId != 0 ){
          access = this.po.update(this.orderId,param);
      }else{
          access = this.po.store(param);
      }
      if( this.headValidate() == 'true' )
      access.subscribe((res) =>{
        console.log('submit result ' , res );
        if( res['code'] == 200 ){
          this.router.navigateByUrl('/materials/po');
        }
      },
      (error) => {
        alert('Error !! ' + JSON.stringify( error ) );
      });
  }

  onExport(){
      this.po.onExport( this.orderId ).subscribe(res => {
        console.log('export result ' , res );
        if( res['code'] == 200){
          window.location.href = res['file'];
        }
      },
      err => {
        alert('Error !! ' + JSON.stringify( err ));
      })
  }

}
