import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AuthService } from '../services/auth.service';
import { MaterialsService } from '../services/materials.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  private fields: Array<any> = [];
  newSet:Array<any> = [];
  eIndex:number = 0;
  orderId:number = 0;
  newRow:any={};
  head:any={};
  searches:any = [];
  specModel:any=[];

  isEdit:boolean      = false;
  isActive:boolean    = false;
  isPrinter:boolean   = false;
  isPoSearch:boolean  = false;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private auth:AuthService,
    private frm: FormBuilder,
    private materials: MaterialsService,
    private locate: Location
  ){
      this.auth.online();
      this.route.params.subscribe( params => {
        this.orderId = params.id !== undefined ? params.id : 0;
        this.isPrinter = params.print !== undefined ? true : false;
        console.log('params => ', params );
      });
  }

  ngOnInit() {
    this.onData();
  }

  onData(){
    if( this.orderId != 0){
      this.materials.onShow(this.orderId).subscribe((res) => {
          if( res['code'] == 200 ){
              let data = res['data'];
              let head = res['head'];
              if( head.status == 1){
                this.isActive = true;
              }
              for(let i = 0; i <= (data.length -1 ); i++){
                let item = [];
                item = data[i];
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
      this.materials.onSearch(input,term,2).subscribe((res)=>{
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
      this.materials.searchPo(term,2).subscribe((res)=>{
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

  deliYmd(){
    let startDate = new Date();
    var returnDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()+10,
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
      let deli        = this.deliYmd();
      this.newSet     = sheets;
      for(let i=0; i <= sheets.length-1; i++){
          this.newSet[i].delivery = deli;
          this.newSet[i].quantity = 1; 
          this.newSet[i] = this.setVal( sheets[i] , this.newSet[i] );
          //this.newSet.push( this.setVal(sheets['sheets'][i],this.newSet[i] ) );
          console.log('i = ', i ,' | ',  deli ,' | ', sheets[i]);
      }
    }
  }

  objVal(obj){
    if( obj === undefined || obj ==='' || obj === null ){
      return '';
    }else {
      return obj;
    }
  }

  setVal(item,n){
    console.log( 'data item ' , item, ' n ' , n );
    this.searches = [];
    let delivery = n.delivery ? n.delivery : this.deliYmd();
    let quantity = n.quantity ? n.quantity : 1;
    //let sheet_id = 0;
    /*
    if( this.isPoSearch == true ){
        sheet_id = item['id'];
    }else {
    */
    let sheet_id = (item['sheet_id'] !== undefined ? item['sheet_id'] : item['id'] );
   // }
    return {
      id:(n.id !== undefined ? n.id : 0),
      mhead:this.orderId,
      delivery:delivery,
      quantity:quantity,
      order : item.order_prefix + '-' + item.order_number,
      sheet_id: sheet_id,
      head_id:(item['head_id'] !== undefined ? item['head_id'] : 0 ),
      type : item['type'] ? item['type'].name : '',
      material:item['material'] ? item['material'].name : '',
      color:item['color'] ? item['color'].name : '',
      size:item['size_tip'] ? item['size_tip'].name : '',
      spec_name:item['spec_no'] ? item['spec_no'].name : '',
      spec_descript:item['spec_no'] ? item['spec_no'].descript : '',
      lining:item['lining'] ? item['lining'].name : '',
      filler:item['filler'] ? item['filler'].name : '',
      metal_keeper:item['metal_keeper'] ? item['metal_keeper'].name : '',
      spring_bar:item['spring_bar'] ? item['spring_bar'].name : '',
      cylinder:item['cylinder'] ? item['cylinder'].name : '',
      end_piece_inside:item['end_piece_inside'] ? item['end_piece_inside'].name : '',
      end_piece_outside:item['end_piece_outside'] ? item['end_piece_outside'].name : '',
      eyelet:item['eyelet'] ? item['eyelet'].name : '',
      buckle:item['buckle'] ? item['buckle'].name : '',
    }
  }

  newfield(){
    let cn:number = this.fields.length;
    let ordPrefix = '';
    let ordNo = 0;
    let delivery = '';
    if( cn > 0 ){
      let field = this.fields[ cn - 1 ];
      delivery      = field.delivery;

    }
    return {
      id:0,
      delivery:'',
      quantity:'',
      order : '',
      sheet_id:'',
      spec_id:'',
      type : '',
      material:'',
      color:'',
      size:'',
      spec_name:'',
      spec_descript:'',
      lining:'',
      filler:'',
      metal_keeper:'',
      spring_bar:'',
      cylinder:'',
      end_piece_inside:'',
      end_piece_outside:'',
      eyelet:'',
      buckle:'',
    };
  }
  validate(){
    let result = 'true';
    let itm = this.newRow;
    if( this.isPoSearch == false ){
        if( itm.order == '' || itm.order === undefined){
          alert('Please enter Order');
          result = 'false';
        }else if( itm.spec_name == '' || itm.spec_name === undefined){
          alert('Please enter Model');
          result = 'false';
        }else if( itm.delivery == '' || itm.delivery === undefined){
          alert('Please enter order delivery date');
          result = 'false';
        }else if( itm.quantity == '' || itm.quantity === undefined){
          alert('Please enter quantity');
          result = 'false';
        }
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
          this.materials.onDestroy(sheetId,'row').subscribe((res)=>{
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
    this.router.navigate(['/materials']);
  }
  onPrint(){
    window.print();
  }
  onSubmit(){
      let method = this.orderId != 0 ? 'PUT' : 'POST';
      this.head.status = this.isActive;
      let param = {
        _method:method,
        id:this.orderId,
        data: this.fields,
        token:this.auth.token(),
        head:this.head,
      };
      let access;
      if( method == 'PUT'){
          access = this.materials.onUpdate(this.orderId,param);
      }else{
          access = this.materials.onStore(param);
      }
      access.subscribe((res) =>{
        console.log('submit result ' , res );
        if( res['code'] == 200 ){
          this.router.navigateByUrl('/materials');
        }
      },
      (error) => {
        alert('Error !! ' + JSON.stringify( error ) );
      });
  }
  onExport(){
      this.materials.onExport( this.orderId ).subscribe(res => {
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
