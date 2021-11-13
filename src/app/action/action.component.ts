import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Action } from './action';
import { ActionState } from './action-state.enum';
import { ActionSubmit } from './action-submit';
import { ActionService } from './action.service';
import * as moment from 'moment';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  public actions: Action[][] = [];
  public actionState = ActionState;
  public actionSubmits: { [id: string]: ActionSubmit } = {};
  public loggedIn = false;

  constructor(private readonly actionService: ActionService, private readonly authService: AuthService) {
    this.actionService.getActions().subscribe(
      (actions) => {
        this.actions = this.mapActions(actions);
      }
    );
    this.loggedIn = this.authService.isLoggedIn();
  }

  private mapActions(actions: Action[]) {
    let final = [];
    let temp = [];
    for (let actionIndex in actions) {
      this.actionService.isSubmittedForAction(actions[actionIndex]).subscribe(
        (submit) => {
          //@ts-ignore
          this.actionSubmits[actions[actionIndex].id] = submit;
        }
      );
      temp.push(actions[actionIndex]);
      //@ts-ignore
      if (actionIndex + 1 % 4 == 0) {
        final.push(temp);
        temp = [];
      }
    }
    if (actions.length % 4 !== 0) {
      final.push(temp);
    }
    return final;
  }

  public state(action: Action) {
    return this.actionService.actionState(action);
  }

  public submitted(action: Action) {
    //@ts-ignore
    return this.actionSubmits[action.id];
  }

  public isFree(action: Action) {
    //@ts-ignore
    return action.freeSpace > 0;
  }

  public submitForAction(action: Action) {
    if (action.id)
      this.actionService.submitForAction(action.id).subscribe(
        (submit) => {
          //@ts-ignore
          this.actionSubmits[action.id] = submit;
        }
      );
  }

  public prettifyDate(date?: Date){
    moment.locale("cs");
    return date? moment(date).calendar() : "";
  }

  ngOnInit(): void {
  }

}
