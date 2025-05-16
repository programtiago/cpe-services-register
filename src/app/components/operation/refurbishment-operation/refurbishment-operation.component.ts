import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { RefurbishmentService } from './services/refurbishment.service';
import { Cpe } from '../../../../model/cpe';
import { CPE_SN_FORMATS } from '../../../../utils/serialNumberFormat';
import { Service } from '../../../../model/service';
import { StatusTestCpe } from '../../../../model/enum/statusTestCpe';
import { StatusCpe } from '../../../../model/enum/statusCpe';

@Component({
  selector: 'app-refurbishment-operation',
  templateUrl: './refurbishment-operation.component.html',
  styleUrl: './refurbishment-operation.component.scss'
})
export class RefurbishmentOperationComponent implements AfterViewChecked{

  cpesAvailable: Cpe[] = [] //represent all the cpes available from json file
  cpeChoosen!: Cpe; //represents the Cpe selected from the mat-select list 

  @ViewChild('serialNumberInput') serialNumberInput!: ElementRef; //template directive to identify the serial input on the DOM
  serialNumberScanned: string = '';
  serialNumberValid: boolean = false;

  lengthSn: number = 0; 

  //represents the error to show after sn scanned: 
  /* - if doesn't follow the parten of cpe choosen 
     - if doesn't has a test
     - if doesn't is in stock - can have status dispatched or doesn't have a reception id
     - if has a test NOK
  */   
  cpeMessageErrorNotValid: string = '' 
  private shouldFocusSerialInput = false;

  allowedServicesApplyToCpe: Service[] = []

  constructor(private refurbishmentService: RefurbishmentService, private cdref: ChangeDetectorRef ){
    this.refurbishmentService.getAllCpes().subscribe((res) => {
      this.cpesAvailable = res;
    })
  }

  ngAfterViewChecked(): void {
    if (this.shouldFocusSerialInput && this.serialNumberInput && this.serialNumberInput.nativeElement){
      this.serialNumberInput.nativeElement.focus();
      this.shouldFocusSerialInput = false;
      this.cdref.detectChanges();
    }
  }

  defineLengthSerialNumber(){
    if (this.cpeChoosen.design === 'CPE A'){
      this.lengthSn = 13;
    }else if (this.cpeChoosen.design === 'CPE B'){
      this.lengthSn = 12;
    }else{
      this.lengthSn = 15;
    }
  }

  //focus serialNumberInput field after validate the cpe choosen
  chooseCpeChoosen(){
    //let cpeSelected: string = ''

    this.serialNumberValid = false;
    this.cpeMessageErrorNotValid = ''
    this.serialNumberScanned = '';
    this.defineLengthSerialNumber();
    console.log(this.lengthSn)
    this.shouldFocusSerialInput = true;

      setTimeout(() => {
        if (this.serialNumberInput && this.serialNumberInput.nativeElement){
          this.serialNumberInput.nativeElement.focus();
        }
      }, 100);
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
      return;
    }else{
      this.cpeMessageErrorNotValid = '';
      console.log(this.cpeMessageErrorNotValid)
    }

    if (!this.evaluateCpeStatusAndTestStatus(sn, this.cpeChoosen)){
      this.serialNumberValid = false;
      const snInput = <HTMLInputElement>this.serialNumberInput.nativeElement;
      snInput.select();
      return;
    }

    this.serialNumberValid = true;
  }

  evaluateCpeStatusAndTestStatus(sn: string, cpe: Cpe): boolean {
    const cpeEntry = cpe.cpeData?.find(data => data.sn === sn);

    if (!cpeEntry) {
        this.cpeMessageErrorNotValid = `Serial Number indicated: ${sn} does not exist in stock`;
        return false;
    }
  
    let macCpe = '';
    let reception = '';
    let status = '';
    let testStatus = '';

    if (cpeEntry){
      macCpe = cpeEntry.mac ?? '';
      reception = cpeEntry.receptionId ?? '';
      status = cpeEntry.status ?? '';
      testStatus = cpeEntry.testStatus ?? '';

      if (!reception || status !== StatusCpe.Received){
        this.cpeMessageErrorNotValid = `Serial Number indicated: ${sn} does not have a test`
      }

      if (!macCpe){
        this.cpeMessageErrorNotValid = `Serial Number indicated: ${sn} does not have a test`
      }

      if (!testStatus) {
        this.cpeMessageErrorNotValid = `Serial Number indicated: ${sn} does not have a test`;
        return false;
      }

      if (testStatus === "TEST_NOK"){
        this.cpeMessageErrorNotValid = `Serial Number indicated: ${sn} does not have a test ok !`;
        return false;
      }

      console.log("MAC", macCpe + "\nReception", reception, "\nStatus", status + "\nTest Status", testStatus)
    }

    //this.serialNumberValid = true;
    this.cpeMessageErrorNotValid = ''
    return true;
  }
}
