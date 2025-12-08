// src/utils/realtimeSync.js
// Real-time synchronization utility for cross-tab data updates
// Uses BroadcastChannel API for same-origin tab communication

const CHANNEL_NAME = 'boardinghouse-sync';

// Event types for different data changes
export const SyncEventTypes = {
  // Listing events
  LISTING_CREATED: 'listing:created',
  LISTING_UPDATED: 'listing:updated',
  LISTING_DELETED: 'listing:deleted',
  LISTING_STATUS_CHANGED: 'listing:status_changed',
  
  // User events
  USER_UPDATED: 'user:updated',
  USER_DELETED: 'user:deleted',
  USER_ROLE_CHANGED: 'user:role_changed',
  
  // Inquiry events
  INQUIRY_CREATED: 'inquiry:created',
  INQUIRY_REPLIED: 'inquiry:replied',
  INQUIRY_STATUS_CHANGED: 'inquiry:status_changed',
  
  // Favorite events
  FAVORITE_ADDED: 'favorite:added',
  FAVORITE_REMOVED: 'favorite:removed',
  
  // Rating events
  RATING_ADDED: 'rating:added',
  RATING_UPDATED: 'rating:updated',
  
  // General refresh event
  REFRESH_ALL: 'refresh:all',
};

class RealtimeSyncManager {
  constructor() {
    this.channel = null;
    this.listeners = new Map();
    this.isSupported = typeof BroadcastChannel !== 'undefined';
    this.initialized = false;
  }

  /**
   * Initialize the BroadcastChannel
   */
  init() {
    if (this.initialized) return;
    
    if (!this.isSupported) {
      console.warn('BroadcastChannel not supported in this browser. Cross-tab sync will not work.');
      return;
    }

    try {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (event) => this.handleMessage(event);
      this.initialized = true;
      console.log('RealtimeSync initialized');
    } catch (error) {
      console.error('Failed to initialize BroadcastChannel:', error);
    }
  }

  /**
   * Handle incoming messages from other tabs
   */
  handleMessage(event) {
    const { type, payload, timestamp } = event.data;
    
    console.log(`[RealtimeSync] Received event: ${type}`, payload);
    
    // Notify all listeners for this event type
    const typeListeners = this.listeners.get(type) || [];
    typeListeners.forEach(callback => {
      try {
        callback(payload, timestamp);
      } catch (error) {
        console.error(`Error in sync listener for ${type}:`, error);
      }
    });
    
    // Also notify wildcard listeners
    const wildcardListeners = this.listeners.get('*') || [];
    wildcardListeners.forEach(callback => {
      try {
        callback(type, payload, timestamp);
      } catch (error) {
        console.error('Error in wildcard sync listener:', error);
      }
    });
  }

  /**
   * Broadcast an event to all other tabs
   * @param {string} type - Event type from SyncEventTypes
   * @param {any} payload - Data to send
   */
  broadcast(type, payload = {}) {
    if (!this.isSupported || !this.channel) {
      console.warn('RealtimeSync not available, skipping broadcast');
      return;
    }

    const message = {
      type,
      payload,
      timestamp: Date.now(),
    };

    try {
      this.channel.postMessage(message);
      console.log(`[RealtimeSync] Broadcasted event: ${type}`, payload);
    } catch (error) {
      console.error('Failed to broadcast message:', error);
    }
  }

  /**
   * Subscribe to a specific event type
   * @param {string} type - Event type to listen for (or '*' for all events)
   * @param {function} callback - Function to call when event is received
   * @returns {function} Unsubscribe function
   */
  subscribe(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    
    this.listeners.get(type).push(callback);
    
    // Return unsubscribe function
    return () => {
      const typeListeners = this.listeners.get(type);
      if (typeListeners) {
        const index = typeListeners.indexOf(callback);
        if (index > -1) {
          typeListeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Subscribe to multiple event types
   * @param {string[]} types - Array of event types
   * @param {function} callback - Function to call when any event is received
   * @returns {function} Unsubscribe function
   */
  subscribeMultiple(types, callback) {
    const unsubscribers = types.map(type => this.subscribe(type, callback));
    
    // Return combined unsubscribe function
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  /**
   * Cleanup and close the channel
   */
  destroy() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.listeners.clear();
    this.initialized = false;
  }
}

// Create singleton instance
const realtimeSync = new RealtimeSyncManager();

// Initialize on module load
if (typeof window !== 'undefined') {
  realtimeSync.init();
}

export default realtimeSync;
