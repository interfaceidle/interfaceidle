import { Component } from '@angular/core';
import { ActivityService } from '../game-state/activity.service';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.less']
})
export class MainPanelComponent  {

  constructor(public activityService: ActivityService
  ) { }


}
