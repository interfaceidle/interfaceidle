import { Injectable, Injector } from '@angular/core';
import { LogService } from './log.service';
import { CharacterService } from './character.service';
import { InventoryService } from './inventory.service';
import { HomeService } from './home.service';
import { MainLoopService } from './main-loop.service';
import { BattleService } from './battle.service';
import { GameStateService } from './game-state.service';
import { ActivityService } from './activity.service';

export interface Achievement {
  name: string;
  /**Necessary for name changes due to save structure using name (above) instead of ids */
  displayName?: string;
  description: string;
  hint: string;
  check: () => boolean;
  effect: () => void;
  unlocked: boolean;
}

export interface AchievementProperties {
  unlockedAchievements: string[]
}

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  gameStateService?: GameStateService;
  unlockedAchievements: string[] = [];


  constructor(
    private mainLoopService: MainLoopService,
    private injector: Injector,
    private logService: LogService,
    private characterService: CharacterService,
    private inventoryService: InventoryService,
    private battleService: BattleService,
    private homeService: HomeService,
    private activityService: ActivityService,
  ) {
    this.mainLoopService.tickSubject.subscribe(() => {
      for (const achievement of this.achievements) {
        if (!this.unlockedAchievements.includes(achievement.name)){
          if (achievement.check()){
            this.unlockAchievement(achievement, true);
          }
        }
      }
    });
  }

  // important: achievement effects must be idempotent as they may be called multiple times
  achievements: Achievement[] = [
    {
      name: "upgrades",
      displayName: "Upgrades!",
      description: "You unlocked your first upgrade!",
      hint: "You'll need some money to get along in this world.",
      check: () => {
        return this.inventoryService.things["credits"].value >= 10;
      },
      effect: () => {
        if (!this.activityService.unlockedTabs.includes("upgrades")){
          this.activityService.unlockedTabs.push("upgrades");
        }
      },
      unlocked: false
    }
  ];

  unlockAchievement(achievement: Achievement, newAchievement: boolean){
    if (newAchievement){
      this.unlockedAchievements.push(achievement.name);
      // check if gameStateService is injected yet, if not, inject it (circular dependency issues)
      if (!this.gameStateService){
        this.gameStateService = this.injector.get(GameStateService);
      }
      setTimeout(() => this.gameStateService?.savetoLocalStorage());
      this.mainLoopService.toast('Achievement Unlocked: ' + achievement.displayName);
    }
    achievement.effect();
    achievement.unlocked = true;
  }

  getProperties(): AchievementProperties {
    return {
      unlockedAchievements: this.unlockedAchievements
    }
  }

  setProperties(properties: AchievementProperties) {
    this.unlockedAchievements = properties.unlockedAchievements || [];
    for (const achievement of this.achievements) {
      if (this.unlockedAchievements.includes(achievement.name)){
        this.unlockAchievement(achievement, false);
      }
    }
  }

}
