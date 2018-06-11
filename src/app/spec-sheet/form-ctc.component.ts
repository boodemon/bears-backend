import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule ,FormGroup, FormBuilder,FormArray } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { SpeceService } from '../services/spece.service';
import { OrderSheetService } from '../services/order-sheet.service';

@Component({
  selector: 'app-form-ctc',
  templateUrl: './form-ctc.component.html',
  styleUrls: ['./form-styles.component.scss']
})
export class FormCtcComponent implements OnInit {
  searches: string[] = []; 
  specModel:any=[];
  terms:string[] = [];
  isEdit:boolean = false;
  eIndex:number = 0;
  orderId:number = 0;
  private fields: Array<any> = [];
  private head: any = {};
  private newRow: any = {};

  constructor(
    private frm:FormBuilder, 
    private route: ActivatedRoute,
    private router:Router,
    private auth:AuthService,
    private http: HttpClient,
    private spec:SpeceService,
    private order:OrderSheetService
  ) {
    this.auth.online();
    this.route.params.subscribe( params => {
      console.log('params => ', params.id)
      this.orderId = params.id !== undefined ? params.id : 0;
    });
   }

  ngOnInit() {
    this.formUpdate();
  }
  formUpdate(){
    this.head.status = false;
    if( this.orderId != 0){
      this.order.fatchOne( this.orderId ).subscribe((res) => {
        console.log( res );
        if( res['code'] == 200){
          this.fields = [];
          this.head = {};
          let head = res['data'];
          let sheets = res['sheets'];
          this.head = {
            order_id : head.id,
            name : head.form_name,
            type : 'ctc',
            customer:head.customer,
            po_status:head.po_status
          };
          for(let x = 0; x < sheets.length; x++){
            this.fields.push( this.setVal( sheets[x] ) ) ;
          }
          if( head['po_status'] == 2){
            this.head.status = true;
          }

        }
      },
    (err) => {
      alert('Error!! ' + JSON.stringify( err ) );
    })
    }
  }
  searchNo(event){
    console.log('event is ', event );
    let term = event;
    if( term.length >= 1 && term !== null){
    this.spec.allSpec(term).subscribe((res)=>{
      let data = res['data'];
      this.specModel = data;
      this.searches = [];
      for(let x = 0; x < data.length; x++){
        let specNo = data[x]['spec_no'];
        this.searches.push(specNo['name'] + '  ' + specNo['descript'] );
      }
      console.log(' this.searches = ' + this.searches );
    },
    (err)=>{
      alert('Error!!'+ JSON.stringify(err) );
    });
    }else{
      this.searches = [];
    }
  }

  setField(field,index,node){
    let item = this.specModel[index];
    if( field == 'newRow'){
      this.newRow = this.setVal(item);

    }
    if( field == 'field'){
      this.fields[node] = this.setVal(item);
    }
  }
  objVal(obj){
    let result;
    if( obj === undefined || obj ==='' || obj === null ){
      return '';
    }else {
      return obj;
    }
  }
  setVal(item){
    console.log( 'data json ' , item );
    let n = this.newRow;
    this.searches = [];
    let order_prefix = n.order_prefix;
    let order_number = n.order_number;
    let quant = n.quant;
    let deli = new Date( n.deli );
    if( item.order_id !== undefined && item.order_id != 0){
        order_prefix = item['order_prefix'];
        order_number = item['order_number'];
        quant = item['quantity'];
        deli = item['delivery'];
    }

    return {
      order_prefix:order_prefix,
      order_number:order_number,
      quant:quant,
      deli:deli,
      sheet_id:(item['spec_id'] !== undefined ? item['id'] : 0 ),
      spec_id:(item['spec_id'] === undefined ? item['id'] : item['spec_id'] ),
      type : item['type'] ?  item['type'].name : '',
      material:item['material'] ? item['material'].name : '',
      matal_part:item['matal_part'] ? item['matal_part'].name : '',
      color:item['color'] ? item['color'].name : '',
      cylinder:item['cylinder'] ? item['cylinder'].name : '',
      size:item['size_tip'] ? item['size_tip'].name : '',
      type2:item['size_tip'] ? item['size_tip'].descript : '',
      buckle:item['buckle'] ? item['buckle'].name : '',
      spec_name:item['spec_no'] ? item['spec_no'].name : '',
      spec_descript:item['spec_no'] ? item['spec_no'].descript : '',
      lining:item['lining'] ? item['lining'].name : '',
      spring_bar:item['spring_bar'] ? item['spring_bar'].name : '',
      filler:item['filler'] ? item['filler'].name : '',
      dbl_fill:item['double_filler'] ? item['double_filler'].name : '',
      stitch_no:item['stitch'] ? item['stitch'].name : '',
      pt:item['edge_thickness'],
      hole_k:item['punch_hole_kensaki'],
      hole_b:item['bijow_width'],
      keeper:item['keeper'],
      keeper_type:item['keeper_type'],
      keeper_st:item['keeper_stich'],
      p:item['keeper_stich'] == 'STICH' ? '-' : '/',
      magic_qn:( item['magic_qn'] && item['magic_qn'] == '1QN') ? '<i class="fa fa-check"></i>':'-',
      magic_qm:( item['magic_qm'] && item['magic_qm'] == '2QM') ? '<i class="fa fa-check"></i>':'-'
    }
  }

  newfield(){
    let cn:number = this.fields.length;
    let ordPrefix = '';
    let ordNo = 0;
    let deliv = '';
    if( cn > 0 ){
      let field = this.fields[ cn - 1 ];
      ordPrefix = field.order_prefix;
      ordNo     = parseInt( field.order_number ) + 1;
      deliv      = field.deli;

    }
    return {
      order_prefix:ordPrefix,
      order_number: (ordNo == 0 ? '' : ordNo ),
      sheet_id:0,
      spec_id:0,
      type : '',
      material:'',
      metal_part:'',
      color:'',
      cylinder:'',
      size:'',
      type2:'',
      quant:'',
      buckle:'',
      deli:deliv,
      remarks:'',
      spec_name:'',
      spec_descript:'',
      spring_bar:'',
      lining:'',
      filler:'',
      dbl_fill:'',
      stitch_no:'',
      pt:'',
      hole_k:'',
      hole_b:'',
      keeper:'',
      keeper_type:'',
      keeper_st:'',
      p:'',
      magic_qn:'',
      magic_qm:''
  
    };
  }

  validate(){
    let result = 'true';
    let itm = this.newRow;

    if( itm.order_number == '' || itm.order_number === undefined){
      alert('Please enter order number');
      result = 'false';
    }else if( itm.order_prefix == '' || itm.order_prefix === undefined){
      alert('Please enter order prefix');
      result = 'false';
    }else if( itm.deli == '' || itm.deli === undefined){
      alert('Please enter order delivery date');
      result = 'false';
    }else if( itm.quant == '' || itm.quant === undefined){
      alert('Please enter quant');
      result = 'false';
    }

    return result;
  }
  addRow() {
    let itm = this.newRow;
    console.log('itm value => ' , itm );
    if( this.validate() == 'true' ){
      this.fields.push(this.newRow)
      this.newRow = this.newfield();
      this.isEdit = false;
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
    let sheetId = this.fields[index].sheet_id;
    if( sheetId != 0){
      if( confirm('Please confirm delete this') ){
          this.order.destroy(sheetId,'sheet').subscribe((res)=>{
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
    let n = this.newRow;
    this.eIndex = idx;
    this.newRow = this.fields[idx];
    this.isEdit = true;
  }

  goBack(){
    this.router.navigate(['/spec-sheet']);
  }

  onSubmit(){
      this.head.type = 'ctc';
      if( this.orderId == 0){
          let param = {
            token : this.auth.token(),
            header : this.head,
            detail : this.fields,
            _method:'POST'
          };
          console.log('param => ', param );
          this.order.store( param ).subscribe((res) => {
              console.log('result new ' , res );
              if( res['code'] == 200 ){
                this.router.navigateByUrl('/spec-sheet');
              }
          },
          (err) => {
            alert('Error !! ' + JSON.stringify( err ) );
          });
      }else{
        let param = {
          token : this.auth.token(),
          header : this.head,
          detail : this.fields,
          _method:'PUT'
        };
        console.log('param => ', param );
          this.order.update( this.orderId, param ).subscribe((res) => {
            console.log('result new ' , res );
            if( res['code'] == 200 ){
              //this.router.navigateByUrl('/spec-sheet');
              alert('Update order sheet success full');
              this.formUpdate();
            }
        },
        (err) => {
            alert('Error !! ' + JSON.stringify( err ) );
        });
      }
  }

  goPrint(){
    this.router.navigateByUrl('spec-sheet/print-ctc/'+this.orderId);
  }

  goCard(){
    this.router.navigateByUrl('spec-sheet/order-card/'+this.orderId);
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
