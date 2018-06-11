import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { SpeceService } from '../services/spece.service';
import { OrderSheetService } from '../services/order-sheet.service';


@Component({
  selector: 'app-print-ctc',
  templateUrl: './print-ctc.component.html',
  styleUrls: ['./print-form.component.scss']
})
export class PrintCtcComponent implements OnInit {
  private orderId:number =0;
  private fields: Array<any> = [];
  private head: any = {};
  private newRow: any = {};
  total:number = 0;

  constructor(
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
    this.getPrint();
    this.doPrint();
  }
  getPrint(){
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
            type : 'coj',
            date : head.po_date,
            customer:head.customer,
          };
          
          for(let x = 0; x < sheets.length; x++){
            this.fields.push( this.setVal( sheets[x] ) ) ;
            this.total += sheets[x].quantity;
          }
        }
      },
    (err) => {
      alert('Error!! ' + JSON.stringify( err ) );
    });
    
  }
  setVal(item){
    console.log( 'data json ' , item );
    let n = this.newRow;
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
  onPrint(){
    window.print();
  }
  doPrint(){
    console.log('printing wait...');
      setTimeout(function(){
        window.print();
      },1000);
      setTimeout(function(){
        window.history.back();
      },1500);
  }
}
