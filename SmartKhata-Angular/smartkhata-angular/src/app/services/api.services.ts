// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'http://localhost:5000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ── Customers ──────────────────────────────────────────────
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/customers`);
  }
  addCustomer(data: any): Observable<any> {
    return this.http.post(`${BASE}/customers`, data);
  }
  updateCustomer(id: number, data: any): Observable<any> {
    return this.http.put(`${BASE}/customers/${id}`, data);
  }
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${BASE}/customers/${id}`);
  }

  // ── Invoices ───────────────────────────────────────────────
  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/invoices`);
  }
  addInvoice(data: any): Observable<any> {
    return this.http.post(`${BASE}/invoices`, data);
  }
  updateInvoice(id: number, data: any): Observable<any> {
    return this.http.put(`${BASE}/invoices/${id}`, data);
  }
  deleteInvoice(id: number): Observable<any> {
    return this.http.delete(`${BASE}/invoices/${id}`);
  }

  // ── Ledger ─────────────────────────────────────────────────
  getLedger(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE}/ledger`);
  }
  addLedgerEntry(data: any): Observable<any> {
    return this.http.post(`${BASE}/ledger`, data);
  }
  deleteLedgerEntry(id: number): Observable<any> {
    return this.http.delete(`${BASE}/ledger/${id}`);
  }
}