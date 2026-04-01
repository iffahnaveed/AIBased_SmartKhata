// src/app/pages/statistics/statistics.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { PkrPipe } from '../shared/pkr.pipe';

type PeriodKey = 'today' | 'week' | 'month';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, PkrPipe],
  template: `

    <!-- Status Bar -->
    <div class="invoice-status-bar">
      <div class="inv-stat-chip">
        <span class="val">{{ totalRevenue() | pkr }}</span>
        <span class="lbl">Total Revenue</span>
      </div>
      <div class="inv-stat-chip">
        <span class="val">{{ totalUnitsSold() }}</span>
        <span class="lbl">Units Sold</span>
      </div>
      <div class="inv-stat-chip">
        <span class="val">{{ totalCashSales() | pkr }}</span>
        <span class="lbl">Cash Sales</span>
      </div>
      <div class="inv-stat-chip" style="border-color:var(--red-bg)">
        <span class="val" style="color:var(--red-text)">{{ totalUdharSales() | pkr }}</span>
        <span class="lbl">Udhar Sales</span>
      </div>
    </div>

    <!-- Period Tabs -->
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
      <div class="tab-bar">
        @for (p of periods; track p.key) {
          <button class="tab-btn" [class.active]="activePeriod() === p.key"
            (click)="setPeriod(p.key)">
            {{ p.label }}
          </button>
        }
      </div>
    </div>

    <!-- Main Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">

      <!-- Fast Moving Products -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            🔥 Fast Moving Products
          </div>
          <span style="font-size:11px;color:var(--beige-700)">By units sold</span>
        </div>
        <div class="card-body" style="padding-top:8px;">
          @for (item of fastMoving(); track item.name; let i = $index) {
            <div style="margin-bottom:14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-size:11px;font-weight:700;color:var(--beige-600);width:16px;">{{ i + 1 }}</span>
                  <span style="font-size:13px;font-weight:600;">{{ item.name }}</span>
                  <span class="badge badge-navy" style="font-size:10px;">{{ item.category }}</span>
                </div>
                <span style="font-size:12px;font-weight:700;color:var(--navy-700);">{{ item.unitsSold }} {{ item.unit }}</span>
              </div>
              <div style="height:6px;background:var(--beige-100);border-radius:4px;overflow:hidden;">
                <div style="height:100%;border-radius:4px;background:var(--navy-600);"
                  [style.width.%]="(item.unitsSold / fastMoving()[0].unitsSold) * 100">
                </div>
              </div>
              <div style="display:flex;justify-content:space-between;margin-top:3px;">
                <span style="font-size:10px;color:var(--beige-700);">Revenue: {{ item.revenue | pkr }}</span>
                <span style="font-size:10px;" [style.color]="item.trend >= 0 ? 'var(--green-text, #2d7a3a)' : 'var(--red-text)'">
                  {{ item.trend >= 0 ? '↑' : '↓' }} {{ item.trend >= 0 ? '+' : '' }}{{ item.trend }}% vs last week
                </span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Slow Moving Products -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            🐢 Slow Moving Products
          </div>
          <span style="font-size:11px;color:var(--beige-700)">Needs attention</span>
        </div>
        <div class="card-body" style="padding-top:8px;">
          @for (item of slowMoving(); track item.name) {
            <div class="customer-row">
              <div class="avatar" style="background:var(--beige-100);color:var(--beige-700);font-size:11px;">
                {{ item.name.slice(0,2).toUpperCase() }}
              </div>
              <div style="flex:1;">
                <div class="cust-name">{{ item.name }}</div>
                <div class="cust-meta">{{ item.category }} · {{ item.unitsSold }} {{ item.unit }} sold</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:12px;font-weight:600;color:var(--red-text);">
                  {{ item.daysInStock }} days
                </div>
                <div style="font-size:10px;color:var(--beige-700);">in stock</div>
              </div>
            </div>
          }
          @empty {
            <div style="text-align:center;padding:24px;color:var(--beige-700);font-size:13px;">
              All products are moving well 🎉
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Daily Sales Trend + Category Breakdown -->
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px;">

      <!-- Daily Trend -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Daily Sales Trend</div>
          <div style="display:flex;gap:16px;align-items:center;">
            <div style="display:flex;gap:6px;align-items:center;font-size:11px;color:var(--beige-800);">
              <div style="width:8px;height:8px;border-radius:50%;background:var(--navy-600)"></div> Cash
            </div>
            <div style="display:flex;gap:6px;align-items:center;font-size:11px;color:var(--beige-800);">
              <div style="width:8px;height:8px;border-radius:50%;background:var(--beige-400)"></div> Udhar
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="bar-chart">
            @for (day of dailyTrend(); track day.label) {
              <div class="bar-group">
                <div class="bar-wrap">
                  <div class="bar bar-credit" [style.height.%]="day.cashPct"></div>
                  <div class="bar bar-debit"  [style.height.%]="day.udharPct"></div>
                </div>
                <span class="bar-label">{{ day.label }}</span>
              </div>
            }
          </div>
          <!-- Revenue labels below -->
          <div style="display:flex;justify-content:space-between;margin-top:8px;padding:0 4px;">
            @for (day of dailyTrend(); track day.label) {
              <div style="flex:1;text-align:center;font-size:9px;color:var(--beige-700);font-family:monospace;">
                {{ day.total | pkr }}
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">By Category</div>
        </div>
        <div class="card-body" style="padding-top:8px;">
          @for (cat of categoryBreakdown(); track cat.name) {
            <div style="margin-bottom:14px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="font-size:12px;font-weight:600;">{{ cat.name }}</span>
                <span style="font-size:11px;color:var(--beige-700);font-family:monospace;">{{ cat.pct }}%</span>
              </div>
              <div style="height:6px;background:var(--beige-100);border-radius:4px;overflow:hidden;">
                <div style="height:100%;border-radius:4px;"
                  [style.width.%]="cat.pct"
                  [style.background]="cat.color">
                </div>
              </div>
              <div style="font-size:10px;color:var(--beige-700);margin-top:2px;">{{ cat.revenue | pkr }}</div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Low Stock Alerts + Top Customers -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">

      <!-- Low Stock Alerts -->
      <div class="card">
        <div class="card-header">
          <div class="card-title" style="color:var(--amber-600,#b45309);">
            ⚠️ Low Stock Alerts
          </div>
          <span class="badge badge-warning">{{ lowStockAlerts().length }} items</span>
        </div>
        <div class="card-body" style="padding-top:8px;">
          @for (item of lowStockAlerts(); track item.name) {
            <div class="customer-row">
              <div class="avatar" style="background:var(--amber-50,#fffbeb);color:var(--amber-700,#b45309);font-size:11px;">
                {{ item.name.slice(0,2).toUpperCase() }}
              </div>
              <div style="flex:1;">
                <div class="cust-name">{{ item.name }}</div>
                <div class="cust-meta">{{ item.category }}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:13px;font-weight:700;"
                  [style.color]="item.qty === 0 ? 'var(--red-text)' : 'var(--amber-600,#b45309)'">
                  {{ item.qty }} {{ item.unit }}
                </div>
                <span class="badge" [ngClass]="item.qty === 0 ? 'badge-danger' : 'badge-warning'">
                  {{ item.qty === 0 ? 'Out of stock' : 'Low stock' }}
                </span>
              </div>
            </div>
          }
          @empty {
            <div style="text-align:center;padding:24px;color:var(--beige-700);font-size:13px;">
              All stock levels are healthy ✅
            </div>
          }
        </div>
      </div>

      <!-- Top Customers by Purchase -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Top Customers</div>
          <span style="font-size:11px;color:var(--beige-700)">By total purchases</span>
        </div>
        <div class="card-body" style="padding-top:8px;">
          @for (c of topCustomers(); track c.name; let i = $index) {
            <div class="customer-row">
              <div class="avatar">{{ c.name.slice(0,2).toUpperCase() }}</div>
              <div style="flex:1;">
                <div class="cust-name">{{ c.name }}</div>
                <div class="cust-meta">{{ c.totalOrders }} orders · last {{ c.lastSeen }}</div>
              </div>
              <div class="cust-amount">
                <div class="amt">{{ c.totalSpent | pkr }}</div>
                <div class="lbl">
                  <span class="badge" [ngClass]="c.paymentType === 'cash' ? 'badge-success' : 'badge-warning'">
                    {{ c.paymentType }}
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

    </div>
  `
})
export class StatisticsComponent {
  data = inject(DataService);

  private _activePeriod = signal<PeriodKey>('week');
  activePeriod = this._activePeriod.asReadonly();

  periods: { key: PeriodKey; label: string }[] = [
    { key: 'today', label: 'Today'      },
    { key: 'week',  label: 'This Week'  },
    { key: 'month', label: 'This Month' },
  ];

  setPeriod(key: PeriodKey) {
    this._activePeriod.set(key);
  }

  // ── Summary Totals ────────────────────────────────────────
  totalRevenue   = computed(() => this.salesData().reduce((s, e) => s + e.total, 0));
  totalUnitsSold = computed(() => this.salesData().reduce((s, e) => s + e.quantity, 0));
  totalCashSales = computed(() => this.salesData().filter(e => e.paymentType === 'cash').reduce((s, e) => s + e.total, 0));
  totalUdharSales= computed(() => this.salesData().filter(e => e.paymentType === 'udhar').reduce((s, e) => s + e.total, 0));

  // ── Mock sales data (replace with DataService.salesEntries() signal) ──
  salesData = signal([
    { product: 'Sugar',         category: 'Grocery',   unit: 'kg',    quantity: 42, total: 4200,  paymentType: 'cash',  date: 'Mon' },
    { product: 'Milk',          category: 'Dairy',     unit: 'litre', quantity: 28, total: 5600,  paymentType: 'udhar', date: 'Mon' },
    { product: 'Rice (Basmati)',category: 'Grocery',   unit: 'kg',    quantity: 60, total: 19200, paymentType: 'cash',  date: 'Tue' },
    { product: 'Cooking Oil',   category: 'Grocery',   unit: 'litre', quantity: 15, total: 7950,  paymentType: 'udhar', date: 'Tue' },
    { product: 'Bread',         category: 'Bakery',    unit: 'pcs',   quantity: 55, total: 3300,  paymentType: 'cash',  date: 'Wed' },
    { product: 'Tea (Lipton)',  category: 'Beverages', unit: 'pack',  quantity: 10, total: 3700,  paymentType: 'cash',  date: 'Wed' },
    { product: 'Sugar',         category: 'Grocery',   unit: 'kg',    quantity: 30, total: 3000,  paymentType: 'cash',  date: 'Thu' },
    { product: 'Milk',          category: 'Dairy',     unit: 'litre', quantity: 20, total: 4000,  paymentType: 'udhar', date: 'Thu' },
    { product: 'Bread',         category: 'Bakery',    unit: 'pcs',   quantity: 40, total: 2400,  paymentType: 'cash',  date: 'Fri' },
    { product: 'Rice (Basmati)',category: 'Grocery',   unit: 'kg',    quantity: 25, total: 8000,  paymentType: 'cash',  date: 'Fri' },
    { product: 'Cooking Oil',   category: 'Grocery',   unit: 'litre', quantity: 8,  total: 4240,  paymentType: 'udhar', date: 'Sat' },
    { product: 'Tea (Lipton)',  category: 'Beverages', unit: 'pack',  quantity: 12, total: 4440,  paymentType: 'cash',  date: 'Sat' },
  ]);

  // ── Fast Moving ───────────────────────────────────────────
  fastMoving = computed(() => {
    const map = new Map<string, { name: string; category: string; unit: string; unitsSold: number; revenue: number; trend: number }>();
    for (const e of this.salesData()) {
      const existing = map.get(e.product);
      if (existing) {
        existing.unitsSold += e.quantity;
        existing.revenue   += e.total;
      } else {
        map.set(e.product, { name: e.product, category: e.category, unit: e.unit, unitsSold: e.quantity, revenue: e.total, trend: Math.floor(Math.random() * 40) - 10 });
      }
    }
    return [...map.values()].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5);
  });

  // ── Slow Moving ───────────────────────────────────────────
  slowMoving = computed(() => [
    { name: 'Biscuits',    category: 'Bakery',    unit: 'pack', unitsSold: 3,  daysInStock: 14 },
    { name: 'Soap (Lifebuoy)', category: 'Household', unit: 'pcs',  unitsSold: 2,  daysInStock: 21 },
    { name: 'Juice (Nestle)',  category: 'Beverages', unit: 'pack', unitsSold: 1,  daysInStock: 18 },
  ]);

  // ── Daily Trend ───────────────────────────────────────────
  dailyTrend = computed(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(label => {
      const daySales = this.salesData().filter(e => e.date === label);
      const cash  = daySales.filter(e => e.paymentType === 'cash').reduce((s, e) => s + e.total, 0);
      const udhar = daySales.filter(e => e.paymentType === 'udhar').reduce((s, e) => s + e.total, 0);
      const total = cash + udhar;
      const max   = 30000;
      return {
        label,
        total,
        cashPct:  Math.round((cash  / max) * 100),
        udharPct: Math.round((udhar / max) * 100),
      };
    });
  });

  // ── Category Breakdown ────────────────────────────────────
  categoryBreakdown = computed(() => {
    const map = new Map<string, number>();
    for (const e of this.salesData()) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.total);
    }
    const total = [...map.values()].reduce((s, v) => s + v, 0);
    const colors: Record<string, string> = {
      Grocery:   'var(--navy-600)',
      Dairy:     '#60a5fa',
      Bakery:    '#f59e0b',
      Beverages: '#34d399',
      Household: '#a78bfa',
    };
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, revenue]) => ({
        name,
        revenue,
        pct:   Math.round((revenue / total) * 100),
        color: colors[name] ?? '#94a3b8',
      }));
  });

  // ── Low Stock Alerts (replace with DataService.stockItems()) ──
  lowStockAlerts = signal([
    { name: 'Milk',        category: 'Dairy',     unit: 'litre', qty: 8  },
    { name: 'Cooking Oil', category: 'Grocery',   unit: 'litre', qty: 3  },
    { name: 'Tea (Lipton)',category: 'Beverages', unit: 'pack',  qty: 0  },
  ]);

  // ── Top Customers ─────────────────────────────────────────
  topCustomers = signal([
    { name: 'Ahmed Raza',    totalSpent: 12400, totalOrders: 8,  lastSeen: '2 days ago', paymentType: 'udhar' },
    { name: 'Bilal Hardware',totalSpent: 9800,  totalOrders: 5,  lastSeen: 'yesterday',  paymentType: 'udhar' },
    { name: 'Erum Boutique', totalSpent: 7200,  totalOrders: 12, lastSeen: 'today',      paymentType: 'cash'  },
    { name: 'Danish & Sons', totalSpent: 5500,  totalOrders: 4,  lastSeen: '3 days ago', paymentType: 'udhar' },
    { name: 'Walk-in',       totalSpent: 4100,  totalOrders: 31, lastSeen: 'today',      paymentType: 'cash'  },
  ]);
}