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
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      box-sizing: border-box;
    }

    .dialog-modal {
      background: var(--bg-surface, #fff);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
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
      border-bottom: 1px solid var(--border-light, #eee);
    }

    .dialog-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .dialog-close {
      width: 32px;
      height: 32px;
      padding: 0;
      font-size: 1.5rem;
      line-height: 1;
      color: #666;
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .dialog-close:hover {
      background: #f0f0f0;
      color: #1a1a1a;
    }

    .dialog-body {
      padding: 1.5rem;
    }

    .dialog-actions-wrapper {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem 1.25rem;
      border-top: 1px solid var(--border-light, #eee);
    }

    .dialog-actions-wrapper:empty {
      display: none;
    }
  `]
})
export class DialogComponent {
  @Input() isOpen = false;
  @Input() title = '';

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
