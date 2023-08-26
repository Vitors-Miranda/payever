import { Component, OnInit,  } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { AppointmentService } from '../appointment.service';

@Component({
  selector: 'app-data-picker',
  templateUrl: './data-picker.component.html',
  styleUrls: ['./data-picker.component.css'],
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatCardModule,
    MatButtonModule,
    FormDialogComponent
  ],
})

export class DataPickerComponent implements OnInit {
  constructor(public dialog: MatDialog, private appointmentService: AppointmentService) {}
  year: number = new Date().getFullYear()
  month: number = new Date().getMonth()
  day: number = new Date().getDate()

  ngOnInit(): void {
    this.sendData()
  }
  openDialog() {
    this.dialog.open(FormDialogComponent, {
      data: {day: this.day, month: this.month, year: this.year},
    });

  }
  
  daySelected(){
    if(this.selected != null){
      this.year = this.selected.getFullYear()
      this.month = this.selected.getMonth() 
      this.day = this.selected.getDate()
      this.sendData() 
    }
  }
  sendData() {
    this.appointmentService.setValue({
      "year" : this.year,
      "month" : this.month,
      "day" : this.day,
    })
  }
  selected: Date | null; 
}
