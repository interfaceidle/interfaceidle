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

  things: { [key: string]:  ValMax } = {

  }


  constructor(
    private injector: Injector,
    mainLoopService: MainLoopService,
  ) {

    mainLoopService.tickSubject.subscribe(() => {
    });
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

