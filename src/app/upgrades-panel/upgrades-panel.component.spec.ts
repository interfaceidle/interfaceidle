import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradesPanelComponent } from './upgrades-panel.component';

describe('UpgradesPanelComponent', () => {
  let component: UpgradesPanelComponent;
  let fixture: ComponentFixture<UpgradesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpgradesPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
