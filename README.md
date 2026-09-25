# Task 2 — LRU Cache with TTL Support

## Overview
This project implements a custom **Least Recently Used (LRU) Cache** data structure supporting `get(key)` and `put(key, value)` in $O(1)$ average time complexity, with optional **TTL (Time-To-Live)** expiration functionality.

---

## Data Structures Used & Why
1. **Hash Map (`Map` in JS)**:
   - Provides $O(1)$ key lookup to find nodes instantly.
2. **Doubly Linked List (`Node` class with `prev` and `next` pointers)**:
   - Allows $O(1)$ node removal and insertion at head/tail without shifting array indices.

By combining both, we achieve $O(1)$ access, updates, and removals.

---

## How LRU Ordering is Maintained
- **Head Node (Most Recently Used)**: Newly added or accessed nodes are moved right after the head node.
- **Tail Node (Least Recently Used)**: The node right before the tail node is the oldest/least recently used.
- **Eviction**: When capacity is exceeded, `tail.prev` is deleted from both the Doubly Linked List and Hash Map in $O(1)$ time.

---

## Complexity Analysis
- **Time Complexity**:
  - `get(key)`: $O(1)$ average time.
  - `put(key, value)`: $O(1)$ average time.
- **Space Complexity**: $O(N)$ where $N$ is the capacity of the cache.

---

## Bonus: TTL / Expiration Strategy
- Each node stores an `expiry` timestamp (`Date.now() + ttlMs`).
- On `get(key)`, if the current timestamp exceeds `expiry`, the node is lazily deleted and `-1` is returned.

---

## How to Run
1. Ensure Node.js is installed on your system.
2. Clone the repository and navigate to the project directory.
3. Run the script:
   ```bash
   node lruCache.js
