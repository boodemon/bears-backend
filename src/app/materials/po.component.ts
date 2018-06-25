import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { BsModalService,BsModalRef } from 'ngx-bootstrap';
import { HttpClient } from '@angular/common/http'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-po',
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.scss']
})
export class PoComponent implements OnInit {
  filter:boolean=false;
  field:any=[];
  frmFilter:FormGroup;
  modalRef:BsModalRef;
  rows:any=[];

  constructor(
    private http:HttpClient,
    private auth:AuthService,
    private modalService: BsModalService,
    private frm :FormBuilder,
  ) { 
    this.auth.online();
    this.frmFilter = this.frm.group({
      field:['spec_no'],
    });
  }

  ngOnInit() {
  }
  onFilter(template: TemplateRef<any>){
    this.filter = false;
    this.modalRef = this.modalService.show(template);
  }

}
