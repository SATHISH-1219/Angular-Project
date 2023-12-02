import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {

  // Storing profile data
  profileData: { name: string; email: string } = { name: '', email: '' };

  // Getting user data from local storage
  constructor(private router: Router) {
    const user = JSON.parse(localStorage.getItem('currentUser') || '[]');
    if (user == '') {
      this.router.navigate(['/login']);
    }

    if (user) {
      this.profileData = {
        name: user.firstName,
        email: user.email,
      };
    } else {
      this.logout();
    }
  }

  // Logout current user
  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('currentUser');
  }

  shop() {
    this.router.navigate(['/products']);
  }
}
