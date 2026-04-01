// src/app/shared/pipes/pkr.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pkr', standalone: true })
export class PkrPipe implements PipeTransform {
  transform(value: number): string {
    return 'PKR ' + value.toLocaleString('en-PK');
  }
}
