// Doubly Linked List Node for O(1) removals and insertions.

class Node {
  constructor(key, value, ttlMs = null) {
    this.key = key;
    this.value = value;
    this.expiry = ttlMs ? Date.now() + ttlMs : null;
    this.prev = null;
    this.next = null;
  }

  isExpired() {
    return this.expiry !== null && Date.now() > this.expiry;
  }
}

class LRUCache {
  constructor(capacity) {
    if (typeof capacity !== "number" || capacity <= 0) {
      throw new Error("Capacity must be a positive integer.");
    }
    this.capacity = capacity;
    this.map = new Map();

    // Dummy Head & Tail nodes to simplify boundary operations

    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // Remove node from doubly linked list

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // Insert node right after dummy head (mark as Most Recently Used)

  _add(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) {
      return -1;
    }

    const node = this.map.get(key);

    // Check for TTL Expiration

    if (node.isExpired()) {
      this._remove(node);
      this.map.delete(key);
      return -1;
    }

    // Move accessed node to head (Most Recently Used)

    this._remove(node);
    this._add(node);

    return node.value;
  }

  put(key, value, ttlMs = null) {
    if (this.map.has(key)) {
      const existingNode = this.map.get(key);
      this._remove(existingNode);
    }

    const newNode = new Node(key, value, ttlMs);
    this._add(newNode);
    this.map.set(key, newNode);

    // Evict Least Recently Used (LRU) node if capacity exceeded

    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
      console.log(
        `[EVICTION] Capacity exceeded (${this.capacity}). Evicted key: "${lru.key}"`,
      );
    }
  }
}

// TEST EXECUTION & DEMO SCRIPT

async function runTests() {
  console.log("   TASK 2 — LRU CACHE DEMONSTRATION");

  const cache = new LRUCache(2);

  console.log("cache.put('A', 10)");
  cache.put("A", 10);

  console.log("cache.put('B', 20)");
  cache.put("B", 20);

  console.log(`cache.get('A') -> Output: ${cache.get("A")} (Expected: 10)`);

  console.log("cache.put('C', 30) -- triggers eviction of 'B'");
  cache.put("C", 30);

  console.log(`cache.get('B') -> Output: ${cache.get("B")} (Expected: -1)`);
  console.log(`cache.get('C') -> Output: ${cache.get("C")} (Expected: 30)`);
  console.log(`cache.get('A') -> Output: ${cache.get("A")} (Expected: 10)`);

  const ttlCache = new LRUCache(3);
  console.log("ttlCache.put('X', 999, 1000) -- Expire in 1000ms");
  ttlCache.put("X", 999, 1000);

  console.log(
    `ttlCache.get('X') [Immediate] -> Output: ${ttlCache.get("X")} (Expected: 999)`,
  );

  console.log("Waiting 1.2 seconds for key 'X' to expire...");
  await new Promise((resolve) => setTimeout(resolve, 1200));

  console.log(
    `ttlCache.get('X') [After 1.2s] -> Output: ${ttlCache.get("X")} (Expected: -1)`,
  );
}

runTests();
