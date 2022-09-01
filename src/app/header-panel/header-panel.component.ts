import { Component } from '@angular/core';
import { ActivityService } from '../game-state/activity.service';
import { GameStateService } from '../game-state/game-state.service';
import { environment } from '../../environments/environment';
import { MainLoopService } from '../game-state/main-loop.service';
import { MatDialog } from '@angular/material/dialog';
import { ClassChangePanelComponent } from '../class-change-panel/class-change-panel.component';
import { AchievementPanelComponent } from '../achievement-panel/achievement-panel.component';
import { OptionsPanelComponent } from '../options-panel/options-panel.component';
import { ChangelogPanelComponent } from '../changelog-panel/changelog-panel.component';


@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.less']
})
export class HeaderPanelComponent {

   applicationVersion = environment.appVersion;

  constructor(public activityService: ActivityService,
    public gameStateService: GameStateService,
    private mainLoopService: MainLoopService,
    public dialog: MatDialog
    ) {

  }

  changelogClicked(){
    const dialogRef = this.dialog.open(ChangelogPanelComponent, {
      width: '700px',
      data: {someField: 'foo'}
    });

  }

  optionsClicked(){
    const dialogRef = this.dialog.open(OptionsPanelComponent, {
      width: '700px',
      data: {someField: 'foo'}
    });

  }

  achievementsClicked(){
    const dialogRef = this.dialog.open(AchievementPanelComponent, {
      width: '750px',
      data: {someField: 'foo'}
    });
  }

  classChangeClicked(){
    const dialogRef = this.dialog.open(ClassChangePanelComponent, {
      width: '700px',
      data: {someField: 'foo'}
    });

  }

  saveClicked(){
    this.gameStateService.savetoLocalStorage();
    this.mainLoopService.toast("Save Complete");
  }

  importClicked(event: any){
    const file = event.target.files[0];
    if(file) {
      const Reader = new FileReader();
      const gameStateService = this.gameStateService;
      Reader.readAsText(file, "UTF-8");
      Reader.onload = function () {
        if (typeof Reader.result === 'string') {
          gameStateService.importGame(Reader.result)
          gameStateService.savetoLocalStorage();
          // eslint-disable-next-line no-self-assign
          window.location.href = window.location.href;
        }
      }
    }
  }

  exportClicked(){
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(this.gameStateService.getGameExport())}`);
    element.setAttribute('download', `interface_idle_${this.gameStateService.isExperimental ? "Experimental" : "v" + environment.appVersion}_${new Date().toISOString()}.txt`);
    const event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

  hardResetClicked(event: Event): void {
    event.preventDefault();
    if (confirm("This will reset everything permanently. Are you sure?")){
      this.gameStateService.hardReset();
    }
  }

}
