import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

const DISPLAY_NAME_KEY = 'userDisplayName';
const SETTINGS_NOTIFICATIONS_KEY = 'settingsNotifications';
const SETTINGS_LANGUAGE_KEY = 'settingsLanguage';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  accountForm!: FormGroup;
  passwordForm!: FormGroup;
  preferencesForm!: FormGroup;

  userEmail: string | null = null;
  userRole: string | null = null;
  accountSaved = false;
  passwordSaved = false;
  preferencesSaved = false;
  passwordError = '';

  languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' }
  ];

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.userRole = this.authService.getUserRole();

    const displayName = localStorage.getItem(DISPLAY_NAME_KEY) ?? '';
    const notifications = localStorage.getItem(SETTINGS_NOTIFICATIONS_KEY) !== 'false';
    const language = localStorage.getItem(SETTINGS_LANGUAGE_KEY) ?? 'en';

    this.accountForm = this.fb.group({
      displayName: [displayName, [Validators.maxLength(100)]],
      email: [{ value: this.userEmail ?? '', disabled: true }]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.preferencesForm = this.fb.group({
      notifications: [notifications],
      language: [language]
    });

    this.cdr.markForCheck();
  }

  private passwordMatchValidator(g: FormGroup): { [key: string]: boolean } | null {
    const newP = g.get('newPassword')?.value;
    const confirm = g.get('confirmPassword')?.value;
    if (newP && confirm && newP !== confirm) {
      return { passwordMismatch: true };
    }
    return null;
  }

  saveAccount(): void {
    if (this.accountForm.invalid) return;
    const displayName = this.accountForm.get('displayName')?.value ?? '';
    localStorage.setItem(DISPLAY_NAME_KEY, displayName);
    this.accountSaved = true;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.accountSaved = false;
      this.cdr.markForCheck();
    }, 3000);
  }

  savePassword(): void {
    this.passwordError = '';
    if (this.passwordForm.invalid) {
      if (this.passwordForm.hasError('passwordMismatch')) {
        this.passwordError = 'New password and confirmation do not match.';
      } else {
        this.passwordError = 'Please fill all fields; new password must be at least 6 characters.';
      }
      this.cdr.markForCheck();
      return;
    }
    // TODO: call auth API to change password, e.g. this.authService.changePassword(...)
    this.passwordSaved = true;
    this.passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
    this.cdr.markForCheck();
    setTimeout(() => {
      this.passwordSaved = false;
      this.cdr.markForCheck();
    }, 3000);
  }

  savePreferences(): void {
    if (this.preferencesForm.invalid) return;
    const notifications = this.preferencesForm.get('notifications')?.value ?? true;
    const language = this.preferencesForm.get('language')?.value ?? 'en';
    localStorage.setItem(SETTINGS_NOTIFICATIONS_KEY, String(notifications));
    localStorage.setItem(SETTINGS_LANGUAGE_KEY, language);
    this.preferencesSaved = true;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.preferencesSaved = false;
      this.cdr.markForCheck();
    }, 3000);
  }
}
