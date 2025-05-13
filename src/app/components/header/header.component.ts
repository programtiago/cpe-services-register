import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  operationTitle: string = 'Operations';

  constructor(private router: Router){}

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
    this.router.navigate([page]);
  }

}
