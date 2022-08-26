import { Component } from '@angular/core';
import { Activity, ActivityService } from '../game-state/activity.service';

@Component({
  selector: 'app-actions-panel',
  templateUrl: './actions-panel.component.html',
  styleUrls: ['./actions-panel.component.less']
})
export class ActionsPanelComponent {

  constructor(public activityService: ActivityService) {

  }

  actionClicked(activity: Activity, event: MouseEvent){
    this.activityService.doActivity(activity);
  }

}
