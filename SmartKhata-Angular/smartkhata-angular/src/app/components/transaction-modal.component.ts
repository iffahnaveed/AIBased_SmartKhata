// // src/app/components/modals/transaction-modal.component.ts
// import { Component, EventEmitter, Output, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { DataService } from '../../services/data.service';
// import { ToastService } from '../../services/toast.service';

// @Component({
//   selector: 'app-transaction-modal',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="modal-overlay open" (click)="onOverlayClick($event)">
//       <div class="modal">
//         <div class="modal-title">Add Ledger Entry</div>

//         <div class="form-group">
//           <label class="form-label">Customer Name *</label>
//           <input class="form-input" type="text" placeholder="e.g. Ahmed Raza"
//             [(ngModel)]="form.customer" list="customer-list-tx" />
//           <datalist id="customer-list-tx">
//             @for (c of data.customers(); track c.id) {
//               <option [value]="c.name">{{ c.name }}</option>
//             }
//           </datalist>
//         </div>

//         <div class="form-row">
//           <div class="form-group">
//             <label class="form-label">Amount (PKR) *</label>
//             <input class="form-input" type="number" placeholder="0" [(ngModel)]="form.amount" />
//           </div>
//           <div class="form-group">
//             <label class="form-label">Type</label>
//             <select class="form-input" [(ngModel)]="form.type">
//               <option value="credit">Udhaar Given</option>
//               <option value="debit">Payment Received</option>
//             </select>
//           </div>
//         </div>

//         <div class="form-group">
//           <label class="form-label">Note / Item Description</label>
//           <input class="form-input" type="text" placeholder="e.g. Monthly ration"
//             [(ngModel)]="form.note" />
//         </div>

//         <div class="modal-actions">
//           <button class="btn btn-secondary" (click)="close.emit()">Cancel</button>
//           <button class="btn btn-primary" (click)="save()">Save Entry</button>
//         </div>
//       </div>
//     </div>
//   `
// })
// export class TransactionModalComponent {
//   @Output() close = new EventEmitter<void>();

//   data = inject(DataService);
//   toast = inject(ToastService);

//   form = { customer: '', amount: 0, type: 'credit' as 'credit' | 'debit', note: '' };

//   onOverlayClick(e: MouseEvent) {
//     if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
//       this.close.emit();
//     }
//   }

//   save() {
//     if (!this.form.customer || !this.form.amount) {
//       this.toast.show('Please fill all required fields');
//       return;
//     }
//     this.data.addTransaction({
//       customer: this.form.customer,
//       amount: this.form.amount,
//       type: this.form.type,
//       note: this.form.note,
//     });
//     this.toast.show('Transaction added!');
//     this.close.emit();
//   }
// }

// src/app/components/modals/transaction-modal.component.ts
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay open" (click)="onOverlayClick($event)">
      <div class="modal">
        <div class="modal-title">Add Ledger Entry</div>

        <div class="form-group">
          <label class="form-label">Customer Name *</label>
          <input class="form-input" type="text" placeholder="e.g. Ahmed Raza"
            [(ngModel)]="form.customer" list="customer-list-tx" />
          <datalist id="customer-list-tx">
            @for (c of data.customers(); track c.id) {
              <option [value]="c.name">{{ c.name }}</option>
            }
          </datalist>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Amount (PKR) *</label>
            <input class="form-input" type="number" placeholder="0" [(ngModel)]="form.amount" />
          </div>
          <div class="form-group">
            <label class="form-label">Type</label>
            <select class="form-input" [(ngModel)]="form.type">
              <option value="credit">Udhaar Given</option>
              <option value="debit">Payment Received</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Note / Item Description</label>
          <input class="form-input" type="text" placeholder="e.g. Monthly ration"
            [(ngModel)]="form.note" />
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" (click)="close.emit()">Cancel</button>
          <button class="btn btn-primary" (click)="save()">Save Entry</button>
        </div>
      </div>
    </div>
  `
})
export class TransactionModalComponent {
  @Output() close = new EventEmitter<void>();

  data  = inject(DataService);
  toast = inject(ToastService);

  form = { customer: '', amount: 0, type: 'credit' as 'credit' | 'debit', note: '' };

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  save() {
    if (!this.form.customer || !this.form.amount) {
      this.toast.show('Please fill all required fields');
      return;
    }

    // Look up customer_id from the customers list by name
    const customer = this.data.customers().find(c => c.name === this.form.customer);
    if (!customer) {
      this.toast.show('Customer not found. Please select a valid customer.');
      return;
    }

    this.data.addTransaction({
      customer: this.form.customer,
      customer_id: customer.id,
      type: this.form.type,
      amount: this.form.amount,
      note: this.form.note,
    });
    this.toast.show('Transaction added!');
    this.close.emit();
  }
}