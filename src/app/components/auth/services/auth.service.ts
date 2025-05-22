import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../../../../model/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000'

  userLogged = signal<User | null>(null)

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

  setUser(user: User){
    this.userLogged.set(user);
  }

  getUser(){
    return this.userLogged;
  }

  getSafeUser(user: User): Omit<User, 'password' | 'token'>{
    const { password, token, ...safeUser } = user;
    
    return safeUser;
  }

  getLoggedUser(): User | null{
    const user = localStorage.getItem('currentUser');
    if (!user) {
      throw new Error('No user is currently logged in.');
    }

    return JSON.parse(user) as User;
  }

  logout(): void {
    localStorage.removeItem('currentUser')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser')
  }
}
