package com.mediflow.dsa.graph;

public class GraphNode {
    private final int id;
    private final String name;

    public GraphNode(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() { return id; }
    public String getName() { return name; }
}
