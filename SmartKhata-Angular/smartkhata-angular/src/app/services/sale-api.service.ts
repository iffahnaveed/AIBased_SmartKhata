// src/app/services/sale-api.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface SaleEntry {
  id:           number;
  date:         string;
  product:      string;
  category:     string;
  quantity:     number;
  unit:         string;
  sellingPrice: number;
  total:        number;
  paymentType:  'cash' | 'udhar';
  customer:     string;
  status:       'paid' | 'pending' | 'overdue';
}

export interface SaleEntryRequest {
  date:         string;
  product:      string;
  category:     string;
  quantity:     number;
  unit:         string;
  sellingPrice: number;
  total:        number;
  paymentType:  'cash' | 'udhar';
  customer:     string;
  status:       'paid' | 'pending' | 'overdue';
}

@Injectable({ providedIn: 'root' })
export class SaleApiService {
  private http = inject(HttpClient);

  // ✅ Direct backend URL (same as login and stock)
  private base = 'http://localhost:5000/api/sales';

  saleEntries = signal<SaleEntry[]>([]);
  loading     = signal(false);
  error       = signal<string | null>(null);

  // ── Load all ─────────────────────────────
  loadAll() {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<SaleEntry[]>(this.base).pipe(
      tap({
        next: entries => {
          this.saleEntries.set(entries);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load sales');
          this.loading.set(false);
        }
      })
    );
  }

  // ── Create ───────────────────────────────
  create(payload: SaleEntryRequest) {
    return this.http.post<SaleEntry>(this.base, payload).pipe(
      tap(newEntry =>
        this.saleEntries.update(entries => [newEntry, ...entries])
      )
    );
  }

  // ── Update ───────────────────────────────
  update(id: number, payload: SaleEntryRequest) {
    return this.http.put<SaleEntry>(`${this.base}/${id}`, payload).pipe(
      tap(updated =>
        this.saleEntries.update(entries =>
          entries.map(e => e.id === id ? updated : e)
        )
      )
    );
  }

  // ── Delete ───────────────────────────────
  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() =>
        this.saleEntries.update(entries =>
          entries.filter(e => e.id !== id)
        )
      )
    );
  }
}