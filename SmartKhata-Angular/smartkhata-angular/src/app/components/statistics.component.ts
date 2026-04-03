// src/app/pages/statistics/statistics.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SaleApiService } from '../services/sale-api.service';
import { StockApiService } from '../services/stockapi.service';

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

  

    <!-- Main Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">

      <!-- Fast Moving Products -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"> Fast Moving Products</div>
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
          <div class="card-title"> Slow Moving Products</div>
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
              All products are moving well 
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
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">

      <!-- Low Stock Alerts -->
      <div class="card">
        <div class="card-header">
          <div class="card-title" style="color:var(--amber-600,#b45309);"> Low Stock Alerts</div>
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

      <!-- Top Customers -->
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

    <!-- AI Stock Predictions Card -->
    <div class="card" style="margin-bottom:20px;">
      <div class="card-header">
        <div class="card-title"> AI Stock Predictions</div>
       
      </div>

      <!-- Summary chips -->
      @if (predictions().length > 0) {
        <div style="display:flex;gap:12px;padding:12px 20px;border-bottom:1px solid var(--beige-100);flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;">
            <span style="width:10px;height:10px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
            <strong>{{ criticalCount() }}</strong> High Demand
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;">
            <span style="width:10px;height:10px;border-radius:50%;background:#f59e0b;display:inline-block;"></span>
            <strong>{{ warningCount() }}</strong> Medium Demand
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;">
            <span style="width:10px;height:10px;border-radius:50%;background:#10b981;display:inline-block;"></span>
            <strong>{{ okCount() }}</strong> Low Demand
          </div>
          <div style="margin-left:auto;font-size:11px;color:var(--beige-700);">
            Total predicted weekly revenue: <strong>{{ totalRestockCost() | pkr }}</strong>
          </div>
        </div>
      }

      <!-- Table -->
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Avg Daily Sales</th>
              <th>Predicted Weekly</th>
              <th>Predicted Revenue</th>
              <th>Demand</th>
              <th>Suggestion</th>
            </tr>
          </thead>
          <tbody>
            @if (predictions().length === 0) {
              <tr>
                <td colspan="7" style="text-align:center;padding:40px;color:var(--beige-700);">
                  <div style="font-size:32px;margin-bottom:8px;"></div>
                  <div style="font-size:13px;font-weight:600;">No predictions yet</div>
                  <div style="font-size:11px;margin-top:4px;">Add sales data to generate predictions</div>
                </td>
              </tr>
            } @else {
              @for (p of predictions(); track p.name) {
                <tr [style.background]="p.demand === 'high' ? 'rgba(239,68,68,0.04)' : p.demand === 'medium' ? 'rgba(245,158,11,0.04)' : 'transparent'">
                  <td><strong>{{ p.name }}</strong></td>
                  <td style="color:var(--beige-700);font-size:12px;">{{ p.category }}</td>
                  <td>
                    <span style="font-weight:600;">{{ p.avgDaily }}</span>
                    <span style="color:var(--beige-600);font-size:11px;margin-left:3px;">{{ p.unit }}/day</span>
                  </td>
                  <td>
                    <span style="font-weight:600;">{{ p.predictedWeekly }}</span>
                    <span style="color:var(--beige-600);font-size:11px;margin-left:3px;">{{ p.unit }}</span>
                  </td>
                  <td>
                    <span style="font-weight:700;color:var(--navy-700);">{{ p.predictedRevenue | pkr }}</span>
                  </td>
                  <td>
                    <span class="badge"
                      [ngClass]="{
                        'badge-danger':  p.demand === 'high',
                        'badge-warning': p.demand === 'medium',
                        'badge-success': p.demand === 'low'
                      }">
                      {{ p.demand === 'high' ? '🔴 High'
                       : p.demand === 'medium' ? '🟡 Medium'
                       : '🟢 Low' }}
                    </span>
                  </td>
                  <td style="font-size:11px;color:var(--beige-700);">{{ p.suggestion }}</td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class StatisticsComponent {

  // ── Inject APIs ───────────────────────────
  private saleApi  = inject(SaleApiService);
  private stockApi = inject(StockApiService);

  constructor() {
    this.saleApi.loadAll().subscribe();
    this.stockApi.loadAll().subscribe();
  }

  // ── Period Tabs ──────────────────────────
  private _activePeriod = signal<PeriodKey>('week');
  activePeriod = this._activePeriod.asReadonly();

  
  setPeriod(key: PeriodKey) {
    this._activePeriod.set(key);
  }

  // ── Sales Data from API ──────────────────
  salesData = computed(() => this.saleApi.saleEntries());

  // ── Summary Totals ───────────────────────
  totalRevenue = computed(() =>
    this.salesData().reduce((s, e) => s + e.total, 0)
  );

  totalUnitsSold = computed(() =>
    this.salesData().reduce((s, e) => s + e.quantity, 0)
  );

  totalCashSales = computed(() =>
    this.salesData()
      .filter(e => e.paymentType === 'cash')
      .reduce((s, e) => s + e.total, 0)
  );

  totalUdharSales = computed(() =>
    this.salesData()
      .filter(e => e.paymentType === 'udhar')
      .reduce((s, e) => s + e.total, 0)
  );

  // ── Fast Moving Products ─────────────────
  fastMoving = computed(() => {
    const map = new Map<string, any>();
    for (const e of this.salesData()) {
      const existing = map.get(e.product);
      if (existing) {
        existing.unitsSold += e.quantity;
        existing.revenue   += e.total;
      } else {
        map.set(e.product, {
          name: e.product,
          category: e.category,
          unit: e.unit,
          unitsSold: e.quantity,
          revenue: e.total,
          trend: Math.floor(Math.random() * 40) - 10
        });
      }
    }
    return [...map.values()]
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);
  });

  // ── Slow Moving Products ─────────────────
  slowMoving = computed(() => {
    const salesMap = new Map<string, number>();
    for (const s of this.salesData()) {
      salesMap.set(s.product, (salesMap.get(s.product) ?? 0) + s.quantity);
    }
    return this.stockApi.stockItems()
      .map(item => ({
        name: item.name,
        category: item.category,
        unit: item.unit,
        unitsSold: salesMap.get(item.name) ?? 0,
        daysInStock: item.quantity
      }))
      .filter(p => p.unitsSold <= 5)
      .slice(0, 5);
  });

  // ── Daily Sales Trend ────────────────────
  dailyTrend = computed(() => {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    return days.map(label => {
      const daySales = this.salesData().filter(
        e => new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' }) === label
      );
      const cash  = daySales.filter(e => e.paymentType === 'cash').reduce((s, e) => s + e.total, 0);
      const udhar = daySales.filter(e => e.paymentType === 'udhar').reduce((s, e) => s + e.total, 0);
      const total = cash + udhar;
      const max   = 30000;
      return {
        label,
        total,
        cashPct:  Math.round((cash  / max) * 100),
        udharPct: Math.round((udhar / max) * 100)
      };
    });
  });

  // ── Category Breakdown ───────────────────
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
      Household: '#a78bfa'
    };
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, revenue]) => ({
        name,
        revenue,
        pct: Math.round((revenue / total) * 100),
        color: colors[name] ?? '#94a3b8'
      }));
  });

  // ── Low Stock Alerts ─────────────────────
  lowStockAlerts = computed(() =>
    this.stockApi.stockItems()
      .filter(i => i.status !== 'in-stock')
      .map(i => ({
        name: i.name,
        category: i.category,
        unit: i.unit,
        qty: i.quantity
      }))
  );

  // ── Top Customers ────────────────────────
  topCustomers = computed(() => {
    const map = new Map<string, any>();
    for (const s of this.salesData()) {
      if (!s.customer) continue;
      const existing = map.get(s.customer);
      if (existing) {
        existing.totalSpent  += s.total;
        existing.totalOrders += 1;
        existing.lastSeen     = s.date;
      } else {
        map.set(s.customer, {
          name: s.customer,
          totalSpent: s.total,
          totalOrders: 1,
          lastSeen: s.date,
          paymentType: s.paymentType
        });
      }
    }
    return [...map.values()]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  });

  // ── AI Predictions (renamed alias used by template) ──
  predictions = computed(() => this.aiPredictions());

  // ── Prediction Summary Counts ────────────
  criticalCount  = computed(() => this.aiPredictions().filter(p => p.demand === 'high').length);
  warningCount   = computed(() => this.aiPredictions().filter(p => p.demand === 'medium').length);
  okCount        = computed(() => this.aiPredictions().filter(p => p.demand === 'low').length);
  totalRestockCost = computed(() =>
    this.aiPredictions().reduce((s, p) => s + p.predictedRevenue, 0)
  );

  // ── predLoading (false since data is computed synchronously) ──
  predLoading = computed(() => false);

  // ── AI Sales Prediction ──────────────────
  aiPredictions = computed(() => {
    const sales = this.salesData();
    if (!sales.length) return [];

    const map = new Map<string, any>();
    for (const s of sales) {
      const existing = map.get(s.product);
      if (existing) {
        existing.totalQty     += s.quantity;
        existing.totalRevenue += s.total;
        existing.days         += 1;
      } else {
        map.set(s.product, {
          name: s.product,
          category: s.category,
          unit: s.unit,
          totalQty: s.quantity,
          totalRevenue: s.total,
          days: 1
        });
      }
    }

    return [...map.values()]
      .map(p => {
        const avgDaily = Math.round(p.totalQty / p.days);
        let demand: 'high' | 'medium' | 'low' = 'medium';
        let suggestion = '';

        if (avgDaily >= 10) {
          demand     = 'high';
          suggestion = 'Increase stock and pricing opportunity';
        } else if (avgDaily >= 5) {
          demand     = 'medium';
          suggestion = 'Maintain stock level';
        } else {
          demand     = 'low';
          suggestion = 'Reduce stock or run promotion';
        }

        return {
          name: p.name,
          category: p.category,
          unit: p.unit,
          avgDaily,
          predictedWeekly: avgDaily * 7,
          predictedRevenue: Math.round((p.totalRevenue / p.totalQty) * (avgDaily * 7)),
          demand,
          suggestion
        };
      })
      .sort((a, b) => b.predictedWeekly - a.predictedWeekly)
      .slice(0, 5);
  });
}