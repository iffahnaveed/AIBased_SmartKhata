// // src/app/models/data.models.ts

// export interface Customer {
//   id: number;
//   name: string;
//   initials: string;
//   phone: string;
//   balance: number;
//   type: 'credit' | 'debit';
//   lastTx: string;
// }

// export interface Transaction {
//   id: number;
//   date: string;
//   customer: string;
//   type: 'credit' | 'debit';
//   amount: number;
//   note: string;
//   balance: number;
//   status: 'cleared' | 'pending' | 'overdue';
// }

// export interface Invoice {
//   id: string;
//   date: string;
//   customer: string;
//   amount: number;
//   due: string;
//   status: 'paid' | 'unpaid' | 'partial' | 'overdue';
// }

// export interface NavItem {
//   id: string;
//   icon: string;
//   label: string;
//   route: string;
//   badge?: string;
// }

// export interface BarData {
//   label: string;
//   credit: number;
//   debit: number;
// }

// export interface ActivityItem {
//   dotClass: string;
//   desc: string;
//   descHighlight: string;
//   time: string;
// }

// src/app/models/data.models.ts

export interface Customer {
  id: number;
  name: string;
  initials: string;
  phone: string;
  balance: number;
  type: 'credit' | 'debit';
  lastTx: string;
}

export interface Transaction {
  id: number;
  date: string;
  customer: string;
  type: 'credit' | 'debit';
  amount: number;
  note: string;
  balance: number;
  status: 'cleared' | 'pending' | 'overdue';
}

export interface Invoice {
  id: number;        // ← changed from string to number
  date: string;
  customer: string;
  amount: number;
  due: string;
  status: 'paid' | 'unpaid' | 'partial' | 'overdue';
}

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  route: string;
  badge?: string;
}

export interface BarData {
  label: string;
  credit: number;
  debit: number;
}

export interface ActivityItem {
  dotClass: string;
  desc: string;
  descHighlight: string;
  time: string;
}