import { AnyAction, Dispatch } from '@reduxjs/toolkit';

export class LyricalSocket {
  // singleton
  private static _instance: LyricalSocket;
  public static get instance(): LyricalSocket {
    if (!this._instance) {
      this._instance = new LyricalSocket();
    }
    return this._instance;
  }

  public readonly socket: WebSocket;
  private sessionId = '';

  private constructor() {
    this.socket = new WebSocket(`ws://${window.location.hostname}:8000/ws`);
    this.socket.onopen = () => {
      console.log(`is connected: ${this.socket.readyState === WebSocket.OPEN}`);
    };
  }

  public static isActive(): boolean {
    return this.instance.socket && this.instance.socket.readyState === WebSocket.OPEN;
  }

  public static setSessionId(sessionId?: string): void {
    this.instance.sessionId = sessionId ?? '';
  }

  public static getSessionId(): string {
    return this.instance.sessionId;
  }

  // サーバを経由して、別のクライアントにactionをdispatchする
  public static dispatch(actions: AnyAction[] | AnyAction, reduxDispatch: Dispatch<any> | undefined = undefined) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!Array.isArray(actions)) {
      actions = [actions];
    }

    if (reduxDispatch) {
      actions.forEach(action => {
        reduxDispatch(action);
      });
    }

    if (!this.isActive()) {
      console.error('WebSocket is not connected');
      return;
    }
    this.instance.socket.send(JSON.stringify({
      type: 'dispatch',
      actions: actions,
    }));
  }

  public static dispatchAll(actions: AnyAction[]) {
    if (!this.isActive()) {
      console.error('WebSocket is not connected');
      return;
    }
    this.instance.socket.send(JSON.stringify({
      type: 'dispatch_all',
      actions: actions,
    }));
  }
}
