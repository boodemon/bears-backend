import { Component, OnInit, TemplateRef } from '@angular/core';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
//Set Modal //
import { ModalDirective } from 'ngx-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { UserFormComponent } from './user-form.component';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private token = localStorage.getItem('token');
  private udata:any={
              id          : 0,
              mb_id       : '',
              username    : '',
              password    : '',
              mb_name 	  : '',
              mb_position : '',
              mb_marjor 	: '',
              mb_tel 	    : '',
              mb_level 	  : '',
              mb_allow    : '',
              _method     : 'POST',
              token       : localStorage.getItem('token')
          }


  private userID:number;


  // Error validate

  errUsername = '';
  errPassword = '';
  errName = '';
  
  constructor( 
    private Users :UsersService, 
    private auth:AuthService,
    private modalService: BsModalService,
    private user:UserFormComponent
  ) { 
    auth.online();
  }

    UserList:any = [];
    TemplateRef:any;
    frmTitle:string;

    ngOnInit() {
      // call service users
      this.userlist();
    }
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    userlist(){
      return this.Users.getAdmin().subscribe((response) => {
        console.log('response users ', response);
          this.UserList = response;
      });
    }

    newModal(template: TemplateRef<any>) {
      this.clearErr();
      this.udata={
              id          : 0,
              mb_id       : '',
              username    : '',
              password    : '',
              mb_name 	  : '',
              mb_position : '',
              mb_marjor 	: '',
              mb_tel 	    : '',
              mb_level 	  : '',
              mb_allow    : '',
              _method     : 'POST',
              token       : this.token,
          };

      this.frmTitle = 'Add new Administrators';
      this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    }

    updateModal(template:TemplateRef<any>, userID){
      this.clearErr();
      this.frmTitle = 'Update profile Administrator';
      this.Users.getUser(userID).subscribe((response) =>{
        
        const result = response['result'];
        if( result == 'successful'){
              const data = response['data'];
              console.log('data ', data.username );
              this.udata={
                id          : data.id,
                mb_id       : data.mb_id,
                username    : data.username,
                password    : '',
                mb_name 	  : data.mb_name,
                mb_position : data.mb_position,
                mb_marjor 	: data.mb_marjor,
                mb_tel 	    : data.mb_tel,
                mb_level 	  : data.mb_level,
                mb_allow    : data.mb_allow == 'Y' ? true : false,
                _method     : 'PUT',
                token       : this.token,
              };
              this.modalRef = this.modalService.show(template, { class: 'modal-lg'});
        }else{ 
          alert( response['msg'] );
        }
      });
      
    }

    onSubmit(){

        console.log('udata : ', this.udata);
      
      if( this.udata.id == 0 ){
          this.Users.addNew( this.udata ).subscribe((response) => {
            
            const res = response;
            this.userlist();
            this.modalRef.hide();
            this.modalRef = null;
        },
        err => {
          const errRow = err.error;
          if( errRow.username !== undefined )
                this.errUsername = errRow.username;
          if( errRow.password !== undefined )
                this.errPassword = errRow.password;
          if( errRow.name !== undefined )
                this.errName = errRow.name;
          console.log('error : ', err.error);
        });
      }else{
        this.Users.updateUser(this.udata.id,this.udata).subscribe((response)=>{
          const res = response;
          this.userlist();
          this.modalRef.hide();
          this.modalRef = null;
      },
        err => {

        });
      }
      
    }

    deleteUser(userID){
      if( !confirm( 'ยืนยันการลบ User นี้' ) )
        return false;

      this.Users.oneDelete(userID).subscribe((response)=>{
        const res = response;
        if( res['result'] == 'error'){
          alert( res['msg'] );
          return false;
        }
        if( res['result'] == 'successful'){
          this.ngOnInit();
        } 
      });
    }

    closeFirstModal() {

      this.errUsername  = '';
      this.errPassword  = '';
      this.errName      = '';

      this.modalRef.hide();
      this.modalRef = null;
    }

    clearErr(){
      this.errUsername  = '';
      this.errPassword  = '';
      this.errName      = '';
    }

}
