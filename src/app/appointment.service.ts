import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private data = new Subject<object>()
  private tasks = new Subject<object>()

  dataChanged$ = this.data.asObservable();
  tasksChanged$ = this.tasks.asObservable();
  constructor() { }
  getValue(): object  {
    return this.data;
  }

  setValue(value: object): void {
    this.data.next(value);
  }
  setTask(value: object): void {
    this.tasks.next(value);
  }
}
