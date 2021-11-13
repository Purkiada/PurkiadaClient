import { Component, OnInit } from '@angular/core';
import { Alert } from './alert';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  public alerts: Alert[];

  constructor(private readonly alertService: AlertService) { 
    this.alerts = [];
    this.alertService.getAlerts().subscribe(
      (alert) => {
        this.alerts.push(alert);
      }
    );
  }

  ngOnInit(): void {
  }

  public closeAlert(alert: Alert){
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}
