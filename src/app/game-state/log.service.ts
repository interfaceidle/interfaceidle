import { Injectable } from '@angular/core';
import { MainLoopService } from './main-loop.service';

const LOG_MERGE_INTERVAL_MS = 1000;

export interface Log {
  message: string,
  timestamp: number
}

export interface LogProperties {
  logs: Log[]
}

@Injectable({
  providedIn: 'root'
})
export class LogService {

  logs: Log[] = [];

  constructor(
    mainLoopService: MainLoopService
  ) {
    mainLoopService.tickSubject.subscribe(() => {

    });
  }


  getProperties(): LogProperties {
    return {
      logs: this.logs,
    }
  }

  setProperties(properties: LogProperties) {
    this.logs = properties.logs || [];
  }


}
