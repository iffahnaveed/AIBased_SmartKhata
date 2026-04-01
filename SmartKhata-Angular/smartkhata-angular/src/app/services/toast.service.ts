// src/app/services/toast.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal('');
  visible = signal(false);

  private timer: ReturnType<typeof setTimeout> | null = null;

  show(msg: string): void {
    this.message.set(msg);
    this.visible.set(true);
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.visible.set(false), 2800);
  }
}
