import { Component, OnInit, TemplateRef, ElementRef, ViewChild , Inject} from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
// import service //
import { Base } from '../../services/app.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {
  formCate:FormGroup;
  modalRef: BsModalRef;
  TemplateRef: any;
  frmTitle: string;
  rows:any=[];
  loading: boolean = false;
  img_path:string = Base.img_path + 'category/';
  img:string;
  selectAll:boolean = false;
  onSelect:boolean = false;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private Auth: AuthService,
    private category: CategoryService,
    private modalService: BsModalService,
    private fb:FormBuilder
  ) { 
    Auth.online();
    this.createForm();
  }
  ngOnInit() {
    this.cateAll();
  }

  cateAll(){
    return this.category.getAll().subscribe((response) => {
      if( response['code'] == 200 ){
        this.rows = response['data']['data'];
      }
    },
    err => {
      alert('Error!!' + err['message'] );
    });
  }

  createForm() {
    this.formCate = this.fb.group({
      id:0,
      name: ['', Validators.required],
      image: null,
      active:false,
      _method:'POST',
      category_sort:0,
      token:this.Auth.token()
    });
  }

  newModal(template: TemplateRef<any>) {
    this.clearFile();
    this.frmTitle = 'Add new Category';
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  onEdit(template:TemplateRef<any>,id){
    this.frmTitle = 'Update Category';
    this.category.getEdit(id).subscribe((response) =>{
        let result = response['result'];
        let item  = response['data'];
        if( result == 'successful'){
          this.formCate.get('id').setValue(item.id);
          this.formCate.get('image').setValue(null);
          this.formCate.get('name').setValue(item.name);
          this.formCate.get('category_sort').setValue(item.category_sort);
          this.formCate.get('_method').setValue('PUT');
          this.formCate.get('active').setValue(item.active == 'Y' ? true : false );
          this.formCate.get('token').setValue( this.Auth.token() );
          this.img =  item.image;
        }else{
          alert(response['msg']);
          this.modalRef.hide();
        }
    });
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  onFileChange(event) {
    let reader = new FileReader();
    console.log('select file ', event.target.files.length );
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formCate.get('image').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };
    }
  }
  onSubmit() {
    const formModel = this.formCate.value;
    this.loading = true;
  if( formModel.id == '0'){
      this.category.postNew(formModel).subscribe((response) => {
        if( response['result'] == 'successful'){
          this.cateAll();
        }else{
          alert( response['msg']);
        }
        
      });
  }else{
    this.category.postUpdate( formModel.id, formModel ).subscribe((response) => {
        console.log('response update ', response );
      if (response['result'] == 'successful') {
        this.cateAll();
      } else {
        alert(response['msg']);
      }
    });
  }
    setTimeout(() => {
      this.modalRef.hide();
    }, 1000);
  }

  onDelete(id){
    if(!confirm('Please confirm delete'))
        return false;

    this.category.getDelete(id).subscribe((response)=>{
      if( response['result']== 'successful'){
        this.cateAll();
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
        console.log('rows value : ', this.rows[i] );
        getId.push( this.rows[i].id );
      }
    }
    console.log('getId : ', getId ,' join is  ' , getId.join('-') );

    this.category.getDelete(getId.join('-')).subscribe((response) => {
      if (response['result'] == 'successful') {
        this.cateAll();
      } else {
        alert(response['msg']);
      }
    });
  }

  clearFile() {
    this.formCate.get('image').setValue(null);
    this.formCate.get('id').setValue(0);
    this.formCate.get('name').setValue('');
    this.formCate.get('active').setValue(false);
    this.formCate.get('_method').setValue('POST');
    this.formCate.get('category_sort').setValue(0);
    this.img = '';

  }

  onSelectAll(){
    for (var i = 0; i < this.rows.length; i++) {
      this.rows[i].selected = this.selectAll;
    }
  }
  checkIfAllSelected() {
    this.selectAll = this.rows.every(function (item: any) {
      return item.selected == true;
    })
  }
}
