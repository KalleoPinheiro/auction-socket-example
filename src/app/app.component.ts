import { Component, OnInit } from '@angular/core';
import { StatusOffer } from './models/status-offer.model';
import { AuctionService } from './services/auction.service';
import { WebSocketAPI } from './websocket-api';
import { differenceInBusinessDays, differenceInMilliseconds } from 'date-fns/esm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  date: Date | string;
  quantity = 0;
  webSocketAPI: WebSocketAPI;
  greeting: any;
  name: string;
  greatOffer: any;
  lastOffer: any;
  disabledIncrease = false;
  disabledDecrease = false;

  constructor(private service?: AuctionService) {}

  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI(new AppComponent());
    this.connect();
    this.getStatusOffer();
    AuctionService.get('greatOffer').subscribe(res => {
      if (res) {
        this.greatOffer = res;
        this.quantity = +this.greatOffer + 250;
      }
    });
    AuctionService.get('lastOffer').subscribe(res => {
      if (res) {
        this.lastOffer = res;
      }
    });
    AuctionService.get('date').subscribe(res => {
      if (res) {
        this.date = res;
      }
    });
  }

  increase() {
    if (this.quantity <= 9999999999) {
      this.quantity = this.quantity + 250;
      return;
    }
    this.disabledIncrease = true;
    this.canDecrease();
  }

  decrease() {
    if (this.quantity >= +this.greatOffer + 250) {
      this.quantity = this.quantity - 250;
      return;
    }
    this.disabledDecrease = true;
    this.canIncrease();
  }

  canDecrease() {
    if (this.quantity <= +this.greatOffer + 250) {
      return true;
    }
    return false;
  }

  canIncrease() {
    if (this.quantity >= 1000000 - 250) {
      return true;
    }
    return false;
  }

  connect() {
    this.webSocketAPI._connect();
  }

  disconnect() {
    this.webSocketAPI._disconnect();
  }

  sendMessage() {
    this.webSocketAPI._send(this.name);
  }

  handleMessage(message) {
    this.greatOffer = message;
    AuctionService.get('greatOffer').emit(message.bidPoints);
    AuctionService.get('date').emit(new Date(message.auctionEndDate));
  }

  offer() {
    this.service
      .makeOffer({
        points: this.quantity,
        offerItemId: '1646',
        offerToken: 'fdff7eeb378c6ed5b0e31d90a728037e'
      })
      .subscribe(
        (res: any) => {
          if (res) {
            this.lastOffer = res.bidPoints;
          }
        },
        error => {
          this.getStatusOffer();
          console.log(error);
        }
      );
  }

  getStatusOffer() {
    this.service.statusOffer().subscribe(
      (res: StatusOffer) => {
        if (res) {
          AuctionService.get('greatOffer').emit(
            res.highestAuctionBet.bidPoints
          );
          AuctionService.get('lastOffer').emit(
            res.customerAuctionBet.bidPoints
          );
          AuctionService.get('date').emit(new Date(res.auctionEndDate));
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
