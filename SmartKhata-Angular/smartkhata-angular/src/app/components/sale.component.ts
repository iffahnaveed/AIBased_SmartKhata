// src/app/pages/sales/sales.component.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaleApiService, SaleEntry, SaleEntryRequest } from '../services/sale-api.service';
import { StockApiService } from '../services/stockapi.service';
import { PkrPipe } from '../shared/pkr.pipe';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, PkrPipe],
  template: `

    @if (api.loading()) {
      <div style="text-align:center;padding:32px;color:var(--beige-700)">Loading sales…</div>
    }
    @if (api.error()) {
      <div style="text-align:center;padding:16px;color:var(--red-text);background:var(--red-bg);border-radius:8px;margin-bottom:16px;">
        {{ api.error() }}
      </div>
    }

    <!-- Filter Bar -->
    <div class="filter-bar">
      <input class="search-input" type="text" placeholder="Search product or customer…"
        [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" />
      <select class="select-filter" [(ngModel)]="paymentFilter" (ngModelChange)="applyFilters()">
        <option value="all">All Types</option>
        <option value="cash">Cash</option>
        <option value="udhar">Udhar</option>
      </select>
      <select class="select-filter" [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()">
        <option value="all">All Status</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="overdue">Overdue</option>
      </select>
      <button class="btn btn-primary" (click)="openAddModal()">
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Record Sale
      </button>
    </div>

    <!-- Summary Row -->
    <div class="summary-row">
      <div class="sum-item">
        <span class="sum-val">{{ totalSales() | pkr }}</span>
        <span class="sum-lbl">Total Sales</span>
      </div>
      <div class="sum-divider"></div>
      <div class="sum-item">
        <span class="sum-val">{{ totalCash() | pkr }}</span>
        <span class="sum-lbl">Cash Collected</span>
      </div>
      <div class="sum-divider"></div>
      <div class="sum-item">
        <span class="sum-val" style="color:#F28B8B">{{ totalUdhar() | pkr }}</span>
        <span class="sum-lbl">Udhar Outstanding</span>
      </div>
      <div class="sum-divider"></div>
      <div class="sum-item">
        <span class="sum-val">{{ filtered().length }}</span>
        <span class="sum-lbl">Entries Shown</span>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Product</th>
            <th>Qty / Unit</th>
            <th>Price</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @if (filtered().length === 0) {
            <tr>
              <td colspan="10" style="text-align:center;padding:32px;color:var(--beige-700)">
                No sales entries found
              </td>
            </tr>
          }
          @for (sale of filtered(); track sale.id; let i = $index) {
            <tr>
              <td style="color:var(--beige-700);font-size:12px">{{ i + 1 }}</td>
              <td style="color:var(--beige-700);font-size:12px;white-space:nowrap">
                {{ sale.date | date:'dd MMM' }}
              </td>
              <td>
                <strong>{{ sale.product }}</strong>
                <div style="font-size:11px;color:var(--beige-700)">{{ sale.category }}</div>
              </td>
              <td>
                <span style="font-weight:600">{{ sale.quantity }}</span>
                <span style="color:var(--beige-700);font-size:11px;margin-left:4px">{{ sale.unit }}</span>
              </td>
              <td>{{ sale.sellingPrice | pkr }}</td>
              <td style="font-weight:600;color:var(--navy-800)">{{ sale.total | pkr }}</td>
              <td>
                <span class="badge" [ngClass]="sale.paymentType === 'cash' ? 'badge-success' : 'badge-warning'">
                  {{ sale.paymentType === 'cash' ? 'Cash' : 'Udhar' }}
                </span>
              </td>
              <td style="color:var(--navy-700)">{{ sale.customer || '—' }}</td>
              <td>
                <span class="badge" [ngClass]="badgeClass(sale.status)">{{ sale.status }}</span>
              </td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" (click)="openEditModal(sale)">Edit</button>
                  <button class="btn btn-ghost btn-sm" style="color:var(--red-500)"
                    (click)="deleteEntry(sale.id)">Delete</button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Add / Edit Modal -->
    @if (showModal()) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">

          <div class="card-header" style="border-bottom:1px solid var(--beige-200);margin-bottom:20px;">
            <div class="card-title">{{ editingEntry() ? 'Edit Sale' : 'Record New Sale' }}</div>
            <button class="btn btn-ghost btn-sm" (click)="closeModal()">✕</button>
          </div>

          <!-- Cash / Udhar Toggle -->
          <div style="display:flex;gap:8px;margin-bottom:20px;">
            <button class="btn" style="flex:1;justify-content:center;"
              [class.btn-primary]="form.paymentType === 'cash'"
              [class.btn-ghost]="form.paymentType !== 'cash'"
              (click)="form.paymentType = 'cash'">💵 Cash Sale</button>
            <button class="btn" style="flex:1;justify-content:center;"
              [class.btn-primary]="form.paymentType === 'udhar'"
              [class.btn-ghost]="form.paymentType !== 'udhar'"
              (click)="form.paymentType = 'udhar'">📒 Udhar Sale</button>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

            <div class="form-group">
              <label class="form-label">Product *</label>
              <select class="form-select" [(ngModel)]="form.product" (ngModelChange)="onProductSelect($event)">
                <option value="">-- Select product --</option>
                @for (p of stockApi.stockItems(); track p.id) {
                  <option [value]="p.name">{{ p.name }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Category</label>
              <input class="form-input" type="text" [(ngModel)]="form.category" readonly
                style="opacity:0.7;cursor:default" />
            </div>

            <div class="form-group">
              <label class="form-label">Quantity *</label>
              <input class="form-input" type="number" min="1" [(ngModel)]="form.quantity"
                (ngModelChange)="calcTotal()" />
            </div>

            <div class="form-group">
              <label class="form-label">Unit</label>
              <input class="form-input" type="text" [(ngModel)]="form.unit" />
            </div>

            <div class="form-group">
              <label class="form-label">Selling Price (PKR) *</label>
              <input class="form-input" type="number" min="0" [(ngModel)]="form.sellingPrice"
                (ngModelChange)="calcTotal()" />
            </div>

            <div class="form-group">
              <label class="form-label">Total Amount</label>
              <input class="form-input" type="number" [value]="form.total" readonly
                style="font-weight:600;opacity:0.8;cursor:default" />
            </div>

            <div class="form-group" style="grid-column:1/-1">
              <label class="form-label">
                Customer Name
                @if (form.paymentType === 'udhar') {
                  <span style="color:var(--red-500)"> *</span>
                } @else {
                  <span style="color:var(--beige-600);font-weight:400"> (optional for cash)</span>
                }
              </label>
              <input class="form-input" type="text" placeholder="Customer name"
                [(ngModel)]="form.customer" />
            </div>

            <div class="form-group">
              <label class="form-label">Date *</label>
              <input class="form-input" type="date" [(ngModel)]="form.date" />
            </div>

            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-select" [(ngModel)]="form.status">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

          </div>

          <div style="display:flex;gap:10px;margin-top:16px;">
            <button class="btn btn-primary" style="flex:1;" (click)="saveEntry()"
              [disabled]="api.loading()">
              {{ editingEntry() ? 'Update Sale' : 'Record Sale' }}
            </button>
            <button class="btn btn-ghost" (click)="closeModal()">Cancel</button>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .form-group { margin-bottom: 4px; }
    .form-label { display:block;font-size:11px;font-weight:600;color:var(--beige-700);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px; }
    .form-input,.form-select { width:100%;padding:8px 12px;border:1px solid var(--beige-200);border-radius:6px;font-size:13px;font-family:inherit;background:var(--beige-50);color:var(--beige-900);outline:none; }
    .form-input:focus,.form-select:focus { border-color:var(--navy-400); }
    .modal-backdrop { position:fixed;inset:0;background:rgba(0,0,0,0.35);backdrop-filter:blur(2px);z-index:200;display:flex;align-items:center;justify-content:center; }
    .modal-box { background:white;border-radius:14px;padding:24px;width:540px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,0.15); }
  `]
})
export class SalesComponent implements OnInit {
  api      = inject(SaleApiService);
  stockApi = inject(StockApiService);   // for product dropdown

  showModal    = signal(false);
  editingEntry = signal<SaleEntry | null>(null);
  searchQuery  = '';
  paymentFilter = 'all';
  statusFilter  = 'all';

  form: SaleEntryRequest = this.blankForm();

  // ── Filtered view ────────────────────────────────────────
  private _filtered = signal<SaleEntry[]>([]);
  filtered = this._filtered.asReadonly();

  totalSales = computed(() => this._filtered().reduce((s, e) => s + e.total, 0));
  totalCash  = computed(() => this._filtered().filter(e => e.paymentType === 'cash').reduce((s, e) => s + e.total, 0));
  totalUdhar = computed(() => this._filtered().filter(e => e.paymentType === 'udhar').reduce((s, e) => s + e.total, 0));

  // ── Lifecycle ─────────────────────────────────────────────
  ngOnInit() {
    // Load stock for the product dropdown
    this.stockApi.loadAll().subscribe();
    // Load sales
    this.api.loadAll().subscribe({
      next: () => this.applyFilters()
    });
  }

  applyFilters() {
    let entries = [...this.api.saleEntries()];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      entries = entries.filter(e =>
        e.product.toLowerCase().includes(q) ||
        e.customer.toLowerCase().includes(q)
      );
    }
    if (this.paymentFilter !== 'all') entries = entries.filter(e => e.paymentType === this.paymentFilter);
    if (this.statusFilter  !== 'all') entries = entries.filter(e => e.status === this.statusFilter);
    this._filtered.set(entries);
  }

  onProductSelect(name: string) {
    const p = this.stockApi.stockItems().find(i => i.name === name);
    if (p) {
      this.form.category     = p.category;
      this.form.unit         = p.unit;
      this.form.sellingPrice = p.sellingPrice;
      this.calcTotal();
    }
  }

  calcTotal() {
    this.form.total = this.form.quantity * this.form.sellingPrice;
  }

  openAddModal() {
    this.editingEntry.set(null);
    this.form = this.blankForm();
    this.showModal.set(true);
  }

  openEditModal(sale: SaleEntry) {
    this.editingEntry.set(sale);
    this.form = {
      product:      sale.product,
      category:     sale.category,
      quantity:     sale.quantity,
      unit:         sale.unit,
      sellingPrice: sale.sellingPrice,
      total:        sale.total,
      paymentType:  sale.paymentType,
      customer:     sale.customer,
      date:         sale.date,
      status:       sale.status,
    };
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); this.editingEntry.set(null); }

  saveEntry() {
    if (!this.form.product) return;
    if (this.form.paymentType === 'udhar' && !this.form.customer.trim()) return;

    const editing = this.editingEntry();
    const call = editing
      ? this.api.update(editing.id, this.form)
      : this.api.create(this.form);

    call.subscribe({
      next: () => { this.applyFilters(); this.closeModal(); }
    });
  }

  deleteEntry(id: number) {
    this.api.delete(id).subscribe({
      next: () => this.applyFilters()
    });
  }

  badgeClass(status: string): Record<string, boolean> {
    return {
      'badge-success': status === 'paid',
      'badge-danger':  status === 'overdue',
      'badge-warning': status === 'pending',
    };
  }

  private blankForm(): SaleEntryRequest {
    return {
      product: '', category: '', quantity: 1, unit: '',
      sellingPrice: 0, total: 0,
      paymentType: 'cash',
      customer: '',
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
    };
  }
}