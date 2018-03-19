import { Component, OnInit, TemplateRef, ElementRef, ViewChild, Inject } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormControl } from '@angular/forms';
// import service //
import { Base } from '../../services/app.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { RestourantService } from '../../services/restourant.service';

@Component({
  selector: 'app-restourant',
  templateUrl: './restourant.component.html',
  styleUrls: ['./restourant.component.css']
})
export class RestourantComponent implements OnInit {
  formRestourant: FormGroup;
  modalRef: BsModalRef;
  TemplateRef: any;
  frmTitle: string;
  rows: any = [];
  ckGroups:any=[];
  gp:any = [];
  loading: boolean = false;
  img_path: string = Base.img_path + 'restourant/';
  img: string;
  selectAll: boolean = false;
  onSelect: boolean = false;
  groups:any = [];
  addNew:boolean = true;

  user = {
    skills: [
      { name: 'JS',  selected: true, id: 1 },
      { name: 'CSS',  selected: false, id: 2 },
    ]
  }

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private Auth: AuthService,
    private category: CategoryService,
    private restourant:RestourantService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    Auth.online();
    this.createForm();
  }
  ngOnInit() {
    this.fetchAll();
    this.fetchGroup();
  }

  createForm() {
    this.formRestourant = this.fb.group({
      id: 0,
      restourant: ['', Validators.required],
      contact: ['', Validators.required],
      tel: ['', Validators.required],
      image: null,
      active: false,
      _method: 'POST',
      token: this.Auth.token(),
      groups: this.listGroup(),
    });
  }

  listGroup(){
    console.log('this groups = ', this.groups );
    const arr = this.groups.map(group => {
      console.log('list group map ', group );
      return this.fb.control(group);
    });
    return this.fb.array(arr);
  }


  fetchGroup(){
    this.category.getAll().subscribe(response => {
      if( response['code'] == 200 ){
        this.groups = response['data']['data'];
        //window.localStorage.setItem('groups',JSON.stringify(this.groups));

      }
    })
  }

  fetchAll() {
    return this.restourant.getAll().subscribe((response) => {
      if( response['code'] == 200 ){
        this.rows = response['data'];
      }
    },
    err => {
      alert('Error !! '+ err.message);
    });
  }

  newModal(template: TemplateRef<any>) {
    this.addNew = true;
    this.clearFile();
    this.frmTitle = 'Add new Category';
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  onEdit(template: TemplateRef<any>, id) {
    this.addNew = false;
    this.frmTitle = 'Update Category';
    this.restourant.getEdit(id).subscribe((response) => {
      let result = response['result'];
      let item = response['data'];
      if (result == 'successful') {
        this.formRestourant.get('id').setValue(item.id);
        this.formRestourant.get('image').setValue(null);
        this.formRestourant.get('restourant').setValue(item.restourant);
        this.formRestourant.get('contact').setValue(item.contact);
        this.formRestourant.get('tel').setValue(item.tel);
        this.formRestourant.get('_method').setValue('PUT');
        this.formRestourant.get('active').setValue(item.active == 'Y' ? true : false);
        this.img = item.image;
        this.ckGroups = item.groups;        
      } else {
        alert(response['msg']);
        this.modalRef.hide();
      }
    });
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  onFileChange(event) {
    let reader = new FileReader();
    console.log('select file ', event.target.files.length);
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formRestourant.get('image').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };
    }
  }

  // groupVal(){
  //     const group:any = [];
  //     for(let x = 0; x < this.restourantGroup.length; x++){
  //       console.log('Group val : ', this.restourantGroup[x].selecteds );
  //       if (this.restourantGroup[x].selecteds !== undefined){
  //           if(this.restourantGroup[x].selecteds === true )
  //               group.push( this.restourantGroup[x].id );
  //       }
  //     }
  //     this.formRestourant.get('groups').setValue( group );
  // }

  onSubmit() {
    //this.groupVal();
    const formModel = this.formRestourant.value;
    console.log('formModel ', formModel);
    const frm = new FormData();
    this.loading = true;
    
    if (formModel.id == '0') {
      this.restourant.postNew(formModel).subscribe((response) => {
        if (response['result'] == 'successful') {
          this.fetchAll();
        } else if( response['result'] == 'error') {
          alert('new error ' + response['msg']);
        }
        setTimeout(() => {
          this.modalRef.hide();
        }, 1000);

      },
      err=>{
        alert('new error ' + err['message']);
      });
    } else {
      console.log('form model : ', formModel );
      this.restourant.postUpdate(formModel.id, formModel).subscribe((response) => {
        console.log('response update ', response);
        if (response['resule'] == 'successful') {
          this.fetchAll();
        } else {
          alert('update ' + response['msg']);
        }
        setTimeout(() => {
          this.modalRef.hide();
        }, 1000);
      });
    }
    
  }

  onDelete(id) {
    if (!confirm('Please confirm delete'))
      return false;

    this.restourant.getDelete(id).subscribe((response) => {
      if (response['result'] == 'successful') {
        this.fetchAll();
      } else {
        alert(response['msg']);
      }
    });
  }
  multiDelete() {
      if (!confirm('Please confirm delete'))
        return false;

      let getId: any = [];
      for (var i = 0; i < this.rows.length; i++) {
        if (this.rows[i].selected == true) {
            console.log('rows value : ', this.rows[i]);
            getId.push(this.rows[i].id);
        }
      }
      console.log('getId : ', getId, ' join is  ', getId.join('-'));
      this.restourant.getDelete(getId.join('-')).subscribe((response) => {
          if (response['result'] == 'successful') {
            this.fetchAll();
          } else {
            alert(response['msg']);
          }
      });
  }

  clearFile() {
    this.formRestourant.get('image').setValue(null);
    this.formRestourant.get('id').setValue(0);
    this.formRestourant.get('restourant').setValue('');
    this.formRestourant.get('contact').setValue('');
    this.formRestourant.get('tel').setValue('');
    this.formRestourant.get('active').setValue(false);
    this.formRestourant.get('_method').setValue('POST');
    this.img = '';
  }

  onSelectAll() {
    console.log('select all = ' , this.rows.length );
    for (var i = 0; i < this.rows.length; i++) {
      this.rows[i].selected = this.selectAll;
      console.log('selected : ', this.rows[i].selected ,' select all ', this.selectAll );
    }
  }
  checkIfAllSelected() {
    this.selectAll = this.rows.every(function (item: any) {
      return item.selected == true;
    })
  }

}
