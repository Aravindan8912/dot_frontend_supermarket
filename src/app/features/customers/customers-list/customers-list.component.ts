import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomersService, Customer, CreateCustomerRequest } from '../../../core/services/customers.service';
import { DialogComponent } from '../../../shared/components/dialog';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent],
  templateUrl: './customers-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersListComponent implements OnInit {
  private customersService = inject(CustomersService);
  private cdr = inject(ChangeDetectorRef);

  customers: Customer[] = [];
  isLoading = false;

  showAddCustomerDialog = false;
  newCustomer: CreateCustomerRequest = { name: '', email: '', phone: '' };
  addCustomerSaving = false;
  addCustomerError: string | null = null;

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

  openAddCustomerDialog(): void {
    this.showAddCustomerDialog = true;
    this.newCustomer = { name: '', email: '', phone: '' };
    this.addCustomerError = null;
    this.addCustomerSaving = false;
    this.cdr.markForCheck();
  }

  closeAddCustomerDialog(): void {
    this.showAddCustomerDialog = false;
    this.addCustomerError = null;
    this.addCustomerSaving = false;
    this.cdr.markForCheck();
  }

  saveCustomer(): void {
    const name = this.newCustomer.name?.trim();
    const email = this.newCustomer.email?.trim();
    const phone = this.newCustomer.phone?.trim();

    if (!name) {
      this.addCustomerError = 'Customer name is required';
      this.cdr.markForCheck();
      return;
    }
    if (!email) {
      this.addCustomerError = 'Email is required';
      this.cdr.markForCheck();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.addCustomerError = 'Enter a valid email address';
      this.cdr.markForCheck();
      return;
    }

    this.addCustomerError = null;
    this.addCustomerSaving = true;
    this.cdr.markForCheck();

    this.customersService.createCustomer({ name, email, phone: phone ?? '' }).subscribe({
      next: (created) => {
        this.customers = [...this.customers, created];
        this.closeAddCustomerDialog();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.addCustomerSaving = false;
        this.addCustomerError = err?.error?.message ?? err?.message ?? 'Failed to add customer';
        this.cdr.markForCheck();
      }
    });
  }

  viewCustomer(customer: Customer): void {
    console.log('View customer:', customer);
  }

  editCustomer(customer: Customer): void {
    console.log('Edit customer:', customer);
  }
}
