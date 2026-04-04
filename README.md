# SmartKhata

Small retail shopkeepers in Pakistan manage daily sales, customer credit (udhaar), and stock levels using paper khatas or memory. This leads to frequent stockouts, overbuying, and capital tied up in unsold inventory every single day.

SmartKhata replaces the paper khata with a simple digital ledger that does one thing paper cannot: turn recorded sales into actionable restocking decisions. It identifies fast and slow-moving products, tracks udhaar, and uses an ML service to suggest how much stock to order  without requiring any technical knowledge from the shopkeeper.

---

## The Core Problem

- No visibility into which products are selling and which are not
- Inventory decisions based on memory and guesswork
- Stockouts of high-demand items, overstock of slow ones
- Capital wasted, customers lost, stress increased

---

## Stack

- **Frontend** — Angular 17 
- **Backend** — ASP.NET Core 8 Web API
- **ML Service** — Python, FastAPI
- **Database** — PostgreSQL

---

## Setup

**Backend**
```bash
cd smartkhata-backend
dotnet run
```

Update `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=smartkhata;Username=postgres;Password=your_password"
}
```

**Frontend**
```bash
cd smartkhata-angular
npm install
ng serve
```

**ML Service**
```bash
cd smartkhata-ml
uvicorn main:app --port 8000 --reload
```
