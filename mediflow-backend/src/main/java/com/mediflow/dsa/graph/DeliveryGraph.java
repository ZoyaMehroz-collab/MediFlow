package com.mediflow.dsa.graph;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class DeliveryGraph {

    private final Map<Integer, GraphNode> nodes = new HashMap<>();
    private final Map<Integer, List<GraphEdge>> adjList = new HashMap<>();

    public DeliveryGraph() {
        // Initialize default pharmacy fulfillment network nodes and edges
        initDefaultFulfillmentNetwork();
    }

    public synchronized void addNode(int id, String name) {
        nodes.put(id, new GraphNode(id, name));
        adjList.putIfAbsent(id, new ArrayList<>());
    }

    public synchronized void addEdge(int sourceId, int targetId, double distanceKm, int timeMins) {
        adjList.computeIfAbsent(sourceId, k -> new ArrayList<>())
                .add(new GraphEdge(targetId, distanceKm, timeMins));
        adjList.computeIfAbsent(targetId, k -> new ArrayList<>())
                .add(new GraphEdge(sourceId, distanceKm, timeMins)); // Undirected road network
    }

    public GraphNode getNode(int id) {
        return nodes.get(id);
    }

    public List<GraphEdge> getNeighbors(int nodeId) {
        return adjList.getOrDefault(nodeId, Collections.emptyList());
    }

    public Set<Integer> getAllNodeIds() {
        return nodes.keySet();
    }

    private void initDefaultFulfillmentNetwork() {
        // Node 1: Central Pharmacy Hub
        addNode(1, "Central Pharmacy Hub");
        addNode(2, "North Distribution Junction");
        addNode(3, "East Medical Depot");
        addNode(4, "South Express Terminal");
        addNode(5, "West Suburb Hub");
        addNode(6, "Residential Sector A");
        addNode(7, "Residential Sector B");
        addNode(8, "Residential Sector C");
        addNode(9, "Metropolitan Hospital Area");
        addNode(10, "Suburban Complex D");

        // Edges with distances in KM and estimated transit times in minutes
        addEdge(1, 2, 3.5, 8);
        addEdge(1, 3, 5.0, 12);
        addEdge(1, 4, 4.2, 10);
        addEdge(1, 5, 6.1, 14);

        addEdge(2, 6, 2.5, 6);
        addEdge(2, 7, 4.0, 9);
        addEdge(3, 7, 3.2, 7);
        addEdge(3, 8, 2.8, 6);

        addEdge(4, 8, 5.5, 11);
        addEdge(4, 9, 3.0, 7);
        addEdge(5, 9, 4.5, 10);
        addEdge(5, 10, 2.2, 5);

        addEdge(6, 7, 1.8, 4);
        addEdge(7, 8, 2.1, 5);
        addEdge(8, 9, 3.7, 8);
        addEdge(9, 10, 2.9, 6);
    }
}
