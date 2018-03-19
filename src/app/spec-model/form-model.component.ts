import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-form-model',
  templateUrl: './form-model.component.html',
  styleUrls: ['./form-model.component.scss','../../css/bs-datepicker.css']
})
export class FormModelComponent implements OnInit {
   
  bsValue: Date = new Date();
  constructor() { }

  ngOnInit() {
  }
}
