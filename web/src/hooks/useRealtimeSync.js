// src/hooks/useRealtimeSync.js
// React hook for real-time cross-tab synchronization

import { useEffect, useCallback, useRef } from 'react';
import realtimeSync, { SyncEventTypes } from '../utils/realtimeSync';

/**
 * Hook to subscribe to real-time sync events
 * @param {string|string[]} eventTypes - Event type(s) to subscribe to
 * @param {function} onEvent - Callback when event is received
 * @param {any[]} deps - Dependencies array for the callback
 */
export function useRealtimeSync(eventTypes, onEvent, deps = []) {
  const callbackRef = useRef(onEvent);
  
  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const types = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
    
    const handleEvent = (payload, timestamp) => {
      callbackRef.current(payload, timestamp);
    };

    // Subscribe to all specified event types
    const unsubscribers = types.map(type => 
      realtimeSync.subscribe(type, handleEvent)
    );

    // Cleanup on unmount
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [eventTypes, ...deps]);
}

/**
 * Hook to get a broadcast function for a specific event type
 * @param {string} eventType - Event type to broadcast
 * @returns {function} Broadcast function
 */
export function useBroadcast(eventType) {
  return useCallback((payload) => {
    realtimeSync.broadcast(eventType, payload);
  }, [eventType]);
}

/**
 * Hook that provides both subscribe and broadcast functionality for listings
 * Automatically refreshes data when listing events are received
 * @param {function} refreshFn - Function to call to refresh data
 */
export function useListingSync(refreshFn) {
  const refreshRef = useRef(refreshFn);
  
  useEffect(() => {
    refreshRef.current = refreshFn;
  }, [refreshFn]);

  useEffect(() => {
    const listingEvents = [
      SyncEventTypes.LISTING_CREATED,
      SyncEventTypes.LISTING_UPDATED,
      SyncEventTypes.LISTING_DELETED,
      SyncEventTypes.LISTING_STATUS_CHANGED,
      SyncEventTypes.REFRESH_ALL,
    ];

    const handleListingEvent = () => {
      console.log('[useListingSync] Refreshing listings data...');
      refreshRef.current?.();
    };

    const unsubscribers = listingEvents.map(type =>
      realtimeSync.subscribe(type, handleListingEvent)
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  // Return broadcast functions for listings
  return {
    broadcastCreate: useCallback((listing) => {
      realtimeSync.broadcast(SyncEventTypes.LISTING_CREATED, listing);
    }, []),
    broadcastUpdate: useCallback((listing) => {
      realtimeSync.broadcast(SyncEventTypes.LISTING_UPDATED, listing);
    }, []),
    broadcastDelete: useCallback((listingId) => {
      realtimeSync.broadcast(SyncEventTypes.LISTING_DELETED, { id: listingId });
    }, []),
    broadcastStatusChange: useCallback((listingId, status) => {
      realtimeSync.broadcast(SyncEventTypes.LISTING_STATUS_CHANGED, { id: listingId, status });
    }, []),
  };
}

/**
 * Hook for user-related sync events
 * @param {function} refreshFn - Function to call to refresh user data
 */
export function useUserSync(refreshFn) {
  const refreshRef = useRef(refreshFn);
  
  useEffect(() => {
    refreshRef.current = refreshFn;
  }, [refreshFn]);

  useEffect(() => {
    const userEvents = [
      SyncEventTypes.USER_UPDATED,
      SyncEventTypes.USER_DELETED,
      SyncEventTypes.USER_ROLE_CHANGED,
      SyncEventTypes.REFRESH_ALL,
    ];

    const handleUserEvent = () => {
      console.log('[useUserSync] Refreshing user data...');
      refreshRef.current?.();
    };

    const unsubscribers = userEvents.map(type =>
      realtimeSync.subscribe(type, handleUserEvent)
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  return {
    broadcastUpdate: useCallback((user) => {
      realtimeSync.broadcast(SyncEventTypes.USER_UPDATED, user);
    }, []),
    broadcastDelete: useCallback((userId) => {
      realtimeSync.broadcast(SyncEventTypes.USER_DELETED, { id: userId });
    }, []),
    broadcastRoleChange: useCallback((userId, role) => {
      realtimeSync.broadcast(SyncEventTypes.USER_ROLE_CHANGED, { id: userId, role });
    }, []),
  };
}

/**
 * Hook for inquiry-related sync events
 * @param {function} refreshFn - Function to call to refresh inquiry data
 */
export function useInquirySync(refreshFn) {
  const refreshRef = useRef(refreshFn);
  
  useEffect(() => {
    refreshRef.current = refreshFn;
  }, [refreshFn]);

  useEffect(() => {
    const inquiryEvents = [
      SyncEventTypes.INQUIRY_CREATED,
      SyncEventTypes.INQUIRY_REPLIED,
      SyncEventTypes.INQUIRY_STATUS_CHANGED,
      SyncEventTypes.REFRESH_ALL,
    ];

    const handleInquiryEvent = () => {
      console.log('[useInquirySync] Refreshing inquiry data...');
      refreshRef.current?.();
    };

    const unsubscribers = inquiryEvents.map(type =>
      realtimeSync.subscribe(type, handleInquiryEvent)
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  return {
    broadcastCreate: useCallback((inquiry) => {
      realtimeSync.broadcast(SyncEventTypes.INQUIRY_CREATED, inquiry);
    }, []),
    broadcastReply: useCallback((inquiryId, reply) => {
      realtimeSync.broadcast(SyncEventTypes.INQUIRY_REPLIED, { id: inquiryId, reply });
    }, []),
    broadcastStatusChange: useCallback((inquiryId, status) => {
      realtimeSync.broadcast(SyncEventTypes.INQUIRY_STATUS_CHANGED, { id: inquiryId, status });
    }, []),
  };
}

/**
 * Hook for favorite-related sync events
 * @param {function} refreshFn - Function to call to refresh favorites data
 */
export function useFavoriteSync(refreshFn) {
  const refreshRef = useRef(refreshFn);
  
  useEffect(() => {
    refreshRef.current = refreshFn;
  }, [refreshFn]);

  useEffect(() => {
    const favoriteEvents = [
      SyncEventTypes.FAVORITE_ADDED,
      SyncEventTypes.FAVORITE_REMOVED,
      SyncEventTypes.REFRESH_ALL,
    ];

    const handleFavoriteEvent = () => {
      console.log('[useFavoriteSync] Refreshing favorites data...');
      refreshRef.current?.();
    };

    const unsubscribers = favoriteEvents.map(type =>
      realtimeSync.subscribe(type, handleFavoriteEvent)
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  return {
    broadcastAdd: useCallback((listingId) => {
      realtimeSync.broadcast(SyncEventTypes.FAVORITE_ADDED, { listingId });
    }, []),
    broadcastRemove: useCallback((listingId) => {
      realtimeSync.broadcast(SyncEventTypes.FAVORITE_REMOVED, { listingId });
    }, []),
  };
}

/**
 * Hook for rating-related sync events
 * @param {function} refreshFn - Function to call to refresh rating data
 */
export function useRatingSync(refreshFn) {
  const refreshRef = useRef(refreshFn);
  
  useEffect(() => {
    refreshRef.current = refreshFn;
  }, [refreshFn]);

  useEffect(() => {
    const ratingEvents = [
      SyncEventTypes.RATING_ADDED,
      SyncEventTypes.RATING_UPDATED,
      SyncEventTypes.REFRESH_ALL,
    ];

    const handleRatingEvent = () => {
      console.log('[useRatingSync] Refreshing rating data...');
      refreshRef.current?.();
    };

    const unsubscribers = ratingEvents.map(type =>
      realtimeSync.subscribe(type, handleRatingEvent)
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  return {
    broadcastAdd: useCallback((rating) => {
      realtimeSync.broadcast(SyncEventTypes.RATING_ADDED, rating);
    }, []),
    broadcastUpdate: useCallback((rating) => {
      realtimeSync.broadcast(SyncEventTypes.RATING_UPDATED, rating);
    }, []),
  };
}

// Re-export SyncEventTypes for convenience
export { SyncEventTypes };
