// API Cache with rate limiting
interface CacheEntry {
  data: any;
  timestamp: number;
  expiresIn: number;
}

class ApiCache {
  private cache: Map<string, CacheEntry> = new Map();
  private requestQueue: number[] = [];
  private readonly RATE_LIMIT = 9; // Max requests per minute (football-data.org allows 10, keeping 1 buffer)
  private readonly RATE_WINDOW = 60000; // 1 minute in ms

  // Check if we can make a request without hitting rate limit
  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove requests older than 1 minute
    this.requestQueue = this.requestQueue.filter(time => now - time < this.RATE_WINDOW);
    return this.requestQueue.length < this.RATE_LIMIT;
  }

  // Record a request
  recordRequest(): void {
    this.requestQueue.push(Date.now());
  }

  // Get cached data if valid
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    console.log(`💾 Cache HIT for ${key}`);
    return entry.data;
  }

  // Set cached data
  set(key: string, data: any, expiresIn: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
    console.log(`💾 Cache SET for ${key} (expires in ${expiresIn / 1000}s)`);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.requestQueue = [];
    console.log('💾 Cache CLEARED');
  }

  // Get time until next available request
  getTimeUntilNextRequest(): number {
    if (this.canMakeRequest()) return 0;

    const now = Date.now();
    const oldestRequest = Math.min(...this.requestQueue);
    const timeUntilExpired = this.RATE_WINDOW - (now - oldestRequest);
    return Math.max(0, timeUntilExpired);
  }

  // Get current request count
  getRequestCount(): number {
    const now = Date.now();
    this.requestQueue = this.requestQueue.filter(time => now - time < this.RATE_WINDOW);
    return this.requestQueue.length;
  }

  // Get status info
  getStatus(): { requestsInWindow: number; canRequest: boolean; waitTime: number } {
    return {
      requestsInWindow: this.getRequestCount(),
      canRequest: this.canMakeRequest(),
      waitTime: this.getTimeUntilNextRequest()
    };
  }
}

export const apiCache = new ApiCache();
