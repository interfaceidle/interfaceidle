import { Injectable, Injector } from '@angular/core';
import { MainLoopService, ChangeField, ValMax } from './main-loop.service';

export interface CharacterProperties {
  status: { [key: string]:  ValMax },
  traits: { [key: string]:  number },
  recovery: { [key: string]:  number },
  classes: string[]
}

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  statusFieldDescriptions: { [key: string]:  string } = {
    "health": "Your physical health",
    "stamina": "Your physical energy to get things done.",
    "energy": "Energy for your devices."
  };

  traitDescriptions = {
    "good": "Your physical health",
    "evil": "Your physical energy to get things done."
  };

  status: { [key: string]:  ValMax } = {};
  traits: { [key: string]:  number } = {};
  recovery: { [key: string]:  number } = {};
  classes: string[] = []; // the classes that you have held
  decisionPointAvailable = false;


  constructor(
    private injector: Injector,
    private mainLoopService: MainLoopService,
  ) {

    mainLoopService.actionSubject.subscribe((changeField: ChangeField) => {
      if (this.status[changeField.field] !== undefined) {
        this.status[changeField.field].value += changeField.value;
        if (this.status[changeField.field].value > this.status[changeField.field].max){
          this.status[changeField.field].value = this.status[changeField.field].max;
        } else if (this.status[changeField.field].value < 0){
          this.status[changeField.field].value = 0;
        }
      }
      if (this.traits[changeField.field] !== undefined) {
        this.traits[changeField.field] += changeField.value;
        if (this.traits[changeField.field] < 0){
          this.traits[changeField.field] = 0;
        }
      }
    });

    mainLoopService.upgradeSubject.subscribe((changeField: ChangeField) => {
      if (this.status[changeField.field]) {
        this.status[changeField.field].max += changeField.value;
      } else if (this.statusFieldDescriptions[changeField.field] !== undefined){
        this.status[changeField.field] = { value: 0, max: changeField.value };
      }
    });

    mainLoopService.slowTickSubject.subscribe(() => {
      for (const key in this.recovery ){
        if (this.status[key]){
          this.status[key].value += this.recovery[key];
          if (this.status[key].value > this.status[key].max){
            this.status[key].value = this.status[key].max;
          }
        }
      }
    });

  }

  checkFor(field: string, value: number): boolean{
    if (this.status[field] && this.status[field].value >= value){
      return true;
    }
    if (this.traits[field] && this.traits[field] >= value){
      return true;
    }

    return false;
  }

  getProperties(): CharacterProperties {
    return {
      status: this.status,
      traits: this.traits,
      classes: this.classes,
      recovery: this.recovery
    }
  }

  setProperties(properties: CharacterProperties) {
    this.status = properties.status || {health: {value: 10,max: 10}, stamina: {value: 10,max: 10}};
    this.traits = properties.traits || {good: 0, evil: 0};
    this.recovery = properties.recovery || {stamina: 1};
    this.classes = properties.classes || ["Street Rat"];
  }

}
