import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule ,FormGroup, FormBuilder,FormArray } from '@angular/forms';
import { BrowserModule} from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Router,ActivatedRoute} from '@angular/router';
import 'rxjs/Rx';


import { AuthService } from '../services/auth.service';
import { SpeceService } from '../services/spece.service';
@Component({
  selector: 'app-form-model',
  templateUrl: './form-model.component.html',
  styleUrls: ['./form-model.component.scss','../../css/bs-datepicker.css']
})
export class FormModelComponent implements OnInit {
   
  bsValue: Date = new Date();
  searchField: FormControl; 
  searches: string[] = []; 
  frmModel:FormGroup;
  specModel:any=[];
  specId:number = 0;
  status: { isopen: boolean } = { isopen: false };
  constructor( 
    private frm:FormBuilder, 
    private auth:AuthService,
    private http: HttpClient,
    private spec:SpeceService,
    private route: ActivatedRoute,
    private router:Router
  ) { 
    this.auth.online();
    this.route.params.subscribe( params => {
      console.log('params => ', params.id)
      this.specId = params.id !== undefined ? params.id : 0;
    });
    this.createForm();
  }

  

  subNode(){
    return new FormGroup({
        id : new FormControl(''),
        name : new FormControl(''),
        descript: new FormControl(''),
        rate: new FormControl(''),
    });
  }

  setvalNode(node){
    console.log('node result => ', JSON.stringify(node) ,' = ', node );
    if( node === undefined || node === null){
      return {
        'id' :  '',
        'name' : '',
        'descript' : '',
        'rate' : ''
      }
    }else{
      return {
        'id' : ( (node.id === undefined || node.id === null || node.id === '')? '' : node.id ),
        'name' : (node.name !== undefined && node.name !== null && node.name !== '' )? node.name : '',
        'descript' : (node.descript !== undefined && node.descript !== null && node.descript !== '') ? node.descript : '',
        'rate' : (node.rate !== undefined && node.rate !== null && node.rate !== '') ? node.rate : ''
      }
    }
  }

  createForm(){
    console.log('spec id = ', this.specId );
    this.frmModel = this.frm.group({
      'id':[ 0 ],
      '_method':['POST'],
      'token':[this.auth.token()],
      'spec' :  this.subNode() ,
      'type' :  this.subNode() ,
      'material' :  this.subNode() ,
      'color' :  this.subNode() ,
      'filler' :  this.subNode() ,
      'double_filler' :  this.subNode() ,
      'lining' :  this.subNode() ,
      'stitch' :  this.subNode() ,
      'paint' :  this.subNode() ,
      'buckle' :  this.subNode() ,

      'keeper' : [''],
      'keeper_type' : [''],
      'keeper_width' : [''],
      'keeper_stitch' : [''],

      'keeper2' : [''],
      'keeper2_width' : [''],
      'keeper2_type' : [''],
      'keeper2_stitch' : [''],

      'punch_hole_kensaki' : [''],
      'punch_hole_dia': [''],
      'bijow_width': [''],
      'punch_hole_length': [''],

      'size_tip' :  this.subNode() ,
      'model_length' :  this.subNode() ,
      'total_thickness' :  this.subNode() ,

      'kanmoto_thickness': [''],
      'edge_thickness': [''],

      'matal_part' :  this.subNode() ,
      'metal_keeper' :  this.subNode() ,
      'end_piece_inside' :  this.subNode() ,
      'end_piece_outside' :  this.subNode() ,
      'eyelet' :  this.subNode() ,
      'spring_bar' :  this.subNode() ,
      'cylinder' :  this.subNode() ,
      'stamping' :  this.subNode() ,

      'remarks': [''],
    });
  }

  ngOnInit() {
    this.searchNo();
    this.fetchEdit();
  }
  fetchEdit(){
    this.route.params.subscribe( params => {
      console.log('params => ', params.id)
      if( params.id !== undefined ){
        this.frmModel.get('id').setValue( params.id );
        this.spec.queryOne(params.id).subscribe((res) => {
          console.log('response => ', res );
          this.specModel = res['data'];
          this.onSpec(0);
        },
      (err)=> { console.log( err )
      });
      }else {
        this.frmModel.get('id').setValue(0);
      }
      this.specId = params.id !== undefined ? params.id : 0;
    });
  }

  searchNo(){
        let term    =   this.frmModel.get('spec').get('name').value;
        if( term.length >= 1 && term !== null){
        this.spec.allSpec(term).subscribe((res)=>{
          let data = res['data'];
          this.specModel = data;
          this.searches = [];
          for(let x = 0; x < data.length; x++){
            let specNo = data[x]['spec_no'];
            this.searches.push(specNo['name'] + '  ' + specNo['descript'] );
            this.status.isopen = true;  
          }
        },
        (err)=>{
          alert('Error!!'+ JSON.stringify(err) );
        });
        }else{
          this.searches = [];
          this.status.isopen = false;
        }
  }
  onSpec(idx){
          
          let item = this.specModel[idx];
          console.log('ite => ', item );
          this.frmModel.get('spec').setValue( this.setvalNode(item.spec_no) );
          this.frmModel.get('type').setValue( this.setvalNode(item.type) );
          this.frmModel.get('material').setValue( this.setvalNode(item.material) );
          this.frmModel.get('color').setValue( this.setvalNode(item.color) );
          this.frmModel.get('filler').setValue( this.setvalNode(item.filler) );
          this.frmModel.get('double_filler').setValue( this.setvalNode(item.double_filler) );
          this.frmModel.get('lining').setValue( this.setvalNode(item.lining) );
          this.frmModel.get('stitch').setValue( this.setvalNode(item.stitch) );
          this.frmModel.get('paint').setValue( this.setvalNode(item.paint) );
          this.frmModel.get('buckle').setValue( this.setvalNode(item.buckle) );
    
          this.frmModel.get('keeper').setValue( item.keeper);
          this.frmModel.get('keeper_type').setValue( item.keeper_type);
          this.frmModel.get('keeper_width').setValue( item.keeper_width);
          this.frmModel.get('keeper_stitch').setValue( item.keeper_stich);
    
          this.frmModel.get('keeper2').setValue( item.keeper2);
          this.frmModel.get('keeper2_width').setValue( item.keeper2_width);
          this.frmModel.get('keeper2_type').setValue( item.keeper2_type);
          this.frmModel.get('keeper2_stitch').setValue( item.keeper2_stitch);
    
          this.frmModel.get('punch_hole_kensaki').setValue( item.punch_hole_kensaki);
          this.frmModel.get('punch_hole_dia').setValue( item.punch_hole_dia);
          this.frmModel.get('bijow_width').setValue( item.bijow_width);
          this.frmModel.get('punch_hole_length').setValue( item.punch_hole_length);

          this.frmModel.get('size_tip').setValue( this.setvalNode(item.size_tip) );
          this.frmModel.get('model_length').setValue( this.setvalNode(item.model_length) );
          this.frmModel.get('total_thickness').setValue( this.setvalNode(item.total_thickness) );

          this.frmModel.get('kanmoto_thickness').setValue( item.kanmoto_thickness);
          this.frmModel.get('edge_thickness').setValue( item.edge_thickness);
    
          this.frmModel.get('matal_part').setValue( this.setvalNode(item.matal_part) );
          this.frmModel.get('metal_keeper').setValue( this.setvalNode(item.metal_keeper) );
          this.frmModel.get('end_piece_inside').setValue( this.setvalNode(item.end_piece_inside) );
          this.frmModel.get('end_piece_outside').setValue( this.setvalNode(item.end_piece_outside) );
          this.frmModel.get('eyelet').setValue( this.setvalNode(item.eyelet) );
          this.frmModel.get('spring_bar').setValue( this.setvalNode(item.spring_bar) );
          this.frmModel.get('cylinder').setValue( this.setvalNode(item.cylinder) );
          this.frmModel.get('stamping').setValue( this.setvalNode(item.stamping) );
          this.frmModel.get('remarks').setValue( item.remarks);

          //this.searches = [];
          this.status.isopen = false;
    }
    onSubmit(){
      let id = this.frmModel.get('id').value;
      if( id == 0){
        let param = this.frmModel.value;
        this.addNew(param);
      }else{
        this.frmModel.get('_method').setValue('PUT');
        let param = this.frmModel.value;
        console.log('id = ', id ,' update param ', param );
        this.onUpdate(id,param)
      }
    }
    addNew(param){
      this.spec.onNew( param ).subscribe((res)=>{
                console.log('return post ' , res );
                if( res['code'] == 200 ){
                  alert(res['msg']);
                  this.router.navigateByUrl('spec-model');
                }else{
                  alert(res['msg']);
                }
              },
              (err) => {
                alert('err => ' + JSON.stringify(err) );
              })
    }
    onUpdate(id,param){
      this.spec.onUpdate(id,param ).subscribe((res)=>{
        console.log('return post ' , res );
        if( res['code'] == 200 ){
          alert(res['msg']);
          this.router.navigateByUrl('spec-model');
        }else{
          alert(res['msg']);
        }
      },
      (err) => {
        alert('err => ' + JSON.stringify(err) );
      })
    }

}
