import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface PredictionResult {
  product:       string;
  category:      string;
  unit:          string;
  currentStock:  number;
  predictedNeed: number;
  restockAmount: number;
  daysLeft:      number;
  urgency:       'critical' | 'warning' | 'ok';
}

@Injectable({ providedIn: 'root' })
export class PredictApiService {
  private http = inject(HttpClient);
  private base = 'http://localhost:5000/api/predict';

  predictions = signal<PredictionResult[]>([]);
  loading     = signal(false);
  error       = signal<string | null>(null);

  loadAll() {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<PredictionResult[]>(`${this.base}/all`).pipe(
      tap({
        next: data => { this.predictions.set(data); this.loading.set(false); },
        error: ()  => { this.error.set('Prediction service unavailable'); this.loading.set(false); }
      })
    );
  }
}