import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../../../model/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  login(workerno: string, password: string){
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const user = users.find(user => user.workerno.toString() === workerno && user.password === password);
        if (user){
          console.log('Found user: ', user)
          localStorage.setItem('currentUser', JSON.stringify(user))
          return user;
        }
        throw new Error("The work number or password doesn't match !");
      })
    )
  }
}
