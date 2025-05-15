import { Component, ElementRef, ViewChild } from '@angular/core';
import { RefurbishmentService } from './services/refurbishment.service';
import { Cpe } from '../../../../model/cpe';

@Component({
  selector: 'app-refurbishment-operation',
  templateUrl: './refurbishment-operation.component.html',
  styleUrl: './refurbishment-operation.component.scss'
})
export class RefurbishmentOperationComponent {

  cpesAvailable: Cpe[] = [] //represent all the cpes available from json file
  cpeChoosen: Cpe | null = null; //represents the Cpe selected from the mat-select list 

  @ViewChild('serialNumberInput') serialNumberInput!: ElementRef; //template directive to identify the serial input on the DOM
  serialNumberScanned: string = '';
  serialNumberValid: boolean = false;

  //represents the error to show after sn scanned: 
  /* - if doesn't follow the parten of cpe choosen 
     - if doesn't has a test
     - if doesn't is in stock - can have status dispatched or doesn't have a reception id
     - if has a test NOK
  */   
  cpeMessageErrorNotValid: string = '' 

  constructor(private refurbishmentService: RefurbishmentService){
    this.refurbishmentService.getAllCpes().subscribe((res) => {
      this.cpesAvailable = res;
    })
  }

  //focus serialNumberInput field after validate the cpe choosen
  chooseCpeChoosen(){
    let cpeSelected: string = ''

    if (this.cpeChoosen){
      cpeSelected = this.cpeChoosen.design; 

      setTimeout(() => {
        if (this.serialNumberInput && this.serialNumberInput.nativeElement){
          this.serialNumberInput.nativeElement.focus();
        }
      }, 200);
    }
  }
  
}
