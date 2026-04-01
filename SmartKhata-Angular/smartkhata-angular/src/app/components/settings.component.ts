// src/app/pages/settings/settings.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="card settings-card">
      <div class="card-header">
        <div class="card-title">Shop Settings</div>
      </div>
      <div class="card-body">

        <div class="form-group">
          <label class="form-label">Shop Name</label>
          <input class="form-input" type="text" [(ngModel)]="form.shopName" />
        </div>

        <div class="form-group">
          <label class="form-label">Owner Name</label>
          <input class="form-input" type="text" [(ngModel)]="form.ownerName" />
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input class="form-input" type="text" [(ngModel)]="form.phone" />
        </div>

        <div class="form-group">
          <label class="form-label">City</label>
          <input class="form-input" type="text" [(ngModel)]="form.city" />
        </div>

        <div class="form-group">
          <label class="form-label">Currency</label>
          <select class="form-input" [(ngModel)]="form.currency">
            <option value="PKR">PKR – Pakistani Rupee</option>
            <option value="USD">USD – US Dollar</option>
            <option value="AED">AED – UAE Dirham</option>
          </select>
        </div>

        <div style="margin-top:24px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
          <button class="btn btn-primary" (click)="save()">Save Changes</button>
          <button class="btn btn-danger" (click)="logout()">Logout</button>
        </div>

      </div>
    </div>
  `
})
export class SettingsComponent {
  toast = inject(ToastService);

  form = {
    shopName:  'Raja Store',
    ownerName: 'Raja Sahib',
    phone:     '0300-1234567',
    city:      'Karachi',
    currency:  'PKR',
  };

  save()   { this.toast.show('Settings saved!'); }
  logout() { this.toast.show('Logged out (demo mode)'); }
}
