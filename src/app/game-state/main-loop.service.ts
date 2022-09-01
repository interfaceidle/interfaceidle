import { Injectable,Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';

export interface ChangeField {
  field: string,
  value: number
}
export interface ValMax {
  value: number,
  max: number
}

export interface MainLoopProperties {
  lastTime: number;
  pause: boolean;
  bankedTicks: number;
  totalTicks: number;
  useBankedTicks: boolean,
  scientificNotation: boolean
}

@Injectable({
  providedIn: 'root'
})
export class MainLoopService {
  /**
   * Sends true on new day
   */
  tickSubject = new Subject<boolean>();
  slowTickSubject = new Subject<boolean>();
  actionSubject = new Subject<ChangeField>();
  upgradeSubject = new Subject<ChangeField>();
  pause = true;
  totalTicks = 0;
  lastTime: number = new Date().getTime();
  bankedTicks = 0;
  useBankedTicks = true;
  scientificNotation = false;
  offlineDivider = 10;
  seconds_per_tick=1;
  private snackBar: MatSnackBar;
  private snackBarObservable?: Subscription;

  constructor(
    private injector: Injector) {
      this.snackBar = this.injector.get(MatSnackBar);
  }

  getProperties(): MainLoopProperties {
    return {
      lastTime: this.lastTime,
      pause: this.pause,
      bankedTicks: this.bankedTicks,
      totalTicks: this.totalTicks,
      useBankedTicks: this.useBankedTicks,
      scientificNotation: this.scientificNotation
    }
  }

  setProperties(properties: MainLoopProperties) {
    this.pause = properties.pause;
    this.lastTime = properties.lastTime;
    const newTime = new Date().getTime();
    this.bankedTicks = properties.bankedTicks + ((newTime - this.lastTime) / this.seconds_per_tick);
    this.lastTime = newTime;
    this.totalTicks = properties.totalTicks || 0;
    this.useBankedTicks = properties.useBankedTicks ?? true;
    this.scientificNotation = properties.scientificNotation || false;
  }

  start() {
    window.setInterval(()=> {
      /*
      const newTime = new Date().getTime();
      let timeDiff = (newTime - this.lastTime) / 1000;

      if (timeDiff < this.seconds_per_tick){
        return;
      }
      timeDiff -= this.seconds_per_tick;
      this.bankedTicks += (timeDiff / this.seconds_per_tick);
      this.lastTime = newTime;

      if (this.pause) {
        this.bankedTicks++;
        return;
      }
      */
      this.tickSubject.next(true);
      /*
      if (this.bankedTicks >= 1){
        this.tickSubject.next(true);
        this.bankedTicks--;
      }
      */
    }, 50);
    window.setInterval(()=> {
      this.slowTickSubject.next(true);
    }, 1000);
  }

  toast(message: string, duration = 5000) {
    const snackBar = this.snackBar.open(message, "Close", { duration: duration, horizontalPosition: 'right', verticalPosition: 'bottom', panelClass: ['snackBar', 'darkMode'] });
    this.snackBarObservable = snackBar.onAction().subscribe(() => {
      this.snackBarObservable?.unsubscribe();
    })
  }
}
