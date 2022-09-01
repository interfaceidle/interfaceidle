import { Injectable, Injector } from '@angular/core';
import { CharacterService } from './character.service';
import { MainLoopService } from './main-loop.service';
import { BigNumberPipe, CamelToTitlePipe } from '../app.component';
import { InventoryService } from './inventory.service';

export interface Activity {
  name: string,
  activityType: string,
  description: string,
  label: string,
  cooldown?: number,
  lastUse?: number,
  coolDownLeft?: number,
  locked: boolean,
  requirements: { [key: string]:  number },
  experience?: number,
  experienceRequired?: number,
  experienceRequiredGrowthFactor?: number,
  level?: number,
  maxLevel?: number,
  effects: { [key: string]:  number },
  upgradeEffect?:  { [key: string]:  number },
  levelUp?: { [key: string]:  number },
  unlock?:  { [key: string]:  number },
  lock?:  { [key: string]:  number },
  classTier?: number,
  bought?: number,
  canBuy?: number,
  tooltip: string
}

export interface ActivityProperties {
  activities: Activity[],
  unlockedTabs: string[],
  automatedActions: string[]
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  bigNumberPipe: BigNumberPipe;
  camelToTitlePipe: CamelToTitlePipe;
  activities: Activity[] = [];
  unlockedTabs: string[] = [];
  automatedActions: string[] = [];

  constructor(
    private injector: Injector,
    private mainLoopService: MainLoopService,
    private inventoryService: InventoryService,
    private characterService: CharacterService
  ) {
    this.bigNumberPipe = new BigNumberPipe(mainLoopService);
    this.camelToTitlePipe = new CamelToTitlePipe();

    mainLoopService.slowTickSubject.subscribe(() => {
      this.checkUnlocks();
    });

    mainLoopService.tickSubject.subscribe(() => {
      const now = new Date().getTime();
      for (const activity of this.activities){
        if (activity.coolDownLeft  !== undefined && activity.lastUse  !== undefined && activity.coolDownLeft > 0){
          activity.coolDownLeft -= now - activity.lastUse;
        }
      }
      for (const automatedAction of this.automatedActions){
        const activity = this.activities.find(x => x.name === automatedAction);
        if (activity && this.activityEnabled(activity)){
          this.doActivity(activity);
        }
      }
    });

  }

  getProperties(): ActivityProperties{
    return {
      activities: this.activities,
      unlockedTabs: this.unlockedTabs,
      automatedActions: this.automatedActions
    }
  }

  setProperties(properties: ActivityProperties){
    this.activities = properties.activities || this.getInitialActivities();
    this.unlockedTabs = properties.unlockedTabs || [];
    this.automatedActions = properties.automatedActions || [];
    for (const activity of this.activities){
      this.updateTooltip(activity);
    }
    setTimeout(() => this.checkUnlocks());
  }

  activityEnabled(activity: Activity){
    for (const requirement in activity.requirements){
      const value = activity.requirements[requirement];
      if (!this.inventoryService.checkFor(requirement, value) && !this.characterService.checkFor(requirement, value)){
        return false;
      }
    }
    if (activity.coolDownLeft && activity.coolDownLeft > 0){
      return false;
    }
    if (activity.bought !== undefined && activity.canBuy !== undefined && activity.bought >= activity.canBuy){
      return false;
    }
    if (activity.classTier !== undefined && activity.classTier !== this.characterService.classes.length){
      return false;
    }
    return true;
  }

  doActivity(activity: Activity){
    activity.lastUse = new Date().getTime();
    activity.coolDownLeft = activity.cooldown;
    for (const effect in activity.effects){
      this.mainLoopService.actionSubject.next({field: effect, value: activity.effects[effect]})
    }
    for (const effect in activity.upgradeEffect){
      this.mainLoopService.upgradeSubject.next({field: effect, value: activity.upgradeEffect[effect]})
    }
    if (activity.level !== undefined &&
      activity.maxLevel !== undefined &&
      activity.experience !== undefined &&
      activity.experienceRequired !== undefined &&
      activity.experienceRequiredGrowthFactor !== undefined &&
      activity.level < activity.maxLevel){
      activity.experience++;
      if (activity.experience >= activity.experienceRequired){
        activity.experience = 0;
        activity.level++;
        activity.experienceRequired *= activity.experienceRequiredGrowthFactor;
        for (const levelEffect in activity.levelUp){
          for (const effect in activity.effects){
            if (effect === levelEffect){
              activity.effects[effect] += activity.levelUp[levelEffect];
            }
          }
        }
      }
    }
    if (activity.bought !== undefined){
      activity.bought++;
    }
    this.updateTooltip(activity);
    this.checkUnlocks();
  }

  automateActivity(activity: Activity){
    const index = this.automatedActions.indexOf(activity.name);
    if (index >= 0) {
      this.automatedActions.splice(index, 1);
      // put the automator back
      this.mainLoopService.actionSubject.next({field: "automators", value: 1});
    } else if (this.inventoryService.checkFor("automators", 1)){
      this.mainLoopService.actionSubject.next({field: "automators", value: -1});
      this.automatedActions.push(activity.name);
    }
  }

  checkUnlocks(){
    for (const activity of this.activities){
      let unlockIt = true;
      for (const unlockRequirement in activity.unlock){
        const value = activity.unlock[unlockRequirement];
        if (!this.inventoryService.checkFor(unlockRequirement, value) && !this.characterService.checkFor(unlockRequirement, value)){
          unlockIt = false;
          break;
        }
      }
      let lockIt = false;
      for (const unlockRequirement in activity.lock){
        const value = activity.lock[unlockRequirement];
        if (this.inventoryService.checkFor(unlockRequirement, value) || this.characterService.checkFor(unlockRequirement, value)){
          lockIt = true;
          break;
        }
      }
      if (activity.locked && !lockIt && unlockIt){
        activity.locked = false;
      } else if (!activity.locked && lockIt){
        activity.locked = true;
        const index = this.automatedActions.indexOf(activity.name);
        if (index >= 0) {
          this.automatedActions.splice(index, 1);
          // put the automator back
          this.mainLoopService.actionSubject.next({field: "automators", value: 1});
        }
      }
    }

  }

  classChangeAvailable(): boolean{
    for (const activity of this.activities){
      if (activity.activityType === "classChange" && !activity.locked){
        return true;
      }
    }
    return false;
  }

  getInitialActivities(): Activity[] {
    return [
      // Actions
      {
        name: "beg",
        activityType: "action",
        description: "Go panhandling and see if you can scratch up a few creds.",
        label: "Beg",
        cooldown: 1000,
        locked: false,
        lastUse: 0,
        coolDownLeft: 0,
        requirements: {"stamina": 1},
        effects: {"credits": 0.1, "stamina": -1},
        levelUp: {"credits": 0.01},
        experience: 0,
        experienceRequired: 10,
        experienceRequiredGrowthFactor: 1,
        level: 0,
        maxLevel: 10,
        tooltip: ""
      },
      {
        name: "mugChildren",
        activityType: "action",
        description: "There are kids on this block that still have some lunch money. If you can corner one alone, you could take it.",
        label: "Mug Children",
        cooldown: 3000,
        locked: false,
        lastUse: 0,
        coolDownLeft: 0,
        requirements: {"stamina": 2},
        effects: {"credits": 1, "stamina": -2, "evil": 1},
        tooltip: ""
      },
      {
        name: "rest",
        activityType: "action",
        description: "Take a break and catch your breath.",
        label: "Rest",
        cooldown: 500,
        locked: false,
        lastUse: 0,
        coolDownLeft: 0,
        requirements: {},
        effects: {"stamina": 1},
        levelUp: {"stamina": 0.001},
        experience: 0,
        experienceRequired: 10,
        experienceRequiredGrowthFactor: 1.5,
        level: 0,
        maxLevel: 10000,
        tooltip: ""
      },
      // Upgrades
      {
        name: "improveCredits",
        activityType: "upgrade",
        description: "Take your busted credit chip into a shop for an upgrade.",
        label: "Expand Credit Chip",
        locked: true,
        requirements: {"credits": 10},
        effects: {"credits": -10},
        upgradeEffect: {"credits": 10},
        bought: 0,
        canBuy: 4,
        tooltip: ""
      },
      // Classes
      {
        name: "Back Alley Thug",
        activityType: "classChange",
        description: "He's helpless right now. A quick strike and a little patience and his interface will recognize that he's dead and accept a new owner. You're sure you can figure out how to use it eventually.",
        label: "Murder Him",
        classTier: 1,
        locked: true,
        requirements: { },
        unlock: { "evil":  10 },
        upgradeEffect: { "energy":  5, "nanobots": 1 },
        effects: { "evil": 1e6 },
        tooltip: ""
      },
      {
        name: "Self Taught Tinker",
        activityType: "classChange",
        description: "Finders keepers is the rule around here. The interface he's packing is worth more than you'd earn in a lifetime. You'll need to hire a hacker to re-key it to you, but it'll be worth every cred.",
        label: "Steal the Interface",
        requirements: { "credits": 50 },
        unlock: { "credits": 50 },
        classTier: 1,
        locked: true,
        upgradeEffect: { "energy":  5, "nanobots": 1 },
        effects: { "credits": -50 },
        tooltip: ""
      },
      {
        name: "Apprentice Roboticist",
        activityType: "classChange",
        description: "The old man needs help, and quick. If anyone else sees his eyes while he's in this condition, he's a dead man. You're his only hope. Help him to his feet and get him out of here before more trouble comes along.",
        label: "Help Him",
        requirements: { "credits": 20 },
        unlock: { "credits": 20 },
        classTier: 1,
        locked: true,
        lock: { "evil": 1 },
        upgradeEffect: { "energy":  5, "nanobots": 1 },
        effects: { "credits": -20 },
        tooltip: ""
      }
    ]
  }

  updateTooltip(activity: Activity){
    activity.tooltip = activity.description + "\n";
    if (activity.level !== undefined && activity.maxLevel !== undefined && activity.level >= activity.maxLevel){
      activity.tooltip += "Level " + activity.level + " (max)\n\n";
    } else if (activity.experienceRequired !== undefined && activity.experience !== undefined){
      activity.tooltip += "Level " + activity.level + " (Upgrades in " + Math.ceil(activity.experienceRequired - activity.experience) + " uses)\n\n";
    } else {
      activity.tooltip += "\n";
    }

    for (const effect in activity.effects){
      const value = activity.effects[effect];
      const plusMinus = (value >= 0) ? "+" : "-";
      const line = this.camelToTitlePipe.transform(effect) + ": " + plusMinus + this.bigNumberPipe.transform(value) + "\n";
      activity.tooltip += line;
    }
  }
}
