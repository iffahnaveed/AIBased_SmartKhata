// // src/app/services/data.service.ts
// import { Injectable, signal } from '@angular/core';
// import { Customer, Transaction, Invoice } from '../models/data.models';

// @Injectable({ providedIn: 'root' })
// export class DataService {

//   private _customers = signal<Customer[]>([
//     { id: 1, name: 'Ahmed Raza',       initials: 'AR', phone: '0300-1234567', balance: 4800,  type: 'credit', lastTx: '2 hrs ago'  },
//     { id: 2, name: 'Bilal Hardware',   initials: 'BH', phone: '0321-9876543', balance: 12500, type: 'credit', lastTx: 'Yesterday'  },
//     { id: 3, name: 'Chandni Textiles', initials: 'CT', phone: '0333-4567890', balance: 3200,  type: 'credit', lastTx: '3 days ago' },
//     { id: 4, name: 'Danish & Sons',    initials: 'DS', phone: '0345-1111222', balance: 7600,  type: 'credit', lastTx: '1 week ago' },
//     { id: 5, name: 'Erum Boutique',    initials: 'EB', phone: '0312-5556677', balance: 1900,  type: 'credit', lastTx: 'Today'      },
//     { id: 6, name: 'Farhan Traders',   initials: 'FT', phone: '0311-8887766', balance: 9300,  type: 'credit', lastTx: '4 days ago' },
//     { id: 7, name: 'Gulshan Medic.',   initials: 'GM', phone: '0301-2223334', balance: 2100,  type: 'credit', lastTx: '6 days ago' },
//   ]);

//   private _transactions = signal<Transaction[]>([
//     { id: 1,  date: '28 Mar 2025', customer: 'Ahmed Raza',       type: 'credit', amount: 2500,  note: 'Atta & sugar',       balance: 4800,  status: 'cleared' },
//     { id: 2,  date: '28 Mar 2025', customer: 'Bilal Hardware',   type: 'credit', amount: 4000,  note: 'Paint supplies',     balance: 12500, status: 'cleared' },
//     { id: 3,  date: '27 Mar 2025', customer: 'Ahmed Raza',       type: 'debit',  amount: 1000,  note: 'Cash payment',       balance: 2300,  status: 'cleared' },
//     { id: 4,  date: '27 Mar 2025', customer: 'Chandni Textiles', type: 'credit', amount: 3200,  note: 'Fabric roll x4',     balance: 3200,  status: 'cleared' },
//     { id: 5,  date: '26 Mar 2025', customer: 'Danish & Sons',    type: 'credit', amount: 1800,  note: 'Electrical parts',   balance: 7600,  status: 'pending' },
//     { id: 6,  date: '26 Mar 2025', customer: 'Erum Boutique',    type: 'debit',  amount: 3500,  note: 'Partial settlement', balance: 1900,  status: 'cleared' },
//     { id: 7,  date: '25 Mar 2025', customer: 'Farhan Traders',   type: 'credit', amount: 9300,  note: 'Bulk groceries',     balance: 9300,  status: 'cleared' },
//     { id: 8,  date: '25 Mar 2025', customer: 'Gulshan Medic.',   type: 'credit', amount: 2100,  note: 'Medicine stock',     balance: 2100,  status: 'overdue' },
//     { id: 9,  date: '24 Mar 2025', customer: 'Bilal Hardware',   type: 'debit',  amount: 5000,  note: 'Payment received',   balance: 8500,  status: 'cleared' },
//     { id: 10, date: '24 Mar 2025', customer: 'Danish & Sons',    type: 'credit', amount: 3400,  note: 'Wire & switches',    balance: 5800,  status: 'cleared' },
//     { id: 11, date: '23 Mar 2025', customer: 'Ahmed Raza',       type: 'credit', amount: 3300,  note: 'Monthly ration',     balance: 3300,  status: 'cleared' },
//     { id: 12, date: '22 Mar 2025', customer: 'Chandni Textiles', type: 'debit',  amount: 1500,  note: 'Online transfer',    balance: 0,     status: 'cleared' },
//   ]);

//   private _invoices = signal<Invoice[]>([
//     { id: 'INV-001', date: '28 Mar 2025', customer: 'Bilal Hardware',   amount: 4000,  due: '04 Apr 2025', status: 'unpaid'  },
//     { id: 'INV-002', date: '27 Mar 2025', customer: 'Danish & Sons',    amount: 5200,  due: '03 Apr 2025', status: 'partial' },
//     { id: 'INV-003', date: '26 Mar 2025', customer: 'Chandni Textiles', amount: 3200,  due: '02 Apr 2025', status: 'paid'    },
//     { id: 'INV-004', date: '25 Mar 2025', customer: 'Farhan Traders',   amount: 9300,  due: '01 Apr 2025', status: 'unpaid'  },
//     { id: 'INV-005', date: '25 Mar 2025', customer: 'Gulshan Medic.',   amount: 2100,  due: '25 Mar 2025', status: 'overdue' },
//     { id: 'INV-006', date: '24 Mar 2025', customer: 'Ahmed Raza',       amount: 3300,  due: '31 Mar 2025', status: 'paid'    },
//     { id: 'INV-007', date: '22 Mar 2025', customer: 'Erum Boutique',    amount: 5400,  due: '29 Mar 2025', status: 'partial' },
//     { id: 'INV-008', date: '20 Mar 2025', customer: 'Bilal Hardware',   amount: 8000,  due: '27 Mar 2025', status: 'paid'    },
//   ]);

//   // ---- Readonly signals ----
//   readonly customers = this._customers.asReadonly();
//   readonly transactions = this._transactions.asReadonly();
//   readonly invoices = this._invoices.asReadonly();

//   // ---- Add Transaction ----
//   addTransaction(tx: Omit<Transaction, 'id' | 'date' | 'balance' | 'status'>): void {
//     const today = new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
//     const newTx: Transaction = {
//       id: this._transactions().length + 1,
//       date: today,
//       balance: tx.amount,
//       status: 'pending',
//       ...tx
//     };
//     this._transactions.update(txs => [newTx, ...txs]);
//   }

//   // ---- Add Invoice ----
//   addInvoice(inv: Omit<Invoice, 'id' | 'date' | 'status'>): void {
//     const today = new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
//     const id = 'INV-' + String(this._invoices().length + 1).padStart(3, '0');
//     const newInv: Invoice = { id, date: today, status: 'unpaid', ...inv };
//     this._invoices.update(invs => [newInv, ...invs]);
//   }

//   // ---- Mark Invoice as Paid ----
//   markInvoicePaid(invId: string): void {
//     this._invoices.update(invs =>
//       invs.map(inv => inv.id === invId ? { ...inv, status: 'paid' } : inv)
//     );
//   }

//   // ---- Helpers ----
//   pkr(n: number): string {
//     return 'PKR ' + n.toLocaleString('en-PK');
//   }

//   getTopCustomers(count = 5): Customer[] {
//     return [...this._customers()].sort((a, b) => b.balance - a.balance).slice(0, count);
//   }

//   getTotalUdhaar(): number {
//     return this._customers().reduce((s, c) => s + c.balance, 0);
//   }

//   getOverdueCount(): number {
//     return this._invoices().filter(i => i.status === 'overdue').length;
//   }
// }

// src/app/services/data.service.ts
import { Injectable, signal } from '@angular/core';
import { Customer, Transaction, Invoice } from '../models/data.models';
import { ApiService } from './api.services';

@Injectable({ providedIn: 'root' })
export class DataService {

  private _customers = signal<Customer[]>([]);
  private _transactions = signal<Transaction[]>([]);
  private _invoices = signal<Invoice[]>([]);

  readonly customers = this._customers.asReadonly();
  readonly transactions = this._transactions.asReadonly();
  readonly invoices = this._invoices.asReadonly();

  constructor(private api: ApiService) {
    this.loadAll();
  }

  // ── Load from backend ──────────────────────────────────────
  loadAll(): void {
    this.api.getCustomers().subscribe(data => this._customers.set(data));
    this.api.getLedger().subscribe(data => this._transactions.set(data));
    this.api.getInvoices().subscribe(data => this._invoices.set(data));
  }

  // ── Add Transaction (Ledger Entry) ─────────────────────────
  addTransaction(tx: { customer: string; customer_id: number; type: string; amount: number; note: string }): void {
    const payload = {
      customer_id: tx.customer_id,
      type: tx.type,
      amount: tx.amount,
      description: tx.note,
      entry_date: new Date().toISOString().split('T')[0]
    };
    this.api.addLedgerEntry(payload).subscribe(() => {
      this.api.getLedger().subscribe(data => this._transactions.set(data));
    });
  }

  // ── Add Invoice ────────────────────────────────────────────
  addInvoice(inv: { customer: string; customer_id: number; amount: number; due: string }): void {
    const payload = {
      customer_id: inv.customer_id,
      amount: inv.amount,
      due_date: inv.due,
      status: 'unpaid'
    };
    this.api.addInvoice(payload).subscribe(() => {
      this.api.getInvoices().subscribe(data => this._invoices.set(data));
    });
  }

  // ── Add Customer ───────────────────────────────────────────
  addCustomer(c: { name: string; phone: string; email?: string; address?: string }): void {
    this.api.addCustomer(c).subscribe(() => {
      this.api.getCustomers().subscribe(data => this._customers.set(data));
    });
  }

  // ── Mark Invoice as Paid ───────────────────────────────────
  markInvoicePaid(invId: number): void {
    this.api.updateInvoice(invId, { status: 'paid' }).subscribe(() => {
      this.api.getInvoices().subscribe(data => this._invoices.set(data));
    });
  }

  // ── Helpers ────────────────────────────────────────────────
  pkr(n: number): string {
    return 'PKR ' + n.toLocaleString('en-PK');
  }

  getTopCustomers(count = 5): Customer[] {
    return [...this._customers()].sort((a, b) => b.balance - a.balance).slice(0, count);
  }

  getTotalUdhaar(): number {
    return this._customers().reduce((s, c) => s + (c.balance ?? 0), 0);
  }

  getOverdueCount(): number {
    return this._invoices().filter(i => i.status === 'overdue').length;
  }
}