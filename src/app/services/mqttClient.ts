import mqtt from 'mqtt/dist/mqtt';

let client: any = null;

export function connectToBroker(brokerUrl: string, options: any, handlers: {
  onDevice?: (device: any) => void;
  onEvent?: (event: any) => void;
  onMessage?: (topic: string, message: any) => void;
  onConnect?: () => void;
  onError?: (err: Error) => void;
  onClose?: () => void;
  onOffline?: () => void;
  onReconnect?: () => void;
}) {
  if (!brokerUrl) throw new Error('brokerUrl required');
  if (client) {
    try {
      client.end(true);
    } catch {
      // ignore stale client shutdown errors
    }
    client = null;
  }
  client = mqtt.connect(brokerUrl, options);

  client.on('connect', () => {
    handlers.onConnect && handlers.onConnect();
    // subscribe to discovery and events
    client?.subscribe('drs/discovery', { qos: 0 });
    client?.subscribe('drs/events/#', { qos: 0 });
  });

  client.on('reconnect', () => {
    handlers.onReconnect && handlers.onReconnect();
  });

  client.on('offline', () => {
    handlers.onOffline && handlers.onOffline();
  });

  client.on('close', () => {
    handlers.onClose && handlers.onClose();
  });

  client.on('message', (topic, payload) => {
    try {
      const msg = JSON.parse(payload.toString());
      handlers.onMessage && handlers.onMessage(topic, msg);
      if (topic === 'drs/discovery') {
        handlers.onDevice && handlers.onDevice(msg);
      } else if (topic.startsWith('drs/events')) {
        handlers.onEvent && handlers.onEvent(msg);
      }
    } catch (err) {
      handlers.onMessage && handlers.onMessage(topic, payload.toString());
      // ignore non-json or malformed
    }
  });

  client.on('error', (err) => {
    handlers.onError && handlers.onError(err as Error);
  });

  return client;
}

export function disconnectBroker() {
  if (client) {
    try {
      client.end(true);
    } catch (e) {
      // ignore
    }
    client = null;
  }
}
