import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private apiService = inject(ApiService);

  getCustomers(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>('/customers');
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.apiService.get<Customer>(`/customers/${id}`);
  }

  createCustomer(customer: CreateCustomerRequest): Observable<Customer> {
    return this.apiService.post<Customer>('/customers', customer);
  }
}
