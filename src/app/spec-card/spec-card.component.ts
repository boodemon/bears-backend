import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { SpeceService } from '../services/spece.service';
import { OrderSheetService } from '../services/order-sheet.service';

@Component({
  selector: 'app-spec-card',
  templateUrl: './spec-card.component.html',
  styleUrls: ['./spec-card.component.scss']
})
export class SpecCardComponent implements OnInit {

  private orderId:number =0;
  private fields: any = [];
  private head: any = [];
  total:number = 0;
  printing:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private auth:AuthService,
    private http: HttpClient,
    private spec:SpeceService,
    private order:OrderSheetService,
  ) {
    this.auth.online();
    this.route.params.subscribe( params => {
      console.log('params => ', params.id)
      this.orderId = params.id !== undefined ? params.id : 0;
    });
   }

  ngOnInit() {
    this.getOrder();
  }
  getOrder(){
      this.order.fatchOne( this.orderId ).subscribe((res) => {
        console.log( res );
        if( res['code'] == 200){
          this.fields = res['sheets'];
          this.head   = res['data'];
        }
      },
    (err) => {
      alert('Error!! ' + JSON.stringify( err ) );
    });
    
  }
  onPrint(){
        window.print();
  }
  onExport(){
    this.order.export('order-card',this.orderId ).subscribe( (res) => {
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
