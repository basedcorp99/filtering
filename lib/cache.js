import { LRUCache } from 'lru-cache'

const cache = new LRUCache({
  max: 500, // Maximum number of items in cache
  maxAge: 1000 * 60 * 60, // 1 hour
});

export function getCache(key) {
  return cache.get(key);
}

export function setCache(key, value) {
  cache.set(key, value);
}

export function invalidateCache(key) {
    cache.delete(key);
}

export function emptyCache() {
    cache.clear();
}