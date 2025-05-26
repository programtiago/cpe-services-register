import { Component, effect, OnInit, Signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { User } from '../../../model/user';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  operationTitle: string = '';
  userLogged$: Observable<User | null> = this.authService.getUser();

  constructor(private router: Router, private authService: AuthService){
    if (this.router.url === '/refurbishment'){
      console.log(this.router.url)
      this.operationTitle = 'Refurbishment'
    }else if (this.router.url === '/repair'){
      console.log(this.router.url)
      this.operationTitle = 'Repair'
    }else{
      console.log(this.router.url)
      this.operationTitle = 'Operation'
    }
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
        this.updateOperationTitle();
    })
  }

  updateOperationTitle(){
    const currentUrl = this.router.url;
    switch (currentUrl){
      case '/refurbishment':
        this.operationTitle = 'Refurbishment'
        break;
      case '/repair':
        this.operationTitle = 'Repair';
        break;
      default:
        this.operationTitle = 'Operations'     
    }
  }

  navigateToPage(page: string){
    this.router.navigate(['employees/' + page]);
  }

  /*
  reload(){
   const currentUrl = this.router.url;
   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigateByUrl(currentUrl)
   })
  }
   */

  isAdminLoggedIn(): boolean {
    return this.authService.isLoggedIn() && this.authService.getLoggedUser()?.userRole === "Admin";
  }

  isEmployeeLoggedIn(): boolean {
    return this.authService.isLoggedIn() && this.authService.getLoggedUser()?.userRole === "Employee";
  }

  logout(){
    if (this.authService.isLoggedIn() && this.authService.getLoggedUser()?.userRole === "Employee") {
      this.router.navigate(['/login']) 
    }else{
      this.router.navigate(['/login']) 
    }
    this.authService.logout();
  }
}
