import { Injectable, Injector } from '@angular/core';
import { MainLoopService } from './main-loop.service';

export interface CharacterProperties {
  credits: number;
}


@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  credits = 0;

  constructor(
    private injector: Injector,
    private mainLoopService: MainLoopService,
  ) {
    mainLoopService.tickSubject.subscribe(() => {
    });
  }

  getProperties(): CharacterProperties {
    return {
      credits: this.credits,

    }
  }

  setProperties(properties: CharacterProperties) {
    this.credits = properties.credits || 0;
  }

}
