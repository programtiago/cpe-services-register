import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { RefurbishmentService } from './services/refurbishment.service';
import { Cpe } from '../../../../model/cpe';
import { CPE_SN_FORMATS } from '../../../../utils/serialNumberFormat';
import { Service } from '../../../../model/service';
import { StatusCpe } from '../../../../model/enum/statusCpe';
import { RefurbishmentOperation } from '../../../../model/refurbishmentOperation';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../../../model/user';
import { SnackbarService } from './services/snackbar.service';

@Component({
  selector: 'app-refurbishment-operation',
  templateUrl: './refurbishment-operation.component.html',
  styleUrl: './refurbishment-operation.component.scss'
})
export class RefurbishmentOperationComponent implements AfterViewChecked{

  cpesAvailable: Cpe[] = [] //represent all the cpes available from json file
  cpeChoosen!: Cpe; //represents the Cpe selected from the mat-select list
  cpeEntry!: Cpe 

  @ViewChild('serialNumberInput') serialNumberInput!: ElementRef; //template directive to identify the serial input on the DOM
  serialNumberScanned: string = '';
  serialNumberValid: boolean = false;

  lengthSn: number = 0; 

  userLogged: User | null;

  //represents the error to show after sn scanned: 
  /* - if doesn't follow the parten of cpe choosen 
     - if doesn't has a test
     - if doesn't is in stock - can have status dispatched or doesn't have a reception id
     - if has a test NOK
  */   
  cpeMessageErrorNotValid: string = '' 
  private shouldFocusSerialInput = false;

  allowedServicesApplyToCpe: Service[] = []
  servicesApplied: Service[] = []

  cpeRefurbishmentRegister!: RefurbishmentOperation;
  listRefurbishmentRegister: RefurbishmentOperation[] = []

  constructor(private refurbishmentService: RefurbishmentService, private cdref: ChangeDetectorRef, private authService: AuthService, 
    private snackbarService: SnackbarService
  ){
    this.refurbishmentService.getAllCpes().subscribe((res) => {
      this.cpesAvailable = res;
    })

    this.userLogged = this.authService.getLoggedUser();

  }

  ngAfterViewChecked(): void {
    if (this.shouldFocusSerialInput && this.serialNumberInput && this.serialNumberInput.nativeElement){
      this.serialNumberInput.nativeElement.focus();
      this.shouldFocusSerialInput = false;
      this.cdref.detectChanges();
    }
  }

  //defines the length allowed on serial input for each cpe 
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

    if (sn.length === 0){
      this.serialNumberValid = false;
      this.cpeMessageErrorNotValid = 'You must enter a serial number to proceed !';
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
    }

    if (!this.evaluateCpeStatusAndTestStatus(sn, this.cpeChoosen)){
      this.serialNumberValid = false;
      const snInput = <HTMLInputElement>this.serialNumberInput.nativeElement;
      snInput.select();
      return;
    }

    this.serialNumberValid = true;
    this.getAllowedServicesByCpeId();
  }

  evaluateCpeStatusAndTestStatus(sn: string, cpe: Cpe): boolean {
    const cpeEntry = cpe.cpeData?.find(data => data.sn === sn);
    console.log('CPE Entry found:', cpeEntry);
  
    let macCpe = '';
    let reception = '';
    let status = '';
    let testStatus = '';

    if (cpeEntry){
      macCpe = cpeEntry.mac ?? '';
      reception = cpeEntry.receptionId ?? '';
      status = cpeEntry.status ?? '';
      testStatus = cpeEntry.testStatus ?? '';

      console.log("MAC", macCpe + "\nReception", reception, "\nStatus", status + "\nTest Status", testStatus)

      if (!reception || status !== StatusCpe.Received){
        this.cpeMessageErrorNotValid = `Serial Number indicated: ${sn} does not exist in stock`
        return false;
      }

      if (!macCpe){
        this.cpeMessageErrorNotValid = `Serial Number indicated: ${sn} does not have a test`
        return false;
      }

      if (!testStatus) {
        this.cpeMessageErrorNotValid = `Serial Number indicated: ${sn} does not have a test`;
        return false;
      }

      if (testStatus === "TEST_NOK"){
        this.cpeMessageErrorNotValid = `Serial Number indicated: ${sn} does not have a test ok !`;
        return false;
      }

      if (!cpeEntry){
        this.cpeMessageErrorNotValid = `Serial Number indicated: ${sn} does not exist in stock`;
        return false;
      }

      console.log("MAC", macCpe + "\nReception", reception, "\nStatus", status + "\nTest Status", testStatus)
    }

    this.cpeMessageErrorNotValid = ''

    return true;
  }

  getAllowedServicesByCpeId(){
    const cpe = this.cpesAvailable.find(cpe => cpe.id === this.cpeChoosen.id);

    this.allowedServicesApplyToCpe = cpe?.allowedServices ?? [];

  }

  registerOperationCpeRefurbishment(){

    this.cpeRefurbishmentRegister = {
      id: Math.floor(Math.random() * 101),
      cpe: {
        id: this.cpeChoosen.id,
        sap: this.cpeChoosen.sap,
        design: this.cpeChoosen.design,
        allowedServices: [],
        cpeData: [
          {
            sn: this.cpeChoosen.cpeData[0]?.sn,
            ean: this.cpeChoosen.cpeData[0]?.ean,
            mac: this.cpeChoosen.cpeData[0]?.mac,
            status: this.cpeChoosen.cpeData[0]?.status,
            testStatus: this.cpeChoosen.cpeData[0]?.testStatus,
            dateHourTest: new Date().toLocaleDateString(),
            receptionId: this.cpeChoosen.cpeData[0]?.receptionId,
          }
        ],
      },
      dateHourOperation: new Date(),
      user: this.authService.getSafeUser(this.userLogged as User),
      servicesApplied: this.servicesApplied
    }

    this.refurbishmentService.createRefurbishmentOperationCpe(this.cpeRefurbishmentRegister).subscribe((res) => {
      if (res.id != null){
         this.snackbarService.sucess(`Refurbishment operation on S/N ${this.cpeRefurbishmentRegister.cpe.cpeData[0].sn} sucessfully registered ! `);
         this.listRefurbishmentRegister.push(res);
      }
    })
  }

  onChange(value: any){
    this.servicesApplied.push(value);
  }
}
