import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../appointment.service';
import { MatTableModule, MatTableDataSource  } from '@angular/material/table';
import { Subscription } from 'rxjs';
import {CdkDrag, CdkDragStart, CdkDragMove, CdkDragEnd} from '@angular/cdk/drag-drop';
import {MatSnackBar, MatSnackBarRef, MatSnackBarModule} from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification/notification.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

export interface PeriodicElement {
  task: string;
  hour: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: true,
  imports: [MatTableModule, CdkDrag, CommonModule, MatIconModule, MatButtonModule],
})
export class ListComponent implements OnInit {
  private subscription: Subscription;
  public currentlyDay: number = 0
  public currentlyMonth: number = 0
  public currentlyYear: number = 0
  private data: object
  dragPosition:  number ;
  private tasks: { [key: string]: any } = {}

  constructor(private appointmentService: AppointmentService, private _snackBar: MatSnackBar) {
    this.subscription = this.appointmentService.dataChanged$.subscribe(
      (value) => {
        this.currentlyDay = value["day" as keyof typeof this.data];
        this.currentlyMonth = value["month" as keyof typeof this.data];
        this.currentlyYear = value["year" as keyof typeof this.data];
        this.clearList()
        this.listAppointment()
      }
    )
    
    this.subscription = this.appointmentService.tasksChanged$.subscribe(
      (value) => {
        if (Object.keys(this.tasks).length === 0) {
          this.tasks = value
        } else {
          // YEAR
          for (let i in Object.keys(this.tasks)) {
            const year = Object.keys(this.tasks)[i]

            // MONTH
            for (let j in Object.keys(this.tasks[year])) {
              const month = Object.keys(this.tasks[year])[j]

              // DAY
              for (let k in Object.keys(this.tasks[year][month])) {
                const day = Object.keys(this.tasks[year][month])[k]

                // TIME
                for (let l in Object.keys(this.tasks[year][month][day])) {
                  const time = Object.keys(this.tasks[year][month][day])[l]
                  const yearValue = Object.keys(value)[0]
                  const monthValue = Object.keys(value[yearValue as keyof typeof value])[0]
                  const dayValue = Object.keys(value[yearValue as keyof typeof value][monthValue as keyof typeof value])[0]
                  const timeValue = Object.keys(value[yearValue as keyof typeof value][monthValue as keyof typeof value][dayValue as keyof typeof value])[0]

                  if (year == yearValue) {
                    if (month == monthValue) {
                      if (day == dayValue) {

                        // TIME
                        if (time == timeValue) {
                          this.tasks[year][month][day][time] = value[yearValue as keyof typeof value][monthValue as keyof typeof value][dayValue as keyof typeof value][timeValue as keyof typeof value]
                        } else {
                          this.tasks[year][month][day][timeValue] = value[yearValue as keyof typeof value][monthValue as keyof typeof value][dayValue as keyof typeof value][timeValue as keyof typeof value]
                        }
                        // DAY
                      } else {
                        this.tasks[year][month][dayValue] = value[yearValue as keyof typeof value][monthValue as keyof typeof value][dayValue as keyof typeof value]
                      }
                      // MONTH
                    } else {
                      this.tasks[year][monthValue] = value[yearValue as keyof typeof value][monthValue as keyof typeof value]
                    }
                    // YEAR
                  } else {
                    this.tasks[yearValue] = value[yearValue as keyof typeof value]
                  }
                }

              }
            }
          }
          console.log(this.tasks)
        }
        this.clearList()
        this.listAppointment()
        this.openSnackBar()
      }
    )
  }
  delete(event : any, value : string){
    let time = value.split(" - ")[1].trim()
    time = time.split(" ")[0]
    if(time != undefined){
      delete this.tasks[this.currentlyYear][this.currentlyMonth][this.currentlyDay][time]
      if(this.isObjectEmpty(this.tasks[this.currentlyYear][this.currentlyMonth][this.currentlyDay])){
        delete this.tasks[this.currentlyYear][this.currentlyMonth]
        if(this.isObjectEmpty(this.tasks[this.currentlyYear])){
          delete this.tasks[this.currentlyYear]
        } 
      }
      this.clearList()
      this.listAppointment()
    }
  }
  isObjectEmpty(obj : object) {
    return JSON.stringify(obj) === '{}';
  }
  openSnackBar() {
    this._snackBar.openFromComponent(NotificationComponent, {
      duration: 3 * 1000,
    });
  }
  onDragEnded(event: CdkDragEnd): void {
    this.dragPosition = event.source.getFreeDragPosition().y;
    const element = event.source;
    const draggedElement = event.source.element.nativeElement
    let time = draggedElement.textContent?.split(" - ")[1].trim()
    let oldTask
    if(time != undefined){
        time = time.split(" ")[0]
        oldTask = this.tasks[this.currentlyYear][this.currentlyMonth][this.currentlyDay][time]
        delete this.tasks[this.currentlyYear][this.currentlyMonth][this.currentlyDay][time]
    }
    const stepsChanged = Math.floor(this.dragPosition / 60);
    let splitTime = time?.split(":")
    if(splitTime){
      let time = Number(splitTime[0]) + stepsChanged
      time < 1 ? time = 1 : time = time
      time > 24 ? time = 24 : time = time
      let newtime = time + ":" + splitTime[1]
      this.tasks[this.currentlyYear][this.currentlyMonth][this.currentlyDay][newtime] = oldTask
      this.clearList()
      this.listAppointment()
      element.reset()
    }
  }
  ngOnInit(): void {
    for (let i = 1; i <= 12; i++) {
      ELEMENT_DATA.push({ hour: `${i}am`, task: '' })
    }
    for (let i = 1; i <= 12; i++) {
      ELEMENT_DATA.push({ hour: `${i}pm`, task: '' })
    }
  }
  setDay(value: number) {
    this.currentlyDay = value
  }
  clearList(){
    for(const item of ELEMENT_DATA){
        item.task = ""
        const dataSource = new MatTableDataSource(ELEMENT_DATA);
        dataSource.data = ELEMENT_DATA;    
    }
  }
  monthConvert(value: number){
    switch (value) {
      case 1:
        return 'Feb';
      case 2:
        return 'Mar';
      case 3:
        return 'Apr';
      case 4:
        return 'May';
      case 5:
        return 'Jun';
      case 6:
        return 'Jul';
      case 7:
        return 'Aug';
      case 8:
        return 'Sep';
      case 9:
        return 'Oct';
      case 10:
        return 'Nov';
      case 11:
        return 'Dec';
      default:
        return 'Jan';
    }
  }
  listAppointment() {
    // YEAR
    for (let i in Object.keys(this.tasks)) {
      const year = Object.keys(this.tasks)[i]
      
      if (this.currentlyYear == Number(year)) {

        // MONTH
        for (let j in Object.keys(this.tasks[year])) {
          const month = Object.keys(this.tasks[year])[j]
          if (this.currentlyMonth == Number(month)) {

            // DAY
            for (let k in Object.keys(this.tasks[year][month])) {
              const day = Object.keys(this.tasks[year][month])[k]
              if (this.currentlyDay == Number(day)) {
              for(let time of Object.keys(this.tasks[year][month][day])){
                  const task = this.tasks[year][month][day][time]
                  const approximateTime = Math.floor(Number(time.replace(":", ".")))
                  let timeWritten

                  if(approximateTime > 12) {
                    timeWritten = (approximateTime - 12) + "pm"
                  }else{
                    timeWritten =  approximateTime + "am"
                  }
                  for(const item of ELEMENT_DATA){
                    if(item.hour === timeWritten){
                      item.task = ""
                      item.task = ` ${task} - ${time}`
                      const dataSource = new MatTableDataSource(ELEMENT_DATA);
                      dataSource.data = ELEMENT_DATA;    
                    }
                  }
                }
              }
            }
          }

        }
      }

    }
  }
  displayedColumns: string[] = ['hour', 'task'];
  dataSource = ELEMENT_DATA;
}
