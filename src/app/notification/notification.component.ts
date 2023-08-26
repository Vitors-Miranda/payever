import { Component, inject } from '@angular/core';
import {MatSnackBar, MatSnackBarRef, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule],
})
export class NotificationComponent {
  snackBarRef = inject(MatSnackBarRef);
}
