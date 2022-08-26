import { Component } from '@angular/core';
import { CharacterService } from '../game-state/character.service';
import { InventoryService } from '../game-state/inventory.service';

@Component({
  selector: 'app-status-panel',
  templateUrl: './status-panel.component.html',
  styleUrls: ['./status-panel.component.less']
})
export class StatusPanelComponent {

  // Preserve original property order
  originalOrder = (): number => {
    return 0;
  }
  constructor(
    public characterService: CharacterService,
    public inventoryService: InventoryService
  ) { }

}
