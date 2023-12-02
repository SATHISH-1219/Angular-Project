import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../Components/alert-dialog/alert-dialog.component';
import { AES, enc } from 'crypto-ts';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private dialog:MatDialog) { }

  login(username: string, password: string) {
    if (username === 'admin@admin.com' && password === 'Admin@12') {
      localStorage.setItem('currentUser', JSON.stringify({ name: 'Admin', username, password }));
      this.router.navigate(['/profile']);
    } else {
      const storedUser = localStorage.getItem(username) || 'null';
      if (storedUser) {

        //decrypt the data from the local storage and evaluate the user 
        const decryptedData = JSON.parse(AES.decrypt(storedUser, 'gdhquetdhsfaget').toString(enc.Utf8) || 'null'); // Parse once
        if (decryptedData && decryptedData.password === password) {
          const currentUser = {firstName:decryptedData.firstName, email:decryptedData.email }
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.openInvalidUserAlert('Login successful');
          this.router.navigate(['/profile']);
        } else {
          this.openInvalidUserAlert('Invalid username or password');
        }
      } else {
        this.openInvalidUserAlert('User not found');
      }
    }
  }



  openInvalidUserAlert(data:string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { message: data },
    });
  }
}
