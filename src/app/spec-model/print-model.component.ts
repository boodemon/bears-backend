import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { SpeceService } from '../services/spece.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-print-model',
  templateUrl: './print-model.component.html',
  styleUrls: ['./print-model.component.scss']
})
export class PrintModelComponent implements OnInit {
  models:any=[];

  constructor(
    private frm:FormBuilder, 
    private auth:AuthService,
    private http: HttpClient,
    private spec:SpeceService,
    private route: ActivatedRoute,
    private router:Router
  ) { 
    this.auth.online();
  }

  ngOnInit() {
    this.fetchOne();
  }
  fetchOne(){
    this.route.params.subscribe( params => {
      //console.log('params => ', params.id)
      if( params.id !== undefined ){
            this.spec.queryOne(params.id).subscribe((res) => {
                //this.model = this.setField( res['data'][0]);// JSON.parse( result );
                this.models = res['data'];// JSON.parse( result );
                console.log('response model => ', this.models  );
            },
            (err)=> { 
                alert('Error !!' + JSON.stringify( err ) )
            });
      }
    });
  }
  setField(item){
    return {
      bijow_width : item.bijow_width ,
      buckle : item.buckle ,
      color : item.color ,
      create_date : item.create_date ,
      created_at : item.created_at ,
      cylinder : item.cylinder ,
      delivery : item.delivery ,
      double_filler : item.double_filler ,
      edge_thickness : item.edge_thickness ,
      end_piece_inside : item.end_piece_inside ,
      end_piece_outside : item.end_piece_outside ,
      eyelet : item.eyelet ,
      filler : item.filler ,
      id : item.id ,
      kanmoto_thickness : item.kanmoto_thickness ,
      keeper : item.keeper ,
      keeper2 : item.keeper2 ,
      keeper2_stitch : item.keeper2_stitch ,
      keeper2_type : item.keeper2_type ,
      keeper2_width : item.keeper2_width ,
      keeper_stich : item.keeper_stich ,
      keeper_type : item.keeper_type ,
      keeper_width : item.keeper_width ,
      lining : item.lining ,
      linning_over : item.linning_over ,
      linning_under : item.linning_under ,
      magic_qm : item.magic_qm ,
      magic_qn : item.magic_qn ,
      matal_part : item.matal_part ,
      material : item.material ,
      metal_keeper : item.metal_keeper ,
      model_daft : item.model_daft ,
      model_length : item.model_length ,
      model_status : item.model_status ,
      paint : item.paint ,
      picture : item.picture ,
      po_no : item.po_no ,
      punch_hole_dia : item.punch_hole_dia ,
      punch_hole_kensaki : item.punch_hole_kensaki ,
      punch_hole_length : item.punch_hole_length ,
      remarks : item.remarks ,
      size_tip : item.size_tip ,
      spec_no : item.spec_no ,
      spring_bar : item.spring_bar ,
      staff : item.staff ,
      stamping : item.stamping ,
      stitch : item.stitch ,
      total_thickness : item.total_thickness ,
      type : item.type ,
      unit_price : item.unit_price ,
      updated_at : item.updated_at
    }
  }

  onPrint(){
    window.print();
  }

}
interface specField {
  
}