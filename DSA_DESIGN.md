# MEDIFLOW: Data Structures & Algorithms (DSA) Specifications
## Core Custom Algorithmic Implementations

---

### 1. Trie (Prefix Tree) — Medicine Autocomplete Engine

#### A. Problem Statement
Users searching for medicines in an e-pharmacy need instantaneous, real-time suggestions as they type (e.g. typing `"para"` returns `"Paracetamol 500mg"`, `"Paracetamol 650mg"`, `"Paracetamol Syrup"`). Database SQL `LIKE %para%` queries cause full table scans and poor performance. A Trie structure enables instantaneous $O(K)$ prefix matches where $K$ is query length.

#### B. Structure & Class Design
```
       (root)
      /   \
     p     a
    /
   a
  /
 r
  \
   a  (isEndOfWord = true, medicineRef = Paracetamol 500mg)
```

```java
public class TrieNode {
    private final Map<Character, TrieNode> children = new HashMap<>();
    private boolean isEndOfWord;
    private final List<MedicineSummaryDTO> medicineDataList = new ArrayList<>();
    
    // Getters and helper methods...
}

public class MedicineTrie {
    private final TrieNode root = new TrieNode();

    public void insert(String name, MedicineSummaryDTO dto) { ... }
    public List<MedicineSummaryDTO> searchPrefix(String prefix) { ... }
}
```

#### C. Complexity Analysis
- **Insertion**: $O(L)$ where $L$ is medicine name length.
- **Prefix Search**: $O(K + M)$ where $K$ is prefix length and $M$ is total matching nodes collected.

---

### 2. Min-Heap Priority Queue — Critical Low-Stock Inventory

#### A. Problem Statement
The Pharmacy Admin Dashboard needs to highlight medicines with critical low stock at the top of the inventory view. Continuously running SQL `ORDER BY stock_quantity ASC` on large inventory tables is expensive. A custom Min-Heap maintains the minimum stock item at the root.

#### B. Comparator & Implementation
```java
public class InventoryMinHeap {
    private final PriorityQueue<InventoryItemDTO> minHeap;

    public InventoryMinHeap() {
        // Min-heap ordering by stockQuantity ascending
        this.minHeap = new PriorityQueue<>(
            Comparator.comparingInt(InventoryItemDTO::getStockQuantity)
        );
    }

    public void insertBatch(InventoryItemDTO item) {
        minHeap.offer(item);
    }

    public List<InventoryItemDTO> getCriticalStock(int count) {
        List<InventoryItemDTO> result = new ArrayList<>();
        PriorityQueue<InventoryItemDTO> copy = new PriorityQueue<>(minHeap);
        while (!copy.isEmpty() && result.size() < count) {
            result.add(copy.poll());
        }
        return result;
    }
}
```

#### C. Complexity Analysis
- **Insert / Update Batch**: $O(\log N)$
- **Fetch Top K Critical Items**: $O(K \log N)$
- **Peek Root (Lowest Stock Item)**: $O(1)$

---

### 3. Expiry Min-Heap — Earliest Expiry Priority Queue

#### A. Problem Statement
Pharmaceutical inventory must strictly follow FEFO (First-Expired-First-Out) guidelines to prevent dispensing expired drugs and avoid stock wastage.

#### B. Implementation
```java
public class ExpiryMinHeap {
    private final PriorityQueue<InventoryBatchDTO> expiryHeap;

    public ExpiryMinHeap() {
        // Min-heap ordering by expiryDate ascending (earliest date first)
        this.expiryHeap = new PriorityQueue<>(
            Comparator.comparing(InventoryBatchDTO::getExpiryDate)
        );
    }

    public List<InventoryBatchDTO> getExpiringSoon(int daysThreshold) {
        LocalDate limitDate = LocalDate.now().plusDays(daysThreshold);
        List<InventoryBatchDTO> expiringList = new ArrayList<>();
        
        for (InventoryBatchDTO batch : expiryHeap) {
            if (!batch.getExpiryDate().isAfter(limitDate)) {
                expiringList.add(batch);
            }
        }
        expiringList.sort(Comparator.comparing(InventoryBatchDTO::getExpiryDate));
        return expiringList;
    }
}
```

---

### 4. HashMap Fast Lookup Cache

#### A. Problem Statement
High-concurrency cart checkout calculations require frequent checks for medicine prices and stock availability. A HashMap cache structure stores pre-indexed key-value pairs (`medicineId` -> `MedicineCacheObj`), allowing $O(1)$ instantaneous access during cart total and tax calculations.

---

### 5. Graph Architecture & Dijkstra's Algorithm — Delivery Route Optimization

#### A. Problem Statement
Pharmacy orders must be delivered from a central fulfillment hub to various customer residential nodes via the shortest road distance in kilometers.

#### B. Graph Representation & Algorithm
```java
public class GraphNode {
    private final int id;
    private final String name;
    // Node representation (Pharmacy Hubs, Sector Junctions, Customer Addresses)
}

public class GraphEdge {
    private final int targetNodeId;
    private final double distanceKm;
    private final int estimatedTimeMins;
}

public class DeliveryGraph {
    private final Map<Integer, List<GraphEdge>> adjList = new HashMap<>();

    public void addEdge(int source, int target, double distance, int time) {
        adjList.computeIfAbsent(source, k -> new ArrayList<>())
               .add(new GraphEdge(target, distance, time));
        adjList.computeIfAbsent(target, k -> new ArrayList<>())
               .add(new GraphEdge(source, distance, time)); // Undirected road network
    }
}

public class DijkstraShortestPath {
    public static RouteResult findShortestRoute(DeliveryGraph graph, int startNode, int targetNode) {
        Map<Integer, Double> dist = new HashMap<>();
        Map<Integer, Integer> prev = new HashMap<>();
        PriorityQueue<NodeDistancePair> pq = new PriorityQueue<>(Comparator.comparingDouble(NodeDistancePair::getDistance));

        dist.put(startNode, 0.0);
        pq.offer(new NodeDistancePair(startNode, 0.0));

        while (!pq.isEmpty()) {
            NodeDistancePair curr = pq.poll();
            int u = curr.getNodeId();

            if (u == targetNode) break;

            if (curr.getDistance() > dist.getOrDefault(u, Double.MAX_VALUE)) continue;

            for (GraphEdge edge : graph.getNeighbors(u)) {
                int v = edge.getTargetNodeId();
                double newDist = dist.get(u) + edge.getDistanceKm();

                if (newDist < dist.getOrDefault(v, Double.MAX_VALUE)) {
                    dist.put(v, newDist);
                    prev.put(v, u);
                    pq.offer(new NodeDistancePair(v, newDist));
                }
            }
        }

        // Reconstruct path array from prev map...
        return reconstructPath(startNode, targetNode, dist, prev);
    }
}
```

#### C. Complexity Analysis
- **Time Complexity**: $O((V + E) \log V)$ using Min-Heap Priority Queue.
- **Space Complexity**: $O(V + E)$ for adjacency list storage.
