import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { AppComponent } from './app.component';

export class WebSocketAPI {
  webSocketEndPoint: string = 'http://10.0.2.196:8080/ws';
  topic = '/auction/bet';
  stompClient: any;
  appComponent: AppComponent;
  constructor(appComponent: AppComponent) {
    this.appComponent = appComponent;
  }
  _connect() {
    console.log('Initialize WebSocket Connection');
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect(
      {},
      frame => {
        _this.stompClient.subscribe(_this.topic, sdkEvent => {
          _this.onMessageReceived(sdkEvent);
        });
      },
      this.errorCallBack
    );
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  errorCallBack(error) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  _send(message) {
    console.log('calling logout api via web socket');
    this.stompClient.send('/app/hello', {}, JSON.stringify(message));
  }

  onMessageReceived(message) {
    console.log('Message Recieved from Server :: ' + message);
    this.appComponent.handleMessage(JSON.parse(message.body));
  }
}
