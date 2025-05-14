import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cpe } from '../../../../../model/cpe';

@Injectable({
  providedIn: 'root'
})
export class RefurbishmentService {

  private urlCpe = 'http://localhost:3000/cpes';

  constructor(private http: HttpClient) { }

  getAllCpes():Observable<Cpe[]>{
    return this.http.get<Cpe[]>(`${this.urlCpe}`);
  }
}
