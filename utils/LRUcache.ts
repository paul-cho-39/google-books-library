import { LRUCache } from 'lru-cache';

export interface StatusLRUType {
   get?: 'stale' | 'hit' | 'miss';
   start?: number;
}

// let's store this somewhere else
const options = {
   max: 500, // google books category.length * (fiction + nonfiction * (currentYear - 2008) * 12) + buffer
   ttl: 60 * 60 * 1000 * 12,
   allowStale: true,
};

// set this with google / nyt data;
const lruCache = new LRUCache<string, Record<string, unknown>>(options);
export default lruCache;
