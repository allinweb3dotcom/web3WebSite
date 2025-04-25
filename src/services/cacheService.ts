class CacheService {
  private static instance: CacheService;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  set(key: string, data: any): void {
    try {
      // Ensure data is serializable by converting to and from JSON
      const serializedData = JSON.parse(JSON.stringify(data));
      this.cache.set(key, {
        data: serializedData,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.warn(`Failed to cache data for key ${key}:`, error);
    }
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

export default CacheService.getInstance();