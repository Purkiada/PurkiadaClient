import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Alert } from './alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private readonly alertRegistry: Subject<Alert>;

  constructor() { 
    this.alertRegistry = new Subject();
  }

  public invokeAlert(alert: Alert){
    this.alertRegistry.next(alert);
  }

  public getAlerts(){
    return this.alertRegistry.asObservable();
  }
}
