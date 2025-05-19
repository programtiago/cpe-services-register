import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { coerceToArray } from '../../../../../utils/array-utils';

@Injectable({
  providedIn: 'root'
})
//Snackbar responsible to show the snackbar and show the correctly message
export class SnackbarService {

  constructor(private snackbar: MatSnackBar, private zone: NgZone) {
  }

  error(message: string){
    this.show(message, { panelClass: ['snackbar-container', 'error']})  
  }

  sucess(message: string){
    this.show(message, { panelClass: ['snackbar-container', 'success']})
  }

  warning(message: string){
    this.show(message, { panelClass: ['snackbar-container', 'warning']})
  }

  private show(message: string, customConfig: MatSnackBarConfig = {}){
    const customClasses = coerceToArray(customConfig.panelClass)
      .filter((v) => typeof v === 'string') as string[]

    this.zone.run(() => {
      this.snackbar.open(
        message,
        "",
        {... customConfig, panelClass: ['snackbar-container', ...customClasses]})
    }) 
  }
}
