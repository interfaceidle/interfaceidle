import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameStateService } from './game-state/game-state.service';
import { MainLoopService } from './game-state/main-loop.service';
import { HostListener } from '@angular/core';
import { environment } from '../environments/environment';

@Pipe({name: 'floor'})
export class FloorPipe implements PipeTransform {
    /**
     *
     * @param value
     * @returns {number}
     */
    transform(value: number): number {
        return Math.floor(value);
    }
}

@Pipe({name: 'camelToTitle'})
export class CamelToTitlePipe implements PipeTransform {
    /**
     *
     * @param value
     * @returns {string}
     */
     transform(value: string): string {
      value = value.split(/(?=[A-Z])/).join(' ');
      value = value[0].toUpperCase() + value.slice(1);
      return value;
  }
}

@Pipe({name: 'bigNumber'})
export class BigNumberPipe implements PipeTransform {
  constructor(public mainLoopService: MainLoopService){}

  /**
  *
  * @param value
  * @returns {string}
  */
  transform(value: number): string {
    if(!this.mainLoopService.scientificNotation){
      const suffixArray = ["", "k", "M", "B", "T", "q", "Q", "s"];
      if (value < 100 && !Number.isInteger(value) ){
        return value.toFixed(2) + '';
      } else if (value < 10000){
        return Math.round(value) + '';
      } else if (value >= Math.pow(10, (suffixArray.length)  * 3)){
        return value.toPrecision(3);
      } else {
        const numberPower = Math.floor(Math.log10(value));
        const numStr = Math.floor(value / Math.pow(10,numberPower - (numberPower % 3) - 2)) / 100;
        return numStr + suffixArray[Math.floor(numberPower / 3)];
      }
    } else {
      return value.toPrecision(3);
    }
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'interfaceidle';
  applicationVersion = environment.appVersion;

  activateSliders = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'Space'){
      this.mainLoopService.pause = !this.mainLoopService.pause;
      event.preventDefault();
    }
  }

  constructor(
    private mainLoopService: MainLoopService,
    public gameStateService: GameStateService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.gameStateService.loadFromLocalStorage();
    this.mainLoopService.start();
  }


}
