import { Component } from '@angular/core';
import { Activity, ActivityService } from '../game-state/activity.service';
import { CharacterService } from '../game-state/character.service';
import { decisionPointText, classChangeText } from '../game-state/textResources';

@Component({
  selector: 'app-class-change-panel',
  templateUrl: './class-change-panel.component.html',
  styleUrls: ['./class-change-panel.component.less']
})
export class ClassChangePanelComponent {

  text: string;
  showButtons = true;

  constructor(public activityService: ActivityService,
    characterService: CharacterService
  ) {
      this.text = decisionPointText[characterService.classes[characterService.classes.length - 1]];
  }

  click(activity: Activity, event: MouseEvent){
    this.activityService.doActivity(activity);
    this.showButtons = false;
    this.text = classChangeText[activity.name];
  }
}
