import { Injectable, Injector } from '@angular/core';
import { MainLoopService } from './main-loop.service';

export interface Activity {
  name: string[];
  description: string[];
  //requirements: CharacterAttribute[];
  //consequence: (() => void)[];
  unlocked: boolean;
}

export interface ActivityProperties {
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  activities: Activity[];

  constructor(
    mainLoopService: MainLoopService
  ) {
    this.activities = [];

    mainLoopService.tickSubject.subscribe(() => {

    });

  }


  getProperties(): ActivityProperties{

    return {
    }
  }

  setProperties(properties: ActivityProperties){

  }


}
