import { Component, ElementRef, ViewChild } from '@angular/core';
import { RefurbishmentService } from './services/refurbishment.service';
import { Cpe } from '../../../../model/cpe';
import { CPE_SN_FORMATS } from '../../../../utils/serialNumberFormat';

@Component({
  selector: 'app-refurbishment-operation',
  templateUrl: './refurbishment-operation.component.html',
  styleUrl: './refurbishment-operation.component.scss'
})
export class RefurbishmentOperationComponent {

  cpesAvailable: Cpe[] = [] //represent all the cpes available from json file
  cpeChoosen!: Cpe; //represents the Cpe selected from the mat-select list 

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

  handleSerialNumberScan(event: KeyboardEvent){
    if (event.key === 'Tab'){
      event.preventDefault(); //doesn't allow to change focus to the next field
      this.serialNumberScanned = (event.target as HTMLInputElement).value; //assign to serialNumber where happened the event
      console.log("Pressed tab key on serial field")
      this.validateSn(this.serialNumberScanned)
    }
  }


  validateSn(sn: string){
    //if the cpe wasn't choosen the sn isn't valid
    if (!this.cpeChoosen){
      this.serialNumberValid = false;
      return;
    }

    const format = CPE_SN_FORMATS[this.cpeChoosen.design];
    //if the format doesn't match the sn isn't valid
    if (!format){
      this.serialNumberValid = false;
      return;
    } 

    const hasValidPrefix = format.prefix.some(prefix => sn.startsWith(prefix)) //check if the prefix matches with cpe choosen
    const hasValidLength = format.length.includes(sn.length) //check if the length of the serial number matches with cpe choosen

    this.serialNumberValid = hasValidLength && hasValidPrefix;

    //if the sn is not valid selected the entire text - allow the user to scan another sn
    if (!this.serialNumberValid){
      const serial = <HTMLInputElement>this.serialNumberInput.nativeElement;
      serial.select();
      this.cpeMessageErrorNotValid = `Serial Number indicated: ${sn} doesn't match with the cpe choosen ! `;
      //return;
    }else{
      this.cpeMessageErrorNotValid = '';
    }

    const cpeSap = this.cpeChoosen.sap;

    const cpeIsInStock = this.cpesAvailable.find(cpe => 
        cpe.cpeData && cpe.cpeData.some(data => data.sn === sn)
    )

    if (!cpeIsInStock){
        this.serialNumberValid = false;
        this.cpeMessageErrorNotValid = `Serial Number:  ${sn} doesn't exist in stock !`
        console.log("CPE ISN'T IN STOCK", cpeIsInStock)
    }else{
      this.cpeChoosen = cpeIsInStock;
      console.log("CPE", this.cpeChoosen)
    }
  }
  
}
