import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../../model/user';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000'

  userLogged = signal<User | null>(null)

  constructor(private http: HttpClient) { 
    const storedUser = localStorage.getItem('user');

    if (storedUser) this.userLogged.set(JSON.parse(storedUser))
  }

  login(workerno: string, password: string){
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const user = users.find(user => user.workerno.toString() === workerno && user.password === password);
        if (user){
          localStorage.setItem('user', JSON.stringify(user))
          return user;
        }
        throw new Error('Invalid workerno or password');
      })
    )
  }

  setUser(user: User){
    localStorage.setItem('user', JSON.stringify(user))
    this.userLogged.set(user);
  }

  getUser():Observable<User | null>{
    return toObservable(this.userLogged)
  }

  getSafeUser(user: User): Omit<User, 'password' | 'token'>{
    const { password, token, ...safeUser } = user;
    
    return safeUser;
  }

  getLoggedUser(): User | null{
    const user = localStorage.getItem('user');

    if (user != null){
      return JSON.parse(user) as User;
    }
    
    return null;
  }

  logout(): void {
    localStorage.removeItem('user')
    this.userLogged.set(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user')
  }
}
