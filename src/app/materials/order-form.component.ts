import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { OrderSheetService } from '../services/order-sheet.service';
import { MaterialsService } from '../services/materials.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  orderId:number = 0;
  newRow:any={};
  fields:any={};
  head:any={};
  isEdit:boolean = false;
  searches:any = [];
  specModel:any=[];

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private auth:AuthService,
    private frm: FormBuilder,
    private materials: MaterialsService
  ){
      this.auth.online();
      this.route.params.subscribe( params => {
        this.orderId = params.id !== undefined ? params.id : 0;
        console.log('params => ', params.id ,' | orderId => ' , this.orderId );
      });
  }r

  ngOnInit() {

  }

  onSearch(input,event){
      console.log('event is ', event );
      let term = event;
      this.searches = [];
      if( term.length >= 1 && term !== null){
      this.materials.onSearch(input,term).subscribe((res)=>{
        let data = res['data'] ;
        for(let x = 0; x < data.length; x++){
          if( input == 'spec' ){
            let specNo = data[x]['spec_no'];
            this.searches.push(specNo['name'] + '  ' + specNo['descript'] + '('+ data[x]['order_prefix'] + '-' + data[x]['order_number'] +')');
          }
          if( input == 'po' ){
            let head = data[x]['header'];
            this.searches.push( head['po_no']);
          }
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
      type : item['type'].name,
      material:item['material'].name,
      color:item['color'].name,
      size:item['size_tip'].name,
      type2:item['size_tip'].descript,
      buckle:item['buckle'].name,
      spec_name:item['spec_no'] ? item['spec_no'].name : '',
      spec_descript:item['spec_no'] ? item['spec_no'].descript : '',
      lining:item['lining'].name,
      filler:item['filler'].name,
      dbl_fill:item['double_filler'].name,
      stitch_no:item['stitch'].name,
      pt:item['edge_thickness'],
      hole_k:item['punch_hole_kensaki'],
      hole_b:item['bijow_width'],
      keeper_type:item['keeper_type'],
      keeper_st:item['keeper_stich'],
      p:item['keeper_stich'] == 'STICH' ? '-' : '/'
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
      color:'',
      size:'',
      type2:'',
      quant:'',
      buckle:'',
      deli:deliv,
      remarks:'',
      spec_name:'',
      spec_descript:'',
      lining:'',
      filler:'',
      dbl_fill:'',
      stitch_no:'',
      pt:'',
      hole_k:'',
      hole_b:'',
      keeper_type:'',
      keeper_st:'',
      p:''    
    };
  }

}
