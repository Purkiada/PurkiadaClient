import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Action } from '../action/action';
import { ActionSubmit } from '../action/action-submit';
import { ActionService } from '../action/action.service';
import { AuthenticationType } from '../action/authentication-type.enum';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public actions: Action[] = [];
  public form?: FormGroup;
  public selected?: Action;
  public submittedUsers: ActionSubmit[] = [];
  public authenticationTypes: string[] = [];

  constructor(private readonly actionService: ActionService, private readonly alertService: AlertService) { 
    for(let type in AuthenticationType){
      this.authenticationTypes.push(type);
    }
    this.actionService.getActions().subscribe(
      (actions) => {
        this.actions = actions;
      }
    );
    this.setupForm();
  }

  private setupForm(action?: Action){
    this.form = new FormGroup({
      name: new FormControl(action?.name, [Validators.required]),
      subName: new FormControl(action?.subName, [Validators.required]),
      description: new FormControl(action?.description, [Validators.required]),
      registrationStart: new FormControl((action?.registrationStart)? this.actionService.formatDateTime(action.registrationStart) : undefined, [Validators.required]),
      registrationEnd: new FormControl((action?.registrationEnd)? this.actionService.formatDateTime(action.registrationEnd) : undefined, [Validators.required]),
      actionStart: new FormControl((action?.actionStart)? this.actionService.formatDateTime(action.actionStart) : undefined, [Validators.required]),
      actionEnd: new FormControl((action?.actionEnd)? this.actionService.formatDateTime(action.actionEnd) : undefined, [Validators.required]),
      maxUsers: new FormControl(action?.maxUsers, [Validators.required]),
      hidden: new FormControl((action?.hidden == undefined)? false : action.hidden, [Validators.required]),
      authenticationType: new FormControl(action?.authenticationType)
    });
  }

  public selectAction(action?: Action){
    this.setupForm(action);
    this.selected = action;
    if(action) this.actionService.getSubmitsByAction(action).subscribe(
      (submits) => {
        this.submittedUsers = submits;
      }
    );
  }

  public save(){
    if(this.form?.valid){
      let data: Action = this.form.value;
      data.id = this.selected?.id;
      if(!this.selected){
        this.actionService.createAction(data).subscribe(
          (action) => {
            this.actions.push(action);
            this.selectAction(undefined);
          }, (err) => {
            this.alertService.invokeAlert({icon: "bi-x-circle", status: "danger", "text": "Akci se nepodařilo vytvořit."});
          }
        );
      }else{
        this.actionService.updateAction(data).subscribe(
          (action) => {
            let found = this.actions.filter(value => value.id === action.id);
            this.actions[this.actions.indexOf(found[0])] = action;
            this.selectAction(action);
          }, (err) => {
            this.alertService.invokeAlert({icon: "bi-x-circle", status: "danger", "text": "Akci se nepodařilo upravit."});
          }
        );
      }
    }
  }

  public delete(){
    if(this.selected && confirm("Opravdu chcete smazat tuto akci?"))
      this.actionService.deleteAction(this.selected).subscribe(
        (action) => {
          let found = this.actions.filter(value => value.id === action.id);
          this.actions.splice(this.actions.indexOf(found[0]), 1);
          this.selectAction(undefined)
        }, (err) => {
          this.alertService.invokeAlert({icon: "bi-x-circle", status: "danger", "text": "Akci se nepodařilo smazat."});
        }
      );
  }

  public deleteSubmit(submit: ActionSubmit){
    if(this.selected && confirm("Opravdu chcete účastníka smazat?")){
      this.actionService.deleteSubmitByActionAndId(this.selected, submit).subscribe(
        (res) => {
          let found = this.submittedUsers.filter(value => value.id === res.id);
          this.submittedUsers.splice(this.submittedUsers.indexOf(found[0]), 1);
        }
      );
    }
  }

  public regenerateAccessToken(submit: ActionSubmit){
    if(this.selected && confirm("Opravdu chcete vygenerovat nové heslo?")){
      this.actionService.regenerateAccessTokenByActionAndId(this.selected, submit).subscribe(
        (res) => {
          let found = this.submittedUsers.filter(value => value.id === res.id);
          found[0].legacyAccessToken = res.legacyAccessToken;
        }
      );
    }
  }

  public getExportUrl(){
    //@ts-ignore
    return `${environment.backend.app}/v1/action/${this.selected.id}/export`;
  }


  ngOnInit(): void {
  }

}
