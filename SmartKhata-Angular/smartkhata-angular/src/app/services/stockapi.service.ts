// src/app/services/stock-api.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';


export interface StockItem {
  id:            number;
  name:          string;
  category:      string;
  quantity:      number;
  unit:          string;
  purchasePrice: number;
  sellingPrice:  number;
  lastUpdated:   string;
  status:        'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface StockItemRequest {
  name:          string;
  category:      string;
  quantity:      number;
  unit:          string;
  purchasePrice: number;
  sellingPrice:  number;
}

export interface QuickUpdateRequest {
  action:   'add' | 'subtract';
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class StockApiService {
  private http = inject(HttpClient);

  // ✅ Direct backend URL (same as login)
  private base = 'http://localhost:5000/api/stock';

  stockItems = signal<StockItem[]>([]);
  loading    = signal(false);
  error      = signal<string | null>(null);

  // ── Load all ─────────────────────────────
  loadAll() {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<StockItem[]>(this.base).pipe(
      tap({
        next: items => {
          this.stockItems.set(items);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load stock');
          this.loading.set(false);
        }
      })
    );
  }

  // ── Create ───────────────────────────────
  create(payload: StockItemRequest) {
    return this.http.post<StockItem>(this.base, payload).pipe(
      tap(newItem =>
        this.stockItems.update(items => [...items, newItem])
      )
    );
  }

  // ── Update ───────────────────────────────
  update(id: number, payload: StockItemRequest) {
    return this.http.put<StockItem>(`${this.base}/${id}`, payload).pipe(
      tap(updated =>
        this.stockItems.update(items =>
          items.map(i => i.id === id ? updated : i)
        )
      )
    );
  }

  // ── Quick Update ─────────────────────────
  quickUpdate(id: number, payload: QuickUpdateRequest) {
    return this.http.patch<StockItem>(
      `${this.base}/${id}/quick-update`,
      payload
    ).pipe(
      tap(updated =>
        this.stockItems.update(items =>
          items.map(i => i.id === id ? updated : i)
        )
      )
    );
  }

  // ── Delete ───────────────────────────────
  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`).pipe(
      tap(() =>
        this.stockItems.update(items =>
          items.filter(i => i.id !== id)
        )
      )
    );
  }
}