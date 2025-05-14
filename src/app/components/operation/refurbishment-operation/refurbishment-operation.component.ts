import { Component } from '@angular/core';
import { RefurbishmentService } from './services/refurbishment.service';

@Component({
  selector: 'app-refurbishment-operation',
  templateUrl: './refurbishment-operation.component.html',
  styleUrl: './refurbishment-operation.component.scss'
})
export class RefurbishmentOperationComponent {

  constructor(private refurbishmentService: RefurbishmentService){
    this.refurbishmentService.getAllCpes().subscribe((res) => {
      console.log("CPES: ", res)
    })
  }
  
}
