import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryCardComponent {
  @Input() name: string = '';
  @Input() icon: string = '';
}
