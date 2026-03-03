import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styles: [`
    :host {
      display: block;
    }

    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 8, 20, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      box-sizing: border-box;
    }

    .dialog-modal {
      background: var(--bg-surface, #ffffff);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 8, 20, 0.2);
      width: 100%;
      max-width: 420px;
      max-height: 90vh;
      overflow: auto;
      box-sizing: border-box;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .dialog-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary, #000814);
    }

    .dialog-close {
      width: 32px;
      height: 32px;
      padding: 0;
      font-size: 1.5rem;
      line-height: 1;
      color: var(--text-muted, #000814);
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .dialog-close:hover {
      background: var(--border-light);
      color: var(--text-primary, #000814);
    }

    .dialog-body {
      padding: 1.5rem;
    }

    .dialog-actions-wrapper {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem 1.25rem;
      border-top: 1px solid var(--border-light);
    }

    .dialog-actions-wrapper:empty {
      display: none;
    }
  `]
})
/**
 * Shared dialog component. Use across the app for modals (e.g. Add product, Add customer).
 * Content: project body content and use attribute dialogActions for footer buttons.
 */
export class DialogComponent {
  @Input() isOpen = false;
  @Input() title = '';
  /** Optional max width (e.g. '420px', '560px'). Default 420px. */
  @Input() maxWidth = '420px';

  @Output() closed = new EventEmitter<void>();

  onOverlayClick(): void {
    this.closed.emit();
  }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  onClose(): void {
    this.closed.emit();
  }
}
