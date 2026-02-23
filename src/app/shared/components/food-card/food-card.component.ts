import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodCardComponent {
  @Input() name: string = '';
  @Input() price: string = '';
  @Input() image: string = '';
  @Input() discount?: string;
  @Input() rating: number = 5;
  @Input() showFavorite: boolean = true;
  @Input() showDistance: boolean = false;
  @Input() distance?: string;
  @Input() deliveryTime?: string;
  @Output() addToCart = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<void>();

  isFavorite: boolean = false;

  onAddToCart(): void {
    this.addToCart.emit();
  }

  onToggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.toggleFavorite.emit();
  }
}
