import { Injectable, Injector } from '@angular/core';
import { MainLoopService, ChangeField, ValMax } from './main-loop.service';

export interface Item {
  name: string;
  description: string;
}

export interface InventoryProperties {
  things: { [key: string]:  ValMax }
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {

  thingsFieldDescriptions: { [key: string]:  string } = {
    "credits": "The standard currency of New Boston. A better credit chip can store more credits.",
    "nanobots": "A tiny robot. With the right upgrades or in large numbers, these can be handy.",
    "automators": "An interface doesn't just let you control machine, it also lets you set up controls for your own actions. An automator lets you automatically repeat any action without even thinking about it.",
  };

  things: { [key: string]:  ValMax } = {}


  constructor(
    private injector: Injector,
    mainLoopService: MainLoopService,
  ) {

    mainLoopService.actionSubject.subscribe((changeField: ChangeField) => {
      if (this.things[changeField.field]) {
        this.things[changeField.field].value += changeField.value;
        if (this.things[changeField.field].value > this.things[changeField.field].max){
          this.things[changeField.field].value = this.things[changeField.field].max;
        } else if (this.things[changeField.field].value < 0){
          this.things[changeField.field].value = 0;
        }
      }
    });

    mainLoopService.upgradeSubject.subscribe((changeField: ChangeField) => {
      if (this.things[changeField.field]) {
        this.things[changeField.field].max += changeField.value;
      } else if (this.thingsFieldDescriptions[changeField.field] !== undefined){
        this.things[changeField.field] = { value: 0, max: changeField.value };
      }
    });
  }

  checkFor(field: string, value: number): boolean{
    if (this.things[field] && this.things[field].value >= value){
      return true;
    }
    return false;
  }

  getProperties(): InventoryProperties {
    return {
      things: this.things
    }
  }

  setProperties(properties: InventoryProperties) {
    this.things = properties.things || {credits: {value: 0,max: 10}};
  }



}

