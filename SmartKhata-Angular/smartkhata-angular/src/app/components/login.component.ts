import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
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
          <h2>Manage your<br/><em>udhaar</em> the<br/>smart way.</h2>
          <p>Track every credit and payment with your customers — no more lost entries, no more awkward conversations.</p>
        </div>

        <div class="features">
          <div class="feature">
            <div class="feat-icon">
              <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
            </div>
            <div class="feat-text">
              <strong>Digital Khata Book</strong>
              <span>Every transaction recorded instantly</span>
            </div>
          </div>
          <div class="feature">
            <div class="feat-icon">
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>
            </div>
            <div class="feat-text">
              <strong>Invoice Generation</strong>
              <span>Create &amp; share invoices in seconds</span>
            </div>
          </div>
          <div class="feature">
            <div class="feat-icon">
              <svg viewBox="0 0 24 24"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            </div>
            <div class="feat-text">
              <strong>Live Dashboard</strong>
              <span>Know who owes what, at a glance</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <div class="auth-card">
          <div class="greeting">
            <h2>Welcome back</h2>
            <p>Sign in to your SmartKhata account</p>
          </div>

          @if (errorMsg()) {
            <div class="error-msg show">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{{ errorMsg() }}</span>
            </div>
          }

          @if (successMsg()) {
            <div class="success-msg show">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{{ successMsg() }}</span>
            </div>
          }

          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <div class="input-wrap">
              <input class="form-input" [(ngModel)]="phone" type="tel" placeholder="0300-1234567" />
              <span class="input-icon">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrap">
              <input class="form-input" [(ngModel)]="password"
                [type]="showPwd() ? 'text' : 'password'"
                placeholder="Enter your password"
                (keydown.enter)="doLogin()" />
              <span class="input-icon" (click)="showPwd.set(!showPwd())">
                @if (!showPwd()) {
                  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                } @else {
                  <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                }
              </span>
            </div>
          </div>

          <div class="form-row">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="rememberMe"/> Remember me
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          <button class="btn-submit" [disabled]="isLoading()" (click)="doLogin()">
            @if (isLoading()) {
              <span class="spinner"></span>
              Signing in…
            } @else {
              <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Sign In
            }
          </button>

          <div class="divider"><span>or continue with</span></div>

          <button class="btn-google" (click)="showGoogleToast()">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div class="auth-switch">
            Don't have an account? <a routerLink="/signup">Create one free</a>
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
      --beige-500: #C4A882; --beige-400: #D9C4A3; --beige-300: #E8D9C2;
      --beige-200: #F0E8D8; --beige-100: #F7F2EA; --beige-50: #FDFAF5;
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

    .left-panel {
      width: 46%;
      background: var(--navy-900);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48px 52px;
      position: relative;
      overflow: hidden;
    }
    .left-panel::before {
      content: '';
      position: absolute;
      bottom: -80px; right: -80px;
      width: 320px; height: 320px;
      border-radius: 50%;
      background: rgba(59,104,200,0.18);
    }
    .left-panel::after {
      content: '';
      position: absolute;
      top: 100px; left: -60px;
      width: 220px; height: 220px;
      border-radius: 50%;
      background: rgba(148,174,226,0.08);
    }

    .brand { display: flex; align-items: center; gap: 12px; z-index: 1; position: relative; }
    .brand-icon {
      width: 42px; height: 42px;
      background: var(--navy-600);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .brand-icon svg { width: 22px; height: 22px; stroke: var(--beige-300); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .brand-text h1 { font-family: var(--font-disp); font-size: 24px; color: var(--beige-200); }
    .brand-text p { font-size: 10px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--navy-400); margin-top: 2px; }

    .hero-copy { z-index: 1; position: relative; }
    .hero-copy h2 { font-family: var(--font-disp); font-size: 38px; color: var(--beige-100); line-height: 1.15; margin-bottom: 16px; }
    .hero-copy h2 em { font-style: italic; color: var(--navy-300); }
    .hero-copy p { font-size: 14px; color: var(--navy-300); line-height: 1.7; max-width: 340px; }

    .features { display: flex; flex-direction: column; gap: 14px; z-index: 1; position: relative; }
    .feature { display: flex; align-items: center; gap: 12px; }
    .feat-icon {
      width: 36px; height: 36px;
      background: rgba(255,255,255,0.07);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .feat-icon svg { width: 16px; height: 16px; stroke: var(--navy-300); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .feat-text strong { font-size: 13px; color: var(--beige-200); display: block; font-weight: 600; }
    .feat-text span   { font-size: 11.5px; color: var(--navy-400); }

    .right-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 32px; }
    .auth-card { width: 100%; max-width: 420px; }

    .greeting { margin-bottom: 32px; }
    .greeting h2 { font-family: var(--font-disp); font-size: 30px; color: var(--navy-900); margin-bottom: 6px; }
    .greeting p  { font-size: 13.5px; color: var(--beige-700); }

    .form-group { margin-bottom: 18px; }
    .form-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.9px; color: var(--beige-800); margin-bottom: 7px; }
    .form-input {
      width: 100%; height: 44px;
      border: 1.5px solid var(--beige-300);
      border-radius: 10px;
      padding: 0 14px;
      font-size: 14px;
      font-family: var(--font-main);
      background: white;
      color: var(--navy-800);
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .form-input:focus { border-color: var(--navy-500); box-shadow: 0 0 0 3px rgba(59,104,200,0.12); }
    .form-input::placeholder { color: var(--beige-500); }

    .input-wrap { position: relative; }
    .input-wrap .form-input { padding-right: 42px; }
    .input-icon { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); cursor: pointer; color: var(--beige-500); }
    .input-icon svg { width: 17px; height: 17px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .form-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--beige-800); cursor: pointer; }
    .checkbox-label input { accent-color: var(--navy-600); width: 15px; height: 15px; }
    .forgot-link { font-size: 12.5px; color: var(--navy-600); font-weight: 600; text-decoration: none; }
    .forgot-link:hover { text-decoration: underline; }

    .btn-submit {
      width: 100%; height: 46px;
      background: var(--navy-700);
      color: var(--beige-200);
      border: none; border-radius: 10px;
      font-size: 14px; font-weight: 700;
      font-family: var(--font-main);
      cursor: pointer;
      transition: background 0.15s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-bottom: 20px;
    }
    .btn-submit:hover:not(:disabled) { background: var(--navy-800); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
    .btn-submit svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

    .spinner {
      width: 15px; height: 15px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .divider { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--beige-300); }
    .divider span { font-size: 11px; color: var(--beige-700); white-space: nowrap; }

    .btn-google {
      width: 100%; height: 44px;
      background: white;
      border: 1.5px solid var(--beige-300);
      border-radius: 10px;
      font-size: 13.5px; font-weight: 600;
      font-family: var(--font-main);
      color: var(--navy-800);
      cursor: pointer;
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
    }
  `]
})
export class LoginComponent {
  phone      = '';
  password   = '';
  rememberMe = false;
  showPwd    = signal(false);
  errorMsg   = signal('');
  successMsg = signal('');
  isLoading  = signal(false);

  constructor(private router: Router, private http: HttpClient) {}

  doLogin() {
    this.errorMsg.set('');
    this.successMsg.set('');

    if (!this.phone || !this.password) {
      this.errorMsg.set('Please enter your phone number and password.');
      return;
    }

    this.isLoading.set(true);

    this.http.post<{ success: boolean; message: string }>(
      'http://localhost:5000/api/auth/login',
      { phoneNumber: this.phone, password: this.password }
    ).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          sessionStorage.setItem('sk_logged_in', '1');
          this.successMsg.set('Login successful! Redirecting…');
          setTimeout(() => this.router.navigate(['/dashboard']), 1400);
        } else {
          this.errorMsg.set('Invalid phone number or password.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMsg.set('Invalid phone number or password.');
      }
    });
  }

  showGoogleToast() {
    this.successMsg.set('Google sign-in coming soon!');
    setTimeout(() => this.successMsg.set(''), 2500);
  }
}