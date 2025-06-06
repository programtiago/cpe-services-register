import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cpe } from '../../../../../../model/cpe';
import { RefurbishmentOperation } from '../../../../../../model/refurbishmentOperation';

@Injectable({
  providedIn: 'root'
})
export class RefurbishmentService {

  private urlCpe = 'http://localhost:3000/cpes';
  private urlRefurbishmentCpeOperations = 'http://localhost:3000/refurbishment-operations'

  constructor(private http: HttpClient) { }

  getAllCpes():Observable<Cpe[]>{
    return this.http.get<Cpe[]>(`${this.urlCpe}`);
  }

  getCpeById(id: number):Observable<Cpe>{
    return this.http.get<Cpe>(`${this.urlCpe}/${id}`)
  }

  createRefurbishmentOperationCpe(refurbishmentOperation: RefurbishmentOperation){
    return this.http.post<RefurbishmentOperation>(`${this.urlRefurbishmentCpeOperations}`, refurbishmentOperation)
  }

  getAllRefurbishmentOperationsCpe():Observable<RefurbishmentOperation[]>{
    return this.http.get<RefurbishmentOperation[]>(`${this.urlRefurbishmentCpeOperations}`)
  }
}
