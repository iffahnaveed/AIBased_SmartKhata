import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HttpClientModule],
  template: `
    <div class="auth-layout">

      <!-- Left Panel -->
      <div class="left-panel">
        <div class="brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <div class="brand-text">
            <h1>SmartKhata</h1>
            <p>Udhaar Management</p>
          </div>
        </div>

        <div class="hero-copy">
          <h2>Start your<br/><em>free</em> digital<br/>khata today.</h2>
          <p>Join thousands of shopkeepers across Pakistan who've replaced their paper khata with SmartKhata.</p>
        </div>

        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-text"><strong>Create your account</strong><span>Takes less than 2 minutes</span></div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-text"><strong>Set up your shop profile</strong><span>Name, city, and contact details</span></div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-text"><strong>Add your first customer</strong><span>Start recording udhaar instantly</span></div>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <div class="auth-card">
          <div class="greeting">
            <h2>Create your account</h2>
            <p>Set up SmartKhata for your shop — it's free</p>
          </div>

          @if (errorMsg()) {
            <div class="error-msg">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{{ errorMsg() }}</span>
            </div>
          }
          @if (successMsg()) {
            <div class="success-msg">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{{ successMsg() }}</span>
            </div>
          }

          <!-- Your Details -->
          <div class="section-divider">Your Details</div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input class="form-input" [(ngModel)]="fullname" type="text" placeholder="Raja Sahib" />
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input class="form-input" [(ngModel)]="phone" type="tel" placeholder="0300-1234567" />
            </div>
          </div>

          <!-- Shop Details -->
          <div class="section-divider">Shop Details</div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Shop Name *</label>
              <input class="form-input" [(ngModel)]="shopname" type="text" placeholder="e.g. Raja General Store" />
            </div>
            <div class="form-group">
              <label class="form-label">City *</label>
              <select class="form-input" [(ngModel)]="city">
                <option value="">Select city…</option>
                <option>Karachi</option><option>Lahore</option>
                <option>Islamabad</option><option>Rawalpindi</option>
                <option>Faisalabad</option><option>Multan</option>
                <option>Peshawar</option><option>Quetta</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <!-- Security -->
          <div class="section-divider">Security</div>

          <div class="form-group">
            <label class="form-label">Password *</label>
            <div class="input-wrap">
              <input class="form-input" [(ngModel)]="password"
                [type]="showPwd() ? 'text' : 'password'"
                placeholder="Min. 6 characters" />
              <span class="input-icon" (click)="showPwd.set(!showPwd())">
                @if (!showPwd()) {
                  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                } @else {
                  <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                }
              </span>
            </div>
            <!-- Password strength bars -->
            <div class="pwd-strength">
              <div class="pwd-bars">
                <div class="pwd-bar" [style.background]="barColor(0)"></div>
                <div class="pwd-bar" [style.background]="barColor(1)"></div>
                <div class="pwd-bar" [style.background]="barColor(2)"></div>
                <div class="pwd-bar" [style.background]="barColor(3)"></div>
              </div>
              <span class="pwd-hint" [class]="pwdHintClass()">{{ pwdHintText() }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Confirm Password *</label>
            <div class="input-wrap">
              <input class="form-input" [(ngModel)]="confirmPwd"
                [type]="showConfirmPwd() ? 'text' : 'password'"
                placeholder="Re-enter password" />
              <span class="input-icon" (click)="showConfirmPwd.set(!showConfirmPwd())">
                @if (!showConfirmPwd()) {
                  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                } @else {
                  <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                }
              </span>
            </div>
          </div>

          <div class="terms-row">
            <input type="checkbox" id="terms" [(ngModel)]="termsAccepted" />
            <label for="terms">
              I agree to SmartKhata's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button class="btn-submit" (click)="doSignup()">
            <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Create My Account
          </button>

          <div class="divider"><span>or sign up with</span></div>

          <button class="btn-google">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div class="auth-switch">
            Already have an account? <a routerLink="/login">Sign in</a>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      --navy-950: #05112B; --navy-900: #0B1F4A; --navy-800: #132960;
      --navy-700: #1E3A7A; --navy-600: #2B4FA3; --navy-500: #3B68C8;
      --navy-400: #6089D4; --navy-300: #94AEE2; --navy-200: #C4D2F0;
      --beige-900: #4A3A26; --beige-800: #6B5439; --beige-700: #8C7055;
      --beige-600: #A98D73; --beige-500: #C4A882; --beige-400: #D9C4A3;
      --beige-300: #E8D9C2; --beige-200: #F0E8D8; --beige-100: #F7F2EA;
      --green-text: #1A5C3A; --green-bg: #D4F0E2;
      --red-text: #7A1F1F;   --red-bg: #FAE0E0;
      --font-main: 'Plus Jakarta Sans', sans-serif;
      --font-disp: 'DM Serif Display', serif;
    }

    .auth-layout {
      font-family: var(--font-main);
      background: var(--beige-100);
      min-height: 100vh;
      display: flex;
      color: var(--navy-900);
    }

    /* ── Left panel ── */
    .left-panel {
      width: 42%;
      background: var(--navy-900);
      display: flex; flex-direction: column;
      justify-content: space-between;
      padding: 48px 52px;
      position: relative; overflow: hidden;
    }
    .left-panel::before {
      content: ''; position: absolute;
      top: -60px; right: -60px;
      width: 280px; height: 280px; border-radius: 50%;
      background: rgba(59,104,200,0.15);
    }
    .left-panel::after {
      content: ''; position: absolute;
      bottom: 80px; left: -50px;
      width: 200px; height: 200px; border-radius: 50%;
      background: rgba(148,174,226,0.07);
    }

    .brand { display: flex; align-items: center; gap: 12px; z-index: 1; position: relative; }
    .brand-icon { width: 42px; height: 42px; background: var(--navy-600); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .brand-icon svg { width: 22px; height: 22px; stroke: var(--beige-300); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .brand-text h1 { font-family: var(--font-disp); font-size: 24px; color: var(--beige-200); }
    .brand-text p { font-size: 10px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--navy-400); margin-top: 2px; }

    .hero-copy { z-index: 1; position: relative; }
    .hero-copy h2 { font-family: var(--font-disp); font-size: 34px; color: var(--beige-100); line-height: 1.2; margin-bottom: 16px; }
    .hero-copy h2 em { font-style: italic; color: var(--navy-300); }
    .hero-copy p { font-size: 13.5px; color: var(--navy-300); line-height: 1.7; max-width: 320px; }

    .steps { display: flex; flex-direction: column; gap: 12px; z-index: 1; position: relative; }
    .step { display: flex; align-items: flex-start; gap: 14px; }
    .step-num { width: 28px; height: 28px; background: var(--navy-600); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--beige-200); flex-shrink: 0; margin-top: 1px; }
    .step-text strong { font-size: 13px; color: var(--beige-200); display: block; font-weight: 600; }
    .step-text span   { font-size: 11.5px; color: var(--navy-400); }

    /* ── Right panel ── */
    .right-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 36px 32px; overflow-y: auto; }
    .auth-card { width: 100%; max-width: 460px; }

    .greeting { margin-bottom: 28px; }
    .greeting h2 { font-family: var(--font-disp); font-size: 28px; color: var(--navy-900); margin-bottom: 5px; }
    .greeting p  { font-size: 13px; color: var(--beige-700); }

    .section-divider {
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1px; color: var(--beige-600);
      margin: 20px 0 14px;
      display: flex; align-items: center; gap: 10px;
    }
    .section-divider::after { content: ''; flex: 1; height: 1px; background: var(--beige-300); }

    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-group { margin-bottom: 16px; }
    .form-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.9px; color: var(--beige-800); margin-bottom: 7px; }
    .form-input {
      width: 100%; height: 42px;
      border: 1.5px solid var(--beige-300); border-radius: 10px;
      padding: 0 14px; font-size: 13.5px;
      font-family: var(--font-main); background: white;
      color: var(--navy-800); outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .form-input:focus { border-color: var(--navy-500); box-shadow: 0 0 0 3px rgba(59,104,200,0.12); }
    .form-input::placeholder { color: var(--beige-500); }

    .input-wrap { position: relative; }
    .input-wrap .form-input { padding-right: 42px; }
    .input-icon { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); cursor: pointer; color: var(--beige-600); }
    .input-icon svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .pwd-strength { margin-top: 6px; }
    .pwd-bars { display: flex; gap: 4px; margin-bottom: 4px; }
    .pwd-bar { flex: 1; height: 3px; border-radius: 3px; background: var(--beige-300); transition: background 0.2s; }
    .pwd-hint { font-size: 11px; color: var(--beige-700); }
    .pwd-hint.weak   { color: #C0392B; }
    .pwd-hint.fair   { color: #C47D1A; }
    .pwd-hint.strong { color: var(--green-text); }

    .terms-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px; font-size: 12.5px; color: var(--beige-800); line-height: 1.5; }
    .terms-row input { accent-color: var(--navy-600); width: 15px; height: 15px; flex-shrink: 0; margin-top: 2px; cursor: pointer; }
    .terms-row a { color: var(--navy-600); font-weight: 600; text-decoration: none; }
    .terms-row a:hover { text-decoration: underline; }

    .btn-submit {
      width: 100%; height: 46px;
      background: var(--navy-700); color: var(--beige-200);
      border: none; border-radius: 10px;
      font-size: 14px; font-weight: 700; font-family: var(--font-main);
      cursor: pointer; transition: background 0.15s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-bottom: 20px;
    }
    .btn-submit:hover { background: var(--navy-800); }
    .btn-submit svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

    .divider { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--beige-300); }
    .divider span { font-size: 11px; color: var(--beige-700); white-space: nowrap; }

    .btn-google {
      width: 100%; height: 44px; background: white;
      border: 1.5px solid var(--beige-300); border-radius: 10px;
      font-size: 13.5px; font-weight: 600; font-family: var(--font-main);
      color: var(--navy-800); cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      transition: background 0.15s, border-color 0.15s;
      margin-bottom: 28px;
    }
    .btn-google:hover { background: var(--beige-100); border-color: var(--beige-400); }

    .auth-switch { text-align: center; font-size: 13px; color: var(--beige-700); }
    .auth-switch a { color: var(--navy-600); font-weight: 700; text-decoration: none; }
    .auth-switch a:hover { text-decoration: underline; }

    .error-msg, .success-msg {
      border-radius: 8px; padding: 10px 14px;
      font-size: 12.5px; font-weight: 500; margin-bottom: 16px;
      display: flex; align-items: center; gap: 8px;
    }
    .error-msg   { background: var(--red-bg);   color: var(--red-text); }
    .success-msg { background: var(--green-bg); color: var(--green-text); }
    .error-msg svg, .success-msg svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }

    @media (max-width: 768px) {
      .left-panel { display: none; }
      .right-panel { padding: 32px 20px; }
      .form-row-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class SignupComponent {
  fullname      = '';
  phone         = '';
  shopname      = '';
  city          = '';
  password      = '';
  confirmPwd    = '';
  termsAccepted = false;
  showPwd         = signal(false);
  showConfirmPwd  = signal(false);
  errorMsg        = signal('');
  successMsg      = signal('');

  constructor(private router: Router, private http: HttpClient) {}

  private get pwdScore(): number {
    const v = this.password;
    let score = 0;
    if (v.length >= 6)  score++;
    if (v.length >= 10) score++;
    if (/[A-Z]/.test(v) && /[0-9]/.test(v)) score++;
    if (/[^a-zA-Z0-9]/.test(v)) score++;
    return score;
  }

  barColor(index: number): string {
    if (!this.password) return 'var(--beige-300)';
    const colors = ['#C0392B', '#C47D1A', '#2E7D5A', '#1A5C3A'];
    return index < this.pwdScore ? colors[this.pwdScore - 1] : 'var(--beige-300)';
  }

  pwdHintText(): string {
    if (!this.password) return 'Enter a password';
    const labels = ['Too short', 'Fair', 'Good', 'Strong'];
    return labels[this.pwdScore - 1] || 'Too short';
  }

  pwdHintClass(): string {
    if (!this.password) return 'pwd-hint';
    const classes = ['weak', 'fair', 'strong', 'strong'];
    return 'pwd-hint ' + (classes[this.pwdScore - 1] || 'weak');
  }

 doSignup() {
  this.errorMsg.set('');
  this.successMsg.set('');
  const show = (msg: string) => this.errorMsg.set(msg);

  if (!this.fullname)           return show('Please enter your full name.');
  if (!this.phone)              return show('Please enter your phone number.');
  if (!this.shopname)           return show('Please enter your shop name.');
  if (!this.city)               return show('Please select your city.');
  if (this.password.length < 6) return show('Password must be at least 6 characters.');
  if (this.password !== this.confirmPwd) return show('Passwords do not match.');
  if (!this.termsAccepted)      return show('Please accept the Terms of Service to continue.');

  const payload = {
    ownerName:   this.fullname,
    phoneNumber: this.phone,
    shopName:    this.shopname,
    city:        this.city,
    currency:    'PKR',
    password:    this.password
  };

  this.http.post<{ success: boolean; message: string }>('http://localhost:5000/api/auth/signup', payload)
    .subscribe({
      next: () => {
        sessionStorage.setItem('sk_logged_in', '1');
        this.successMsg.set('Account created! Redirecting…');
        setTimeout(() => this.router.navigate(['/login']), 1600);
      },
      error: (err: HttpErrorResponse) => {
        show(err.error?.message ?? 'Something went wrong. Please try again.');
      }
    });
}
}