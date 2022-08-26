import { Injectable, Injector } from '@angular/core';
import { CharacterService } from './character.service';
import { MainLoopService } from './main-loop.service';


export interface Activity {
  name: string,
  description: string,
  label: string,
  cooldown: number,
  requirements: { [key: string]:  number },
  effects: { [key: string]:  number }
}

export interface ActivityProperties {
  activities: Activity[]
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  activities: Activity[] = [];

  constructor(
    private mainLoopService: MainLoopService,
    private characterService: CharacterService
  ) {

    mainLoopService.tickSubject.subscribe(() => {

    });

  }


  getProperties(): ActivityProperties{
    return {
      activities: this.activities
    }
  }

  setProperties(properties: ActivityProperties){
    this.activities = properties.activities || this.getInitialActivities();
  }

  activityEnabled(activity: Activity){
    return true;
  }

  doActivity(activity: Activity){
    for (const effect in activity.effects){
      this.mainLoopService.actionSubject.next({field: effect, value: activity.effects[effect]})
    }
  }

  getInitialActivities(): Activity[] {
    return [
      {
        name: "beg",
        description: "Go panhandling and see if you can scratch up a few creds.",
        label: "Beg",
        cooldown: 1,
        requirements: {},
        effects: {"credits": 1}
      },
      {
        name: "",
        description: "",
        label: "",
        cooldown: 1,
        requirements: {},
        effects: {},
      }
    ]
  }

}
