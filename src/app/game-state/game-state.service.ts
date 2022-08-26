import { Injectable } from '@angular/core';
import { ActivityService, ActivityProperties } from './activity.service';
import { BattleService, BattleProperties } from './battle.service';
import { LogProperties, LogService } from './log.service';
import { MainLoopProperties, MainLoopService } from './main-loop.service';
import { AchievementProperties, AchievementService } from './achievement.service';
import { CharacterProperties, CharacterService } from './character.service';
import { HomeService, HomeProperties } from './home.service';
import { InventoryService, InventoryProperties } from './inventory.service';

const LOCAL_STORAGE_GAME_STATE_KEY = 'gameState';

interface GameState {
  character: CharacterProperties,
  achievements: AchievementProperties,
  inventory: InventoryProperties,
  home: HomeProperties,
  activities: ActivityProperties,
  battles: BattleProperties,
  logs: LogProperties,
  mainLoop: MainLoopProperties,
  gameStartTimestamp: number,
  saveInterval: number,
  easyModeEver: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  lastSaved = new Date().getTime();
  isImport = false;
  isExperimental = window.location.href.includes("experimental");
  gameStartTimestamp = new Date().getTime();
  easyModeEver = false;
  saveInterval = 300; //In seconds

  constructor(
    private characterService: CharacterService,
    private homeService: HomeService,
    private inventoryService: InventoryService,
    private logService: LogService,
    private activityService: ActivityService,
    private battleService: BattleService,
    private mainLoopService: MainLoopService,
    private achievementService: AchievementService,

  ) {
    // @ts-ignore
    window['GameStateService'] = this;
    mainLoopService.tickSubject.subscribe(() => {
      const currentTime = new Date().getTime();
      if (currentTime - this.lastSaved >= this.saveInterval * 1000) {
        this.savetoLocalStorage();
      }
    });
  }

  changeAutoSaveInterval(interval: number): void{
    if(!interval || interval < 1) {
      interval = 1;
    } else if (interval > 900) {
      interval = 900;
    }
    this.saveInterval = interval;
    this.savetoLocalStorage();
  }

  savetoLocalStorage(): void {
    window.localStorage.setItem(LOCAL_STORAGE_GAME_STATE_KEY + this.getDeploymentFlavor(), this.getGameExport());
    this.lastSaved = new Date().getTime();
  }

  loadFromLocalStorage(): boolean {
    const gameStateSerialized = window.localStorage.getItem(LOCAL_STORAGE_GAME_STATE_KEY + this.getDeploymentFlavor());
    if (!gameStateSerialized) {
      // @ts-ignore
      this.characterService.setProperties({});
      // @ts-ignore
      this.achievementService.setProperties({});
      // @ts-ignore
      this.homeService.setProperties({});
      // @ts-ignore
      this.inventoryService.setProperties({});
      // @ts-ignore
      this.activityService.setProperties({});
      // @ts-ignore
      this.battleService.setProperties({});
      // @ts-ignore
      this.logService.setProperties({});
      // @ts-ignore
      this.mainLoopService.setProperties({});
    } else {
      this.importGame(gameStateSerialized);
    }
    return true;
  }

  importGame(value: string){
    const gameStateSerialized = decodeURIComponent(atob(value));
    const gameState = JSON.parse(gameStateSerialized) as GameState;
    this.characterService.setProperties(gameState.character);
    this.achievementService.setProperties(gameState.achievements);
    this.homeService.setProperties(gameState.home);
    this.inventoryService.setProperties(gameState.inventory);
    this.activityService.setProperties(gameState.activities);
    this.battleService.setProperties(gameState.battles);
    this.logService.setProperties(gameState.logs);
    this.mainLoopService.setProperties(gameState.mainLoop);
    this.gameStartTimestamp = gameState.gameStartTimestamp || new Date().getTime();
    this.saveInterval = gameState.saveInterval || 10;
  }

  getGameExport(): string{
    const gameState: GameState = {
      character: this.characterService.getProperties(),
      achievements: this.achievementService.getProperties(),
      inventory: this.inventoryService.getProperties(),
      home: this.homeService.getProperties(),
      activities: this.activityService.getProperties(),
      battles: this.battleService.getProperties(),
      logs: this.logService.getProperties(),
      mainLoop: this.mainLoopService.getProperties(),
      gameStartTimestamp: this.gameStartTimestamp,
      saveInterval: this.saveInterval || 300,
      easyModeEver: this.easyModeEver
    };
    let gameStateString = JSON.stringify(gameState);
    gameStateString = btoa(encodeURIComponent(gameStateString));
    return gameStateString;
  }

  hardReset(): void {
    window.localStorage.removeItem(LOCAL_STORAGE_GAME_STATE_KEY + this.getDeploymentFlavor());
    // eslint-disable-next-line no-self-assign
    window.location.href = window.location.href;
  }

  getDeploymentFlavor(){
    let href = window.location.href;
    if (href === "http://localhost:4200/"){
      // development, use the standard save
      return "";
    } else if (href === "https://interfaceidle.github.io/") {
      // deployed, use the standard save
      return "";
    } else if (href.includes("https://interfaceidle.github.io/")) {
      href = href.substring(0, href.length - 1); // trim the trailing slash
      return href.substring(href.lastIndexOf("/") + 1); //return the deployed branch so that the saves can be different for experimental branches
    }
    throw new Error("Hey, someone stole this game!"); // mess with whoever is hosting the game somewhere else and doesn't know enough javascript to fix this.
  }
}
