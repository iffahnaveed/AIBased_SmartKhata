// src/app/pages/stock/stock.component.ts
// Key change: replaces local signal with StockApiService calls
import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockApiService, StockItem, StockItemRequest } from '../services/stockapi.service';
import { PkrPipe } from '../shared/pkr.pipe';
import { Router } from '@angular/router';
@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, PkrPipe],
  template: `

    @if (api.loading()) {
      <div style="text-align:center;padding:32px;color:var(--beige-700)">Loading stock…</div>
    }
    @if (api.error()) {
      <div style="text-align:center;padding:16px;color:var(--red-text);background:var(--red-bg);border-radius:8px;margin-bottom:16px;">
        {{ api.error() }}
      </div>
    }

    <div class="stats-grid">
      <div class="stat-card navy">
        <div class="stat-label">Total Products</div>
        <div class="stat-value">{{ api.stockItems().length }}</div>
        <div class="stat-change up">
          <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          {{ inStockCount() }} in stock
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-label">Low Stock Alerts</div>
        <div class="stat-value">{{ lowStockCount() }}</div>
        <div class="stat-change down">Needs restocking soon</div>
      </div>
      <div class="stat-card red">
        <div class="stat-label">Out of Stock</div>
        <div class="stat-value">{{ outOfStockCount() }}</div>
        <div class="stat-change down">Immediate action needed</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Total Stock Value</div>
        <div class="stat-value"><span>PKR</span>{{ totalStockValue().toLocaleString('en-PK') }}</div>
        <div class="stat-change up">
          <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          Purchase price basis
        </div>
      </div>
    </div>

    <div class="content-grid">

      <div class="card">
        <div class="card-header">
          <div class="card-title">Current Stock</div>
          <div style="display:flex;gap:10px;align-items:center;">
            <input class="search-input" type="text" placeholder="Search products…" [(ngModel)]="searchQuery" />
            <button class="btn btn-primary btn-sm" (click)="openAddModal()">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Item
            </button>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Qty / Unit</th>
              <th>Purchase Price</th>
              <th>Selling Price</th>
              <th>Last Updated</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (item of filteredStock(); track item.id) {
              <tr>
                <td><strong>{{ item.name }}</strong></td>
                <td style="color:var(--beige-700)">{{ item.category }}</td>
                <td>
                  <span style="font-weight:600;">{{ item.quantity }}</span>
                  <span style="color:var(--beige-700);font-size:11px;margin-left:4px;">{{ item.unit }}</span>
                </td>
                <td>{{ item.purchasePrice | pkr }}</td>
                <td>{{ item.sellingPrice | pkr }}</td>
                <td style="color:var(--beige-700)">{{ item.lastUpdated | date:'dd MMM' }}</td>
                <td>
                  <span class="badge" [ngClass]="statusBadge(item.status)">{{ item.status | titlecase }}</span>
                </td>
                <td>
                  <div style="display:flex;gap:6px;">
                    <button class="btn btn-ghost btn-sm" (click)="openEditModal(item)">Edit</button>
                    <button class="btn btn-ghost btn-sm" style="color:var(--red-500)" (click)="deleteItem(item.id)">Delete</button>
                  </div>
                </td>
              </tr>
            }
            @empty {
              <tr>
                <td colspan="8" style="text-align:center;color:var(--beige-700);padding:32px;">No products found.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px;">

        @if (lowStockItems().length > 0) {
          <div class="card">
            <div class="card-header">
              <div class="card-title" style="color:var(--amber-600);">⚠️ Low Stock Alerts</div>
            </div>
            <div class="card-body" style="padding-top:8px;padding-bottom:8px;">
              @for (item of lowStockItems(); track item.id) {
                <div class="customer-row">
                  <div class="avatar" style="background:var(--amber-100);color:var(--amber-700);">
                    {{ item.name.slice(0,2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="cust-name">{{ item.name }}</div>
                    <div class="cust-meta">{{ item.category }}</div>
                  </div>
                  <div class="cust-amount">
                    <div class="amt" style="color:var(--amber-600);">{{ item.quantity }} {{ item.unit }}</div>
                    <div class="lbl">Remaining</div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <div class="card">
          <div class="card-header">
            <div class="card-title">Quick Stock Update</div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">Select Product</label>
              <select class="form-select" [(ngModel)]="quickUpdate.productId">
                <option value="">-- Select product --</option>
                @for (item of api.stockItems(); track item.id) {
                  <option [value]="item.id">{{ item.name }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Action</label>
              <div style="display:flex;gap:8px;">
                <button class="btn btn-sm"
                  [class.btn-primary]="quickUpdate.action === 'add'"
                  [class.btn-ghost]="quickUpdate.action !== 'add'"
                  (click)="quickUpdate.action = 'add'">+ Add Stock</button>
                <button class="btn btn-sm"
                  [class.btn-primary]="quickUpdate.action === 'subtract'"
                  [class.btn-ghost]="quickUpdate.action !== 'subtract'"
                  (click)="quickUpdate.action = 'subtract'">− Remove Stock</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Quantity</label>
              <input class="form-input" type="number" min="1" placeholder="Enter quantity" [(ngModel)]="quickUpdate.quantity" />
            </div>
            <button class="btn btn-primary" style="width:100%;" (click)="applyQuickUpdate()">Apply Update</button>
          </div>
        </div>

      </div>
    </div>

    @if (showModal()) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="card-header" style="border-bottom:1px solid var(--beige-200);margin-bottom:20px;">
            <div class="card-title">{{ editingItem() ? 'Edit Product' : 'Add New Product' }}</div>
            <button class="btn btn-ghost btn-sm" (click)="closeModal()">✕</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div class="form-group">
              <label class="form-label">Product Name *</label>
              <input class="form-input" type="text" placeholder="e.g. Sugar" [(ngModel)]="form.name" />
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select" [(ngModel)]="form.category">
                <option>Grocery</option><option>Dairy</option><option>Beverages</option>
                <option>Bakery</option><option>Household</option><option>Other</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Quantity *</label>
              <input class="form-input" type="number" min="0" [(ngModel)]="form.quantity" />
            </div>
            <div class="form-group">
              <label class="form-label">Unit</label>
              <select class="form-select" [(ngModel)]="form.unit">
                <option>kg</option><option>g</option><option>litre</option>
                <option>pcs</option><option>dozen</option><option>box</option><option>pack</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Purchase Price (PKR) *</label>
              <input class="form-input" type="number" min="0" [(ngModel)]="form.purchasePrice" />
            </div>
            <div class="form-group">
              <label class="form-label">Selling Price (PKR) *</label>
              <input class="form-input" type="number" min="0" [(ngModel)]="form.sellingPrice" />
            </div>
          </div>
          <div style="display:flex;gap:10px;margin-top:16px;">
            <button class="btn btn-primary" style="flex:1;" (click)="saveItem()" [disabled]="api.loading()">
              {{ editingItem() ? 'Update Product' : 'Add Product' }}
            </button>
            <button class="btn btn-ghost" (click)="closeModal()">Cancel</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .search-input { padding:6px 12px;border:1px solid var(--beige-200);border-radius:6px;font-size:13px;font-family:inherit;background:var(--beige-50);color:var(--beige-900);outline:none;width:180px; }
    .search-input:focus { border-color:var(--navy-400); }
    .form-group { margin-bottom:4px; }
    .form-label { display:block;font-size:11px;font-weight:600;color:var(--beige-700);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px; }
    .form-input,.form-select { width:100%;padding:8px 12px;border:1px solid var(--beige-200);border-radius:6px;font-size:13px;font-family:inherit;background:var(--beige-50);color:var(--beige-900);outline:none; }
    .form-input:focus,.form-select:focus { border-color:var(--navy-400); }
    .modal-backdrop { position:fixed;inset:0;background:rgba(0,0,0,0.35);backdrop-filter:blur(2px);z-index:200;display:flex;align-items:center;justify-content:center; }
    .modal-box { background:white;border-radius:14px;padding:24px;width:520px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,0.15); }
  `]
})
export class StockComponent implements OnInit {
  api = inject(StockApiService);
  private router = inject(Router);

  showModal   = signal(false);
  editingItem = signal<StockItem | null>(null);

  errorMsg   = signal('');
  successMsg = signal('');
  isLoading  = signal(false);

  searchQuery = '';

  form: StockItemRequest = this.blankForm();

  quickUpdate = {
    productId: '',
    action: 'add' as 'add' | 'subtract',
    quantity: 1
  };

  // ================= COMPUTED =================
  filteredStock = computed(() => {
    const q = this.searchQuery.toLowerCase();
    return q
      ? this.api.stockItems().filter(i =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
        )
      : this.api.stockItems();
  });

  inStockCount = computed(() =>
    this.api.stockItems().filter(i => i.status === 'in-stock').length
  );

  lowStockCount = computed(() =>
    this.api.stockItems().filter(i => i.status === 'low-stock').length
  );

  outOfStockCount = computed(() =>
    this.api.stockItems().filter(i => i.status === 'out-of-stock').length
  );

  totalStockValue = computed(() =>
    this.api.stockItems().reduce(
      (sum, i) => sum + i.purchasePrice * i.quantity,
      0
    )
  );

  lowStockItems = computed(() =>
    this.api.stockItems().filter(i => i.status !== 'in-stock')
  );

  // ================= INIT =================
  ngOnInit() {
    if (!sessionStorage.getItem('sk_logged_in')) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadStock();
  }

  loadStock() {
    this.errorMsg.set('');
    this.successMsg.set('');
    this.isLoading.set(true);

    this.api.loadAll().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMsg.set('Failed to load stock from server.');
      }
    });
  }

  // ================= MODAL =================
  openAddModal() {
    this.editingItem.set(null);
    this.form = this.blankForm();
    this.showModal.set(true);
  }

  openEditModal(item: StockItem) {
    this.editingItem.set(item);
    this.form = {
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingItem.set(null);
  }

  // ================= CRUD =================
  saveItem() {
    this.errorMsg.set('');
    this.successMsg.set('');

    if (!this.form.name.trim()) {
      this.errorMsg.set('Product name is required.');
      return;
    }

    this.isLoading.set(true);

    const editing = this.editingItem();

    const request$ = editing
      ? this.api.update(editing.id, this.form)
      : this.api.create(this.form);

    request$.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMsg.set(
          editing
            ? 'Product updated successfully!'
            : 'Product added successfully!'
        );

        this.closeModal();
        setTimeout(() => this.successMsg.set(''), 2000);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMsg.set('Operation failed. Please try again.');
      }
    });
  }

  deleteItem(id: number) {
    this.errorMsg.set('');
    this.successMsg.set('');
    this.isLoading.set(true);

    this.api.delete(id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMsg.set('Item deleted successfully!');
        setTimeout(() => this.successMsg.set(''), 2000);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMsg.set('Delete failed. Server error.');
      }
    });
  }

  applyQuickUpdate() {
    this.errorMsg.set('');
    this.successMsg.set('');

    if (!this.quickUpdate.productId || this.quickUpdate.quantity < 1) {
      this.errorMsg.set('Please select product and quantity.');
      return;
    }

    this.isLoading.set(true);

    this.api.quickUpdate(+this.quickUpdate.productId, {
      action: this.quickUpdate.action,
      quantity: this.quickUpdate.quantity
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMsg.set('Stock updated successfully!');
        this.quickUpdate = { productId: '', action: 'add', quantity: 1 };

        setTimeout(() => this.successMsg.set(''), 2000);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMsg.set('Stock update failed.');
      }
    });
  }

  // ================= UI =================
  statusBadge(status: string): Record<string, boolean> {
    return {
      'badge-success': status === 'in-stock',
      'badge-warning': status === 'low-stock',
      'badge-danger': status === 'out-of-stock'
    };
  }

  private blankForm(): StockItemRequest {
    return {
      name: '',
      category: 'Grocery',
      quantity: 0,
      unit: 'kg',
      purchasePrice: 0,
      sellingPrice: 0
    };
  }
}