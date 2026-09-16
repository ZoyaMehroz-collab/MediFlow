package com.mediflow.dsa.graph;

public class GraphEdge {
    private final int targetNodeId;
    private final double distanceKm;
    private final int estimatedTimeMins;

    public GraphEdge(int targetNodeId, double distanceKm, int estimatedTimeMins) {
        this.targetNodeId = targetNodeId;
        this.distanceKm = distanceKm;
        this.estimatedTimeMins = estimatedTimeMins;
    }

    public int getTargetNodeId() { return targetNodeId; }
    public double getDistanceKm() { return distanceKm; }
    public int getEstimatedTimeMins() { return estimatedTimeMins; }
}
