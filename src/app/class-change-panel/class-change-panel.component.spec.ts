import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassChangePanelComponent } from './class-change-panel.component';

describe('ClassChangePanelComponent', () => {
  let component: ClassChangePanelComponent;
  let fixture: ComponentFixture<ClassChangePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassChangePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassChangePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
