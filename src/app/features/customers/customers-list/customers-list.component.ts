import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersService, Customer } from '../../../core/services/customers.service';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersListComponent implements OnInit {
  private customersService = inject(CustomersService);
  private cdr = inject(ChangeDetectorRef);

  customers: Customer[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.customersService.getCustomers().subscribe({
      next: (list) => {
        this.customers = list;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  trackById(_index: number, customer: Customer): string {
    return customer.id;
  }

  viewCustomer(customer: Customer): void {
    console.log('View customer:', customer);
  }

  editCustomer(customer: Customer): void {
    console.log('Edit customer:', customer);
  }
}
