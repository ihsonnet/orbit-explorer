// IndexedDB storage for satellite TLE data
// Much better than localStorage for large datasets (14k+ satellites)

const DB_NAME = 'SatelliteDB';
const DB_VERSION = 1;
const STORE_NAME = 'tleData';
const META_STORE = 'metadata';

export interface TLEEntry {
  noradId: string;
  name: string;
  line1: string;
  line2: string;
  fetchedAt: number;
}

interface DBMetadata {
  key: string;
  value: number | string;
}

let dbPromise: Promise<IDBDatabase> | null = null;

// Initialize the database
function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Store for TLE entries - keyed by noradId
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'noradId' });
      }
      
      // Store for metadata (last update time, etc.)
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' });
      }
    };
  });
  
  return dbPromise;
}

// Get last update timestamp
export async function getLastUpdate(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(META_STORE, 'readonly');
    const store = tx.objectStore(META_STORE);
    const request = store.get('lastUpdate');
    
    request.onsuccess = () => {
      resolve((request.result as DBMetadata)?.value as number || 0);
    };
    request.onerror = () => resolve(0);
  });
}

// Set last update timestamp
export async function setLastUpdate(timestamp: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readwrite');
    const store = tx.objectStore(META_STORE);
    const request = store.put({ key: 'lastUpdate', value: timestamp });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Store multiple TLE entries efficiently
export async function storeTLEEntries(entries: TLEEntry[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // Batch insert all entries
    for (const entry of entries) {
      store.put(entry);
    }
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Get all TLE entries
export async function getAllTLEEntries(): Promise<TLEEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Get TLE entry count
export async function getTLECount(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.count();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Get entries in batches (for progressive loading)
export async function getTLEEntriesBatch(
  offset: number, 
  limit: number
): Promise<TLEEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const entries: TLEEntry[] = [];
    let skipped = 0;
    
    const request = store.openCursor();
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      
      if (cursor) {
        if (skipped < offset) {
          skipped++;
          cursor.continue();
        } else if (entries.length < limit) {
          entries.push(cursor.value);
          cursor.continue();
        } else {
          resolve(entries);
        }
      } else {
        resolve(entries);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Clear all data
export async function clearTLEData(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME, META_STORE], 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.objectStore(META_STORE).clear();
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Check if we need to migrate from localStorage
export async function migrateFromLocalStorage(): Promise<boolean> {
  const oldCache = localStorage.getItem('space_tle_cache');
  if (!oldCache) return false;
  
  try {
    const data = JSON.parse(oldCache);
    if (data.entries && Object.keys(data.entries).length > 0) {
      const entries = Object.values(data.entries) as TLEEntry[];
      await storeTLEEntries(entries);
      await setLastUpdate(data.lastFullUpdate || 0);
      
      // Clear old localStorage cache
      localStorage.removeItem('space_tle_cache');
      console.log(`Migrated ${entries.length} satellites from localStorage to IndexedDB`);
      return true;
    }
  } catch (error) {
    console.warn('Failed to migrate from localStorage:', error);
  }
  
  return false;
}
