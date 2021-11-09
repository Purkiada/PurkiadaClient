import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Action } from '../action/action';
import { ActionService } from '../action/action.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public actions: Action[] = [];
  public form?: FormGroup;
  public selected?: Action;

  constructor(private readonly actionService: ActionService) { 
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
      hidden: new FormControl((action?.hidden == undefined)? false : action.hidden, [Validators.required])
    });
  }

  public selectAction(action?: Action){
    this.setupForm(action);
    this.selected = action;
  }

  public save(){
    if(this.form?.valid){
      let data: Action = this.form.value;
      data.id = this.selected?.id;
      if(!this.selected){
        this.actionService.createAction(data).subscribe(
          (action) => {
            this.actions.push(action);
          }
        );
      }else{
        this.actionService.updateAction(data).subscribe(
          (action) => {

          }
        );
      }
    }
  }

  public delete(){
    if(this.selected)
      this.actionService.deleteAction(this.selected).subscribe(
        (action) => {
          let found = this.actions.filter(value => value.id === action.id);
          this.actions.splice(this.actions.indexOf(found[0]), 1);
        }
      );
  }

  ngOnInit(): void {
  }

}
