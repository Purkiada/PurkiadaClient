import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Action } from './action';
import { ActionSubmit } from './action-submit';
import { Observable } from 'rxjs';
import { ActionState } from './action-state.enum';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  constructor(private readonly httpClient: HttpClient) { }

  public getActions(): Observable<Action[]> {
    return this.httpClient.get(`${environment.backend.app}/v1/action`).pipe(
      map(
        (res: any) => res.map((action: any) => this.resolveAction(action))
      )
    );
  }

  public getActionById(id: number): Observable<Action> {
    return this.httpClient.get(`${environment.backend.app}/v1/action/${id}`).pipe(
      map(
        (res: any) => <Action>res
      )
    );
  }

  public submitForAction(id: number) {
    return this.httpClient.put(`${environment.backend.app}/v1/action/${id}/submit`, undefined).pipe(
      map((res: any) => <ActionSubmit>res)
    );
  }

  public createAction(action: Action): Observable<Action> {
    return this.httpClient.put(`${environment.backend.app}/v1/action`, this.prepareForSendign(action)).pipe(
      map(
        (res: any) => {
          return this.resolveAction(res);
        }
      )
    );
  }

  public deleteAction(action: Action) {
    return this.httpClient.delete(`${environment.backend.app}/v1/action/${action.id}`).pipe(
      map(
        (res: any) => {
          return this.resolveAction(res);
        }
      )
    );
  }

  public updateAction(action: Action) {
    return this.httpClient.patch(`${environment.backend.app}/v1/action/${action.id}`, this.prepareForSendign(action)).pipe(
      map(
        (res: any) => {
          return this.resolveAction(res);
        }
      )
    );
  }

  public isSubmittedForAction(action: Action){
    return this.httpClient.get(`${environment.backend.app}/v1/action/${action.id}/submitted`).pipe(
      map(
        (res: any) => <ActionSubmit>res
      )
    );
  }

  public prepareForSendign(action: Action){
    let obj: any = action;
    //@ts-ignore
    obj.registrationStart = new Date(action.registrationStart).toISOString();
    //@ts-ignore
    obj.registrationEnd = new Date(action.registrationEnd).toISOString();
    //@ts-ignore
    obj.actionStart = new Date(action.actionStart).toISOString();
    //@ts-ignore
    obj.actionEnd = new Date(action.actionEnd).toISOString();
    return obj;
  }

  public resolveAction(obj: any): Action {
    let action = <Action>obj;
    action.registrationStart = new Date(obj["registrationStart"]);
    action.registrationEnd = new Date(obj["registrationEnd"]);
    action.actionStart = new Date(obj["actionStart"]);
    action.actionEnd = new Date(obj["actionEnd"]);
    return obj;
  }

  public actionState(action: Action): ActionState | undefined {
    let now = new Date();
    if (action.actionStart && action.actionEnd && action.registrationStart && action.registrationEnd){
      if (now < action.registrationStart) {
        return ActionState.BEFORE_REGISTRATION;
      } else if (now > action.registrationStart && now < action.registrationEnd) {
        return ActionState.REGISTRATION_IN_PROGRESS;
      } else if (now > action.registrationEnd && now < action.actionStart) {
        return ActionState.AFTER_REGISTRATION;
      } else if (now > action.actionStart && now < action.actionEnd) {
        return ActionState.ACTION_IN_PROGRESS;
      } else if (now > action.actionEnd) {
        return ActionState.AFTER_ACTION;
      }
    }
    return undefined;
  }

  public formatDateTime(date: Date, pattern = "YYYY-MM-DDTHH:mm:ss") {
    let month = (date.getMonth() + 1).toString();
    if (month.length == 1) {
      month = "0" + month;
    }

    let day = date.getDate().toString();
    if (day.length == 1) {
      day = "0" + day;
    }

    let hours = date.getHours().toString();
    if (hours.length == 1) {
      hours = "0" + hours;
    }

    let minutes = date.getMinutes().toString();
    if (minutes.length == 1) {
      minutes = "0" + minutes;
    }

    let seconds = date.getSeconds().toString();
    if (seconds.length == 1) {
      seconds = "0" + seconds;
    }

    pattern = pattern.replace("YYYY", date.getFullYear().toString());
    pattern = pattern.replace("MM", month);
    pattern = pattern.replace("DD", day);
    pattern = pattern.replace("HH", hours);
    pattern = pattern.replace("mm", minutes);
    pattern = pattern.replace("ss", seconds);
    return pattern;
  }
}
