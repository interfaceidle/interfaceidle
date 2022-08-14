import { Injectable, Injector } from '@angular/core';
import { MainLoopService } from './main-loop.service';

export interface Home {
  name: string;
  description: string;
}

export interface HomeProperties {
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private injector: Injector,
    mainLoopService: MainLoopService,

  ) {
      mainLoopService.tickSubject.subscribe(() => {
      });

  }

  getProperties(): HomeProperties {
    return {
    }
  }

  setProperties(properties: HomeProperties) {
  }

}
