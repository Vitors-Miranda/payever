import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { DataPickerComponent } from './data-picker/data-picker.component';
import { ListComponent } from './list/list.component';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormDialogComponent,
    DataPickerComponent,
    ListComponent,
    NotificationComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}