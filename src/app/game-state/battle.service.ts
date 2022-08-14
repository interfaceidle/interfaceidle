import { Injectable, Injector } from '@angular/core';
import { LogService } from './log.service';
import { CharacterService } from '../game-state/character.service';
import { InventoryService, Item } from '../game-state/inventory.service';
import { MainLoopService } from './main-loop.service';

export interface Enemy {
  name: string,
  health: number,
  accuracy: number,
  attack: number,
  defense: number,
  loot: Item[],
}

export interface BattleProperties {
}

@Injectable({
  providedIn: 'root'
})
export class BattleService {

  constructor(
    private injector: Injector,
    private logService: LogService,
    private characterService: CharacterService,
    private inventoryService: InventoryService,
    mainLoopService: MainLoopService,

  ) {

    mainLoopService.tickSubject.subscribe(() => {
    });

  }

  getProperties(): BattleProperties {
    return {
    }
  }

  setProperties(properties: BattleProperties) {
  }

}
