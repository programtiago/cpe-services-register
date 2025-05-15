import { Component } from '@angular/core';
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

  constructor(private refurbishmentService: RefurbishmentService){
    this.refurbishmentService.getAllCpes().subscribe((res) => {
      this.cpesAvailable = res;
      console.log("CPES: ", res)
    })
  }

  updateCpeChoosen(){
    console.log("CPE CHOOSEN: ", this.cpeChoosen)
  }
  
}
