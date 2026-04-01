# SmartKhata Angular — Complete Setup Guide

## What's Inside

SmartKhata is a **Udhaar / Shop Credit Management System** for small shopkeepers and retailers in Pakistan. This is the full Angular 17 conversion of the original vanilla JS project.

---

## Project Structure

```
smartkhata-angular/
├── src/
│   ├── index.html                    ← Main HTML with Google Fonts
│   ├── main.ts                       ← Bootstrap entry point
│   ├── styles.css                    ← All global styles & CSS variables
│   └── app/
│       ├── app.component.ts          ← Root component (shell layout)
│       ├── app.routes.ts             ← Lazy-loaded routes
│       ├── models/
│       │   └── data.models.ts        ← TypeScript interfaces
│       ├── services/
│       │   ├── data.service.ts       ← All data + CRUD (Angular signals)
│       │   └── toast.service.ts      ← Toast notification service
│       ├── components/
│       │   ├── sidebar/
│       │   │   └── sidebar.component.ts
│       │   ├── topbar/
│       │   │   └── topbar.component.ts
│       │   └── modals/
│       │       ├── transaction-modal.component.ts
│       │       ├── invoice-modal.component.ts
│       │       └── toast.component.ts
│       ├── pages/
│       │   ├── dashboard/dashboard.component.ts
│       │   ├── ledger/ledger.component.ts
│       │   ├── invoices/invoices.component.ts
│       │   ├── customers/customers.component.ts
│       │   └── settings/settings.component.ts
│       └── shared/
│           └── pipes/
│               └── pkr.pipe.ts       ← PKR currency formatter
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Prerequisites

Make sure these are installed on your machine:

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18.x or 20.x | `node -v` |
| npm | 9.x+ | `npm -v` |
| Angular CLI | 17.x | `ng version` |

### Install Node.js
Download from: https://nodejs.org/en/download

### Install Angular CLI (if not already installed)
```bash
npm install -g @angular/cli
```

---

## Setup Steps

### Step 1 — Extract the project
Unzip `SmartKhata-Angular.zip` to any folder:
```bash
unzip SmartKhata-Angular.zip
cd smartkhata-angular
```

### Step 2 — Install dependencies
```bash
npm install
```
This downloads all Angular packages (~200MB, takes 1–2 min).

### Step 3 — Run the development server
```bash
ng serve --open
```
Opens automatically at: **http://localhost:4200**

---

## Available Pages & Routes

| Page | URL | Features |
|------|-----|----------|
| Dashboard | `/dashboard` | KPI cards, bar chart, top balances, activity feed, recent transactions |
| Ledger | `/ledger` | Full transaction table, search, type & status filters, summary bar |
| Invoices | `/invoices` | Status tabs, search, mark-paid action, invoice stats |
| Customers | `/customers` | Card grid, search, outstanding balances |
| Settings | `/settings` | Shop profile form |

---

## Key Angular Features Used

- **Standalone Components** — No NgModule boilerplate
- **Angular Signals** — Reactive state with `signal()`, `computed()`, `effect()`
- **Lazy Loading** — Each page loads on demand via `loadComponent()`
- **RouterLink / RouterLinkActive** — Active nav highlighting
- **FormsModule** — Two-way binding with `[(ngModel)]`
- **Custom Pipe** — `PkrPipe` formats numbers as `PKR 1,234`
- **@for / @if** — New Angular 17 control flow syntax

---

## Build for Production

```bash
ng build
```
Output goes to `dist/smartkhata/`. Deploy to any static host (Netlify, Vercel, Firebase Hosting, etc.)

---

## Common Issues & Fixes

### `ng: command not found`
```bash
npm install -g @angular/cli
```

### `Module not found` errors
```bash
rm -rf node_modules
npm install
```

### Port 4200 already in use
```bash
ng serve --port 4201
```

### Blank white page
Make sure you opened `http://localhost:4200` (not `file://...`)

---

## Connecting a Real Backend (Next Steps)

The app currently uses **in-memory data** (no persistence). To connect a real API:

1. Replace `DataService` methods with `HttpClient` calls
2. Add `provideHttpClient()` in `main.ts`
3. Add Angular route guards for login/logout (`CanActivate`)
4. Use a backend like Firebase, Supabase, or a custom Node.js/Django API

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 17 |
| Language | TypeScript 5.2 |
| Styling | Pure CSS with CSS Variables |
| State | Angular Signals |
| Fonts | DM Serif Display + Plus Jakarta Sans |
| Build | Angular CLI / Webpack |

---

*SmartKhata — Phase 3 MVP · Built for Pakistani shopkeepers & retailers*
