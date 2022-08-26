import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, CamelToTitlePipe, FloorPipe, BigNumberPipe } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { AchievementPanelComponent } from './achievement-panel/achievement-panel.component';
import { ChangelogPanelComponent } from './changelog-panel/changelog-panel.component';
import { StatusPanelComponent } from './status-panel/status-panel.component';
import { HeaderPanelComponent } from './header-panel/header-panel.component';
import { ActionsPanelComponent } from './actions-panel/actions-panel.component';

const materialModules = [
  MatDialogModule,
  MatIconModule,
  MatTabsModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule,
  MatButtonModule,
];

@NgModule({
  declarations: [
    AppComponent,
    FloorPipe,
    CamelToTitlePipe,
    BigNumberPipe,
    AchievementPanelComponent,
    ChangelogPanelComponent,
    StatusPanelComponent,
    HeaderPanelComponent,
    ActionsPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    ...materialModules
  ],
  exports: [
    ...materialModules
  ],
  providers: [
    TitleCasePipe,
    BigNumberPipe,
    MatSnackBar,
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { disableTooltipInteractivity: true, showDelay: 500 } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
