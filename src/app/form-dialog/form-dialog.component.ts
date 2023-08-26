import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {Dialog, DialogRef, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AppointmentService } from '../appointment.service';
import { ListComponent } from '../list/list.component';
import { Subscription } from 'rxjs';

export interface DialogData {
  day: number;
  month: number;
  year: number;
}
@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, CommonModule],
})

export class FormDialogComponent{

  private subscription: Subscription;
  private day: number
  private month: number
  private year: number

  constructor(public dialogRef: MatDialogRef<FormDialogComponent>, @Inject(DIALOG_DATA) public data: DialogData, private appointmentService: AppointmentService) {
    this.day = this.data["day" as keyof typeof this.data]
    this.month = this.data["month" as keyof typeof this.data]
    this.year = this.data["year" as keyof typeof this.data]
    
  }
  currentlyTime : string = this.takeCurrentlyTime()
  form = {
    title: "",
    time: this.currentlyTime
  }
  
  takeCurrentlyTime(): string {
    const currentlyTime = new Date();
    const hour = currentlyTime.getHours().toString().padStart(2, '0');
    const minutes = currentlyTime.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minutes}`;
  }
  sendForm(event: Event) {
    const object: { [key: string]: any } = {}
    object[this.year] = {}
    object[this.year][this.month] = {}
    object[this.year][this.month][this.day] = {}
    object[this.year][this.month][this.day][this.form.time] = this.form.title
    console.log(object)
    this.appointmentService.setTask(object)
  }

}
