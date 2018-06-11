import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OrderSheetService } from '../services/order-sheet.service';
import {Router, ActivatedRoute} from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private auth:AuthService,
    private order:OrderSheetService
  ) { 
    this.auth.online();
  }

  ngOnInit() {
    this.getAll();
  }

  getAll(){
    this.rows = [];
    this.sheets = [];
    this.loading = true;
    this.order.fatchAll('').subscribe((res:object) => {

        if( res['code'] == 200 ){
            console.log('order sheet result ', res);
            this.rows = res['data'];
            this.sheets = res['sheets'];
            this.loading=false;
        }
    },
    (err) => {
      alert('Error!! ' + JSON.stringify( err ) );
    });
  }

  onDelete(id){
    if(!confirm('Please confirm delete'))
        return false;
    this.order.destroy(id,'main').subscribe((response)=>{
      if( response['result']== 'successful'){
        this.getAll();
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
        this.getAll();
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
