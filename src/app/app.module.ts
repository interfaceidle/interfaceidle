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
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { AchievementPanelComponent } from './achievement-panel/achievement-panel.component';
import { ChangelogPanelComponent } from './changelog-panel/changelog-panel.component';
import { StatusPanelComponent } from './status-panel/status-panel.component';

const materialModules = [
  MatDialogModule,
  MatIconModule,
  MatTabsModule,
  MatSidenavModule
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
    MatSnackBar
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
