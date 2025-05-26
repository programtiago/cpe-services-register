import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../../../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000'

  userLogged = signal<User | null>(null)

  constructor(private http: HttpClient) { 
    const storedUser = localStorage.getItem('user');

    if (storedUser){
      this.userLogged.set(JSON.parse(storedUser))
    }
  }

  login(workerno: string, password: string){
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const user = users.find(user => user.workerno.toString() === workerno && user.password === password);
        console.log('Logged in user:', user);
        if (user){
          console.log("User found: " + user.workerno + " " + user.password)
          localStorage.setItem('user', JSON.stringify(user))
          return user;
        }
        console.log("User not found: " + workerno + " " + password)
        throw new Error('Invalid workerno or password');
      })
    )
  }

  setUser(user: User){
    localStorage.setItem('user', JSON.stringify(user))
    this.userLogged.set(user);
  }

  getUser(){
    return this.userLogged.asReadonly();
  }

  getSafeUser(user: User): Omit<User, 'password' | 'token'>{
    const { password, token, ...safeUser } = user;
    
    return safeUser;
  }

  getLoggedUser(): User | null{
    const user = localStorage.getItem('user');
    
    return user ? JSON.parse(user) as User : null;
  }

  logout(): void {
    localStorage.removeItem('user')
    this.userLogged.set(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user')
  }
}
