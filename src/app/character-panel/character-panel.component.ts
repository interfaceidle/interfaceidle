import { Component } from '@angular/core';
import { CharacterService } from '../game-state/character.service';

@Component({
  selector: 'app-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.less']
})
export class CharacterPanelComponent {

   // Preserve original property order
   originalOrder = (): number => {
    return 0;
  }

  constructor(public characterService: CharacterService) {

  }



}
