import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promo-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromoBannerComponent {
  discount = '20%';
  title = 'Get Discount Voucher Up To 20%';
  description = 'Special offer for new customers';
}
