package com.mediflow.dsa.graph;

import java.util.*;

public class DijkstraShortestPath {

    public static class RouteResult {
        private final List<GraphNode> pathNodes;
        private final double totalDistanceKm;
        private final int totalTimeMins;
        private final String routeSummary;

        public RouteResult(List<GraphNode> pathNodes, double totalDistanceKm, int totalTimeMins, String routeSummary) {
            this.pathNodes = pathNodes;
            this.totalDistanceKm = totalDistanceKm;
            this.totalTimeMins = totalTimeMins;
            this.routeSummary = routeSummary;
        }

        public List<GraphNode> getPathNodes() { return pathNodes; }
        public double getTotalDistanceKm() { return totalDistanceKm; }
        public int getTotalTimeMins() { return totalTimeMins; }
        public String getRouteSummary() { return routeSummary; }
    }

    private static class NodeDistPair {
        private final int nodeId;
        private final double distance;

        public NodeDistPair(int nodeId, double distance) {
            this.nodeId = nodeId;
            this.distance = distance;
        }

        public int getNodeId() { return nodeId; }
        public double getDistance() { return distance; }
    }

    public static RouteResult findShortestRoute(DeliveryGraph graph, int startNodeId, int targetNodeId) {
        Map<Integer, Double> dist = new HashMap<>();
        Map<Integer, Integer> prev = new HashMap<>();
        Map<Integer, Integer> timeMap = new HashMap<>();
        Set<Integer> visited = new HashSet<>();

        PriorityQueue<NodeDistPair> pq = new PriorityQueue<>(Comparator.comparingDouble(NodeDistPair::getDistance));

        for (int nodeId : graph.getAllNodeIds()) {
            dist.put(nodeId, Double.MAX_VALUE);
        }

        dist.put(startNodeId, 0.0);
        timeMap.put(startNodeId, 0);
        pq.offer(new NodeDistPair(startNodeId, 0.0));

        while (!pq.isEmpty()) {
            NodeDistPair current = pq.poll();
            int u = current.getNodeId();

            if (visited.contains(u)) continue;
            visited.add(u);

            if (u == targetNodeId) break;

            for (GraphEdge edge : graph.getNeighbors(u)) {
                int v = edge.getTargetNodeId();
                if (visited.contains(v)) continue;

                double newDist = dist.get(u) + edge.getDistanceKm();
                if (newDist < dist.get(v)) {
                    dist.put(v, newDist);
                    prev.put(v, u);
                    timeMap.put(v, timeMap.get(u) + edge.getEstimatedTimeMins());
                    pq.offer(new NodeDistPair(v, newDist));
                }
            }
        }

        // Reconstruct path
        List<GraphNode> path = new ArrayList<>();
        int curr = targetNodeId;
        if (!prev.containsKey(curr) && curr != startNodeId) {
            // Target is unreachable
            return new RouteResult(Collections.emptyList(), 0.0, 0, "No route available");
        }

        Stack<Integer> stack = new Stack<>();
        while (curr != startNodeId && prev.containsKey(curr)) {
            stack.push(curr);
            curr = prev.get(curr);
        }
        stack.push(startNodeId);

        StringBuilder summaryBuilder = new StringBuilder();
        while (!stack.isEmpty()) {
            int nid = stack.pop();
            GraphNode gNode = graph.getNode(nid);
            if (gNode != null) {
                path.add(gNode);
                if (summaryBuilder.length() > 0) summaryBuilder.append(" ➔ ");
                summaryBuilder.append(gNode.getName());
            }
        }

        double totalDist = dist.getOrDefault(targetNodeId, 0.0);
        int totalTime = timeMap.getOrDefault(targetNodeId, 0);

        return new RouteResult(path, Math.round(totalDist * 100.0) / 100.0, totalTime, summaryBuilder.toString());
    }
}
