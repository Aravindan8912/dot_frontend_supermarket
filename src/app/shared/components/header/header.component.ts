import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  userName: string = 'Patricia';
  searchQuery: string = '';

  ngOnInit(): void {
    const email = this.authService.getUserEmail();
    if (email) {
      // Extract name from email or use email username
      this.userName = email.split('@')[0];
      // Capitalize first letter
      this.userName = this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
      this.cdr.markForCheck();
    }
  }

  onSearch(): void {
    // Handle search functionality
    console.log('Searching for:', this.searchQuery);
  }
}
