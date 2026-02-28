
import mqtt from 'mqtt';

// Switch to EMQX Public Broker (wss port 8084) for better stability and global access
const BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
const APP_PREFIX = 'bingo_pro_v8_realtime';

export interface BingoRoomState {
  drawn: number[];
  queue: number[];
  total: number;
  ts: number;
}

type StateListener = (state: BingoRoomState) => void;
type ConnectionListener = (isConnected: boolean) => void;

class SyncService {
  private client: mqtt.MqttClient | null = null;
  private roomToken: string | null = null;
  private listeners: Set<StateListener> = new Set();
  private connectionListeners: Set<ConnectionListener> = new Set();
  
  // Cache local state
  private currentState: BingoRoomState = {
    drawn: [],
    queue: [],
    total: 75,
    ts: 0
  };

  private isConnected: boolean = false;

  constructor() {
    // Empty constructor
  }

  // --- Connection Management ---

  joinRoom(roomName: string) {
    const safeName = roomName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const newToken = `${APP_PREFIX}/${safeName}`;
    
    // If already connected to this room, don't reconnect to avoid state reset
    if (this.roomToken === newToken && this.client && this.isConnected) {
      console.log(`Already connected to room: ${this.roomToken}`);
      return;
    }

    // If connected to a different room, clean up first
    if (this.client) {
      this.client.end();
      this.client = null;
    }

    this.roomToken = newToken;
    
    // Reset connection state
    this.isConnected = false;
    this.notifyConnectionListeners(false);

    console.log(`Connecting to MQTT Broker: ${BROKER_URL} for room: ${this.roomToken}`);

    this.client = mqtt.connect(BROKER_URL, {
      keepalive: 60,
      clientId: `bingo_client_${Math.random().toString(16).slice(2, 10)}`,
      clean: true,
      connectTimeout: 5000,
      reconnectPeriod: 2000,
    });

    this.client.on('connect', () => {
      console.log('MQTT Connected');
      this.isConnected = true;
      this.notifyConnectionListeners(true);
      
      if (this.roomToken && this.client) {
        this.client.subscribe(this.roomToken, { qos: 1 }, (err) => {
          if (err) {
            console.error('Subscription error:', err);
          } else {
            console.log(`Subscribed to ${this.roomToken}`);
          }
        });
      }
    });

    this.client.on('message', (topic, message) => {
      if (topic === this.roomToken) {
        try {
          const payload = JSON.parse(message.toString());
          // Ensure queue is always an array
          if (!payload.queue) payload.queue = [];
          this.updateLocalState(payload);
        } catch (e) {
          console.error('Failed to parse incoming message', e);
        }
      }
    });

    this.client.on('offline', () => {
      console.log('MQTT Offline');
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    });

    this.client.on('error', (err) => {
      console.error('MQTT Error:', err);
      // isConnected will be handled by offline/reconnect events usually.
    });
  }

  leaveRoom() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
    this.roomToken = null;
    this.isConnected = false;
    this.notifyConnectionListeners(false);
    this.currentState = { drawn: [], queue: [], total: 75, ts: 0 };
  }

  // --- State Management ---

  subscribe(listener: StateListener) {
    this.listeners.add(listener);
    // Immediately fire with current state
    listener(this.currentState);
    return () => this.listeners.delete(listener);
  }

  subscribeConnection(listener: ConnectionListener) {
    this.connectionListeners.add(listener);
    // Immediately fire with current status
    listener(this.isConnected);
    return () => this.connectionListeners.delete(listener);
  }

  private updateLocalState(newState: BingoRoomState) {
    if (!newState || !Array.isArray(newState.drawn)) return;
    
    // Update if newer timestamp or if we are initializing
    if (newState.ts >= this.currentState.ts) {
        this.currentState = newState;
        this.notifyListeners();
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentState));
  }

  private notifyConnectionListeners(status: boolean) {
    this.connectionListeners.forEach(listener => listener(status));
  }

  // --- Actions ---

  async publishState(state: BingoRoomState) {
    if (!this.client || !this.roomToken) return;

    // Fix Clock Skew: Always generate a timestamp greater than the last known state
    // This ensures that even if the admin device's clock is behind, the message is accepted.
    const nextTs = Math.max(Date.now(), this.currentState.ts + 1);
    const payload = { ...state, ts: nextTs };
    
    // Optimistic update
    this.updateLocalState(payload);

    try {
      this.client.publish(this.roomToken, JSON.stringify(payload), { qos: 1, retain: true });
    } catch (e) {
      console.error("Publish error", e);
    }
  }

  async updateDrawn(list: number[], total: number) {
    const newState = { ...this.currentState, drawn: list, total };
    await this.publishState(newState);
  }

  async updateQueue(queue: number[]) {
    // Ensure we are working with the latest state structure
    const newState = { ...this.currentState, queue };
    await this.publishState(newState);
  }

  async resetAll(total: number) {
    const newState = { drawn: [], queue: [], total, ts: Date.now() };
    await this.publishState(newState);
  }
  
  getCurrentState() {
      return this.currentState;
  }
}

export const syncService = new SyncService();
