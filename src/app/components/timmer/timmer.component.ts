import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { formatDistanceStrict } from 'date-fns';
import {
  addMinutes,
  differenceInMilliseconds,
  isBefore,
  subSeconds
} from 'date-fns/esm';
import pt from 'date-fns/locale/pt';
import { Observable, Subscription, timer } from 'rxjs';
import { finalize, map, takeUntil, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-timmer',
  templateUrl: './timmer.component.html',
  styleUrls: ['./timmer.component.scss']
})
export class TimmerComponent implements OnInit, OnDestroy {
  @Input() date: Date;
  sub = new Subscription();
  quantity: string;
  prefix: string;
  interval: Observable<any>;
  progress = 100;
  time: number;
  countdown: number;
  totalDuration: number;
  count = 0;
  unit = null;

  constructor() {}

  ngOnInit() {
    if (this.date) {
      this.date = addMinutes(this.date, 1);
      this.startCountdown();
    }
  }

  startCountdown() {
    this.updateLabels();
    this.interval = timer(0, 1000).pipe(
      takeUntil(timer(this.getDuration(this.date) + 1000)),
      map(value => this.getDuration(this.date) - value * 1000)
    );

    this.time = this.getDuration(this.date);
    this.totalDuration = differenceInMilliseconds(
      new Date(this.date),
      new Date()
    );

    this.sub.add(
      this.interval.subscribe(() => {
        this.progress = this.getPercent(this.totalDuration);
        this.updateLabels();
      })
    );
  }

  updateLabels() {
    if (isBefore(new Date(), this.date)) {
      const fullDate = formatDistanceStrict(this.date, new Date(), {
        addSuffix: false,
        unit: this.unit,
        roundingMethod: 'ceil',
        locale: pt
      });
      this.quantity = fullDate.split(' ')[0];
      this.prefix = this.replacePrefix(fullDate.split(' ')[1]);
      if (this.quantity === '0') {
        this.progress = 0;
        const interval = timer(0, 1000).pipe(
          takeWhile(value => value <= 3),
          finalize(() => console.log('Finalizou'))
        );
        this.sub.add(interval.subscribe(() => {}));
      }
      if (this.quantity === '1' && this.prefix === 'min' && this.count === 0) {
        this.unit = 'second';
        this.count++;
      }
    } else {
    }
  }

  getPercent(duration: number): number {
    const value = Math.floor((this.time / 1000) * 100) / (duration / 1000);
    this.time -= 1000;
    return value;
  }

  getDuration(date: Date): number {
    return differenceInMilliseconds(new Date(subSeconds(date, 1)), new Date());
  }

  replacePrefix(prefix: string): string {
    switch (prefix) {
      case 'segundo':
        return 'seg';
      case 'minuto':
        return 'min';
      case 'segundos':
        return 'seg';
      case 'minutos':
        return 'min';
      default:
        return prefix;
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.count = 0;
      this.sub.unsubscribe();
    }
  }
}
