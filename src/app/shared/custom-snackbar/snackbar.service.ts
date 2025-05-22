import { Injectable} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from './custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
//Snackbar responsible to show the snackbar and show the correctly message with the icon 
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) {
  }

  error(message: string){
    this.show(message, 'error', 'error')  
  }

  success(message: string){
    this.show(message, 'check_circle', 'success')
  }

  warning(message: string){
    this.show(message, 'warning', 'warning')
  }

  private show(message: string, icon: string = '', type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000):void{
    this.snackbar.openFromComponent(CustomSnackbarComponent, {
      duration,
      data: { message, icon, type },
      panelClass: [`snackbar-${type}`]
    });
  }
}
