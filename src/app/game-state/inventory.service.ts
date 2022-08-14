import { Injectable, Injector } from '@angular/core';
import { MainLoopService } from './main-loop.service';

export interface Item {
  name: string;
  description: string;
}

export interface InventoryProperties {
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {

  constructor(
    private injector: Injector,
    mainLoopService: MainLoopService,
  ) {

    mainLoopService.tickSubject.subscribe(() => {
    });
  }

  getProperties(): InventoryProperties {
    return {
    }
  }

  setProperties(properties: InventoryProperties) {
  }



}

