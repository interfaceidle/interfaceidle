import { Injectable, Injector } from '@angular/core';
import { MainLoopService, ChangeField, ValMax } from './main-loop.service';

export interface CharacterProperties {
  status: { [key: string]:  ValMax }
}

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  status: { [key: string]:  ValMax } = {};

  constructor(
    private injector: Injector,
    private mainLoopService: MainLoopService,
  ) {
    mainLoopService.tickSubject.subscribe(() => {
    });
    mainLoopService.actionSubject.subscribe((changeField: ChangeField) => {
      if (this.status[changeField.field]) {
        this.status[changeField.field].value += changeField.value;
        if (this.status[changeField.field].value > this.status[changeField.field].max){
          this.status[changeField.field].value = this.status[changeField.field].max;
        } else if (this.status[changeField.field].value < 0){
          this.status[changeField.field].value = 0;
        }
      }

    });

  }

  getProperties(): CharacterProperties {
    return {
      status: this.status,

    }
  }

  setProperties(properties: CharacterProperties) {
    this.status = properties.status || {health: {value: 10,max: 10}, stamina: {value: 10,max: 10}};
  }

}
