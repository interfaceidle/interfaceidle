import { Component } from '@angular/core';
import { Activity, ActivityService } from '../game-state/activity.service';

@Component({
  selector: 'app-upgrades-panel',
  templateUrl: './upgrades-panel.component.html',
  styleUrls: ['./upgrades-panel.component.less']
})
export class UpgradesPanelComponent {

  constructor(public activityService: ActivityService) {

  }

  upgradeClicked(activity: Activity, event: MouseEvent){
    this.activityService.doActivity(activity);
  }
}
