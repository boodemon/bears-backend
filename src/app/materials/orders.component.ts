import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { BsModalService,BsModalRef } from 'ngx-bootstrap';
import { HttpClient } from '@angular/common/http'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  filter:boolean=false;
  field:any=[];
  frmFilter:FormGroup;
  modalRef:BsModalRef;

  constructor(
    private http:HttpClient,
    private auth:AuthService,
    private modalService: BsModalService,
    private frm :FormBuilder
  ) { 
    this.auth.online();
  }

  ngOnInit() {
    this.frmFilter = this.frm.group({
      field:['spec_no'],
    });
  }
  
  onFilter(template: TemplateRef<any>){
    this.filter = false;
    this.modalRef = this.modalService.show(template);
  }
}
