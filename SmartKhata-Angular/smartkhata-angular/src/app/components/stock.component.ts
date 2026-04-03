import { Component, inject, computed, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockApiService, StockItem, StockItemRequest } from '../services/stockapi.service';
import { PkrPipe } from '../shared/pkr.pipe';
import { Router } from '@angular/router';

// ── Category → allowed units map ──────────────────────────────────────────
const CATEGORY_UNITS: Record<string, string[]> = {
  Grocery:   ['kg', 'g', 'pack', 'box'],
  Dairy:     ['litre', 'pcs', 'dozen', 'pack'],
  Beverages: ['litre', 'pcs', 'pack', 'box', 'dozen'],
  Bakery:    ['pcs', 'dozen', 'pack', 'box'],
  Household: ['pcs', 'pack', 'box', 'dozen'],
  Other:     ['kg', 'g', 'litre', 'pcs', 'pack', 'box'],
};

const CATEGORIES = Object.keys(CATEGORY_UNITS);

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
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Item
            </button>
          </div>
        </div>

        <!-- ✅ overflow-x:auto ensures Actions column is always reachable -->
        <div style="overflow-x:auto;">
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
                  
                 <span style="color:var(--beige-500);font-size:12px;">—</span>

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
      </div>

      <div style="display:flex;flex-direction:column;gap:20px;">

        @if (lowStockItems().length > 0) {
          <div class="card">
            <div class="card-header">
              <div class="card-title" style="color:var(--amber-600);">Low Stock Alerts</div>
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

            @if (quickError()) {
              <div style="background:var(--red-bg);color:var(--red-text);border-radius:6px;padding:8px 12px;font-size:12px;margin-bottom:10px;">
                {{ quickError() }}
              </div>
            }
            @if (quickSuccess()) {
              <div style="background:var(--green-bg);color:var(--green-text);border-radius:6px;padding:8px 12px;font-size:12px;margin-bottom:10px;">
                {{ quickSuccess() }}
              </div>
            }

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
              <input class="form-input"
  type="number"
  min="1"
  [(ngModel)]="quickUpdate.quantity"
  (keydown)="preventNegative($event)"
  (paste)="preventPasteNegative($event)"
  (input)="clampQuickQty()" />
            </div>
            <button class="btn btn-primary" style="width:100%;" (click)="applyQuickUpdate()">Apply Update</button>
          </div>
        </div>

      </div>
    </div>

    <!-- ── ADD / EDIT MODAL ─────────────────────────────────── -->
    @if (showModal()) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">

          <div class="card-header" style="border-bottom:1px solid var(--beige-200);margin-bottom:20px;">
            <div class="card-title">{{ editingItem() ? 'Edit Product' : 'Add New Product' }}</div>
            <button class="btn btn-ghost btn-sm" (click)="closeModal()">✕</button>
          </div>

          @if (modalError()) {
            <div style="background:var(--red-bg);color:var(--red-text);border-radius:6px;padding:10px 14px;font-size:12.5px;margin-bottom:14px;display:flex;gap:8px;align-items:center;">
               {{ modalError() }}
            </div>
          }

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

            <div class="form-group">
              <label class="form-label">Product Name *</label>
              <input class="form-input"
                type="text"
                placeholder="e.g. Sugar"
                [(ngModel)]="form.name"
                (input)="checkExistingProduct()" />
            </div>

            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select"
                [(ngModel)]="form.category"
                [disabled]="isExistingProduct()">
                @for (cat of categories; track cat) {
                  <option [value]="cat">{{ cat }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Quantity *</label>
             <input class="form-input"
  type="number"
  min="1"
  [(ngModel)]="form.quantity"
  (keydown)="preventNegative($event)"
  (paste)="preventPasteNegative($event)"
  (input)="clampQty()" />
              @if (form.quantity < 1) {
                <span style="font-size:11px;color:var(--red-text);">
                  ⚠️ Quantity must be at least 1
                </span>
              }
            </div>

            <div class="form-group">
              <label class="form-label">Unit</label>
              <select class="form-select"
                [(ngModel)]="form.unit"
                [disabled]="isExistingProduct()">
                @for (u of allowedUnits(); track u) {
                  <option [value]="u">{{ u }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Purchase Price (PKR) *</label>
              <input class="form-input"
                type="number"
                [(ngModel)]="form.purchasePrice"
                [disabled]="isExistingProduct()"
                (input)="clampPurchase()" />
            </div>

            <div class="form-group">
              <label class="form-label">Selling Price (PKR) *</label>
              <input class="form-input" type="number" min="0"
                [(ngModel)]="form.sellingPrice"
                [disabled]="isExistingProduct()"
                (input)="clampSelling()" />
              @if (form.sellingPrice > 0 && form.sellingPrice < form.purchasePrice) {
                <span style="font-size:11px;color:var(--red-text);">
                   Selling price must be ≥ purchase price ({{ form.purchasePrice | pkr }})
                </span>
              }
            </div>

          </div>

          <div style="display:flex;gap:10px;margin-top:16px;">
            <button class="btn btn-primary" style="flex:1;"
              (click)="saveItem()"
              [disabled]="
                api.loading() ||
                form.quantity < 1 ||
                form.purchasePrice < 0 ||
                form.sellingPrice < form.purchasePrice
              ">
              {{ isExistingProduct() ? 'Update Quantity' : 'Add Product' }}
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
    .data-table { min-width:780px;width:100%; }
  `]
  
})
export class StockComponent implements OnInit {
  api           = inject(StockApiService);
  private router = inject(Router);
  private cdr    = inject(ChangeDetectorRef);

  showModal    = signal(false);
  editingItem  = signal<StockItem | null>(null);
  modalError   = signal('');
  quickError   = signal('');
  quickSuccess = signal('');

  searchQuery = '';
  categories  = CATEGORIES;
  isExistingProduct = signal(false);
  form: StockItemRequest = this.blankForm();

  quickUpdate = {
    productId: '',
    action: 'add' as 'add' | 'subtract',
    quantity: 1
  };

  // ── Computed ────────────────────────────────────────────────
  filteredStock = computed(() => {
    const q = this.searchQuery.toLowerCase();
    return q
      ? this.api.stockItems().filter(i =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q))
      : this.api.stockItems();
  });

  inStockCount    = computed(() => this.api.stockItems().filter(i => i.status === 'in-stock').length);
  lowStockCount   = computed(() => this.api.stockItems().filter(i => i.status === 'low-stock').length);
  outOfStockCount = computed(() => this.api.stockItems().filter(i => i.status === 'out-of-stock').length);
  totalStockValue = computed(() => this.api.stockItems().reduce((s, i) => s + i.purchasePrice * i.quantity, 0));
  lowStockItems   = computed(() => this.api.stockItems().filter(i => i.status !== 'in-stock'));

  /** Units allowed for the currently selected category */
  allowedUnits() {
    return CATEGORY_UNITS[this.form.category] ?? CATEGORY_UNITS['Other'];
  }

  // ── Init ─────────────────────────────────────────────────────
  ngOnInit() {
    if (!sessionStorage.getItem('sk_logged_in')) {
      this.router.navigate(['/login']);
      return;
    }
    this.api.loadAll().subscribe();
  }

  checkExistingProduct() {
    const name = this.form.name.trim().toLowerCase();

    const existing = this.api.stockItems().find(
      i => i.name.toLowerCase() === name
    );

    if (existing) {
      // fill all fields except quantity
      this.form.category = existing.category;
      this.form.unit = existing.unit;
      this.form.purchasePrice = existing.purchasePrice;
      this.form.sellingPrice = existing.sellingPrice;

      this.isExistingProduct.set(true);
    } else {
      this.isExistingProduct.set(false);
    }
  }

  // ── Category change → reset unit to first allowed ────────────
  onCategoryChange() {
    const units = CATEGORY_UNITS[this.form.category] ?? CATEGORY_UNITS['Other'];
    this.form.unit = units[0];
  }

  // ── Clamps ───────────────────────────────────────────────────
clampQty() {
  this.form.quantity = Math.max(1, Number(this.form.quantity) || 1);
}

clampQuickQty() {
  this.quickUpdate.quantity = Math.max(1, Number(this.quickUpdate.quantity) || 1);
}
  clampPurchase() { if (this.form.purchasePrice < 0) this.form.purchasePrice = 0; }
  clampSelling()  { if (this.form.sellingPrice  < 0) this.form.sellingPrice  = 0; }

  // ── Modal ────────────────────────────────────────────────────
  openAddModal() {
    this.editingItem.set(null);
    this.form = this.blankForm();
    this.modalError.set('');
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingItem.set(null);
    this.modalError.set('');
  }
preventNegative(event: KeyboardEvent) {
  if (event.key === '-' || event.key === 'e' || event.key === '+') {
    event.preventDefault();
  }
}

preventPasteNegative(event: ClipboardEvent) {
  const pasted = event.clipboardData?.getData('text');
  if (pasted && Number(pasted) < 0) {
    event.preventDefault();
  }
}
  // ── Save (add or edit) ───────────────────────────────────────
  saveItem() {
    this.modalError.set('');

    if (!this.form.name.trim()) {
      this.modalError.set('Product name is required.');
      return;
    }

    if (this.form.quantity < 1) {
      this.modalError.set('Quantity must be at least 1.');
      return;
    }

    const existing = this.api.stockItems().find(
      i => i.name.toLowerCase() === this.form.name.trim().toLowerCase()
    );

    // ✅ CASE 1: Existing product → UPDATE quantity
    if (existing) {
      this.api.quickUpdate(existing.id, {
        action: 'add',
        quantity: this.form.quantity
      }).subscribe({
        next: () => this.closeModal(),
        error: () => this.modalError.set('Failed to update quantity.')
      });

      return;
    }

    // ✅ CASE 2: New product → NORMAL CREATE
    if (this.form.purchasePrice < 0 || this.form.sellingPrice < 0) {
      this.modalError.set('Prices cannot be negative.');
      return;
    }

    if (this.form.sellingPrice < this.form.purchasePrice) {
      this.modalError.set('Selling price must be ≥ purchase price.');
      return;
    }

    const allowed = CATEGORY_UNITS[this.form.category] ?? [];
    if (!allowed.includes(this.form.unit)) {
      this.modalError.set('Invalid unit for selected category.');
      return;
    }

    this.api.create(this.form).subscribe({
      next: () => this.closeModal(),
      error: () => this.modalError.set('Failed to add product.')
    });
  }

  // ── Field change helpers ─────────────────────────────────────
  onPurchaseChange() {
    if (this.form.purchasePrice < 0) {
      this.form.purchasePrice = 0;
    }
    // auto-fix selling if invalid
    if (this.form.sellingPrice < this.form.purchasePrice) {
      this.form.sellingPrice = this.form.purchasePrice;
    }
  }

  onSellingChange() {
    if (this.form.sellingPrice < 0) {
      this.form.sellingPrice = 0;
    }
  }

  // ── Quick update ─────────────────────────────────────────────
  applyQuickUpdate() {
    this.quickError.set('');
    this.quickSuccess.set('');

    if (!this.quickUpdate.productId) {
      this.quickError.set('Please select a product.');
      return;
    }
    if (this.quickUpdate.quantity < 1) {
      this.quickError.set('Quantity must be at least 1.');
      return;
    }

    if (this.quickUpdate.action === 'subtract') {
      const item = this.api.stockItems().find(i => i.id === +this.quickUpdate.productId);
      if (item && this.quickUpdate.quantity > item.quantity) {
        this.quickError.set(
          `Cannot remove ${this.quickUpdate.quantity} — only ${item.quantity} ${item.unit} in stock.`
        );
        return;
      }
    }

    this.api.quickUpdate(+this.quickUpdate.productId, {
      action:   this.quickUpdate.action,
      quantity: this.quickUpdate.quantity
    }).subscribe({
      next: () => {
        this.quickSuccess.set('Stock updated successfully!');
        this.quickUpdate = { productId: '', action: 'add', quantity: 1 };
        setTimeout(() => this.quickSuccess.set(''), 2500);
      },
      error: () => this.quickError.set('Stock update failed. Please try again.')
    });
  }

  // ── Helpers ──────────────────────────────────────────────────
  statusBadge(status: string): Record<string, boolean> {
    return {
      'badge-success': status === 'in-stock',
      'badge-warning': status === 'low-stock',
      'badge-danger':  status === 'out-of-stock'
    };
  }

  private blankForm(): StockItemRequest {
    return {
      name:          '',
      category:      'Grocery',
      quantity:      1,
      unit:          'kg',
      purchasePrice: 0,
      sellingPrice:  0
    };
  }
}