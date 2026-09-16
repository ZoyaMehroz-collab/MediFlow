package com.mediflow.dsa.heap;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public class InventoryMinHeap {

    public static class InventoryStockItem {
        private final Long batchId;
        private final String medicineName;
        private final String batchNumber;
        private final int stockQuantity;
        private final int reorderLevel;

        public InventoryStockItem(Long batchId, String medicineName, String batchNumber, int stockQuantity, int reorderLevel) {
            this.batchId = batchId;
            this.medicineName = medicineName;
            this.batchNumber = batchNumber;
            this.stockQuantity = stockQuantity;
            this.reorderLevel = reorderLevel;
        }

        public Long getBatchId() { return batchId; }
        public String getMedicineName() { return medicineName; }
        public String getBatchNumber() { return batchNumber; }
        public int getStockQuantity() { return stockQuantity; }
        public int getReorderLevel() { return reorderLevel; }
    }

    private final PriorityQueue<InventoryStockItem> minHeap = new PriorityQueue<>(
            Comparator.comparingInt(InventoryStockItem::getStockQuantity)
    );

    public void insert(InventoryStockItem item) {
        minHeap.offer(item);
    }

    public List<InventoryStockItem> getTopLowStockItems(int limit) {
        List<InventoryStockItem> result = new ArrayList<>();
        PriorityQueue<InventoryStockItem> tempHeap = new PriorityQueue<>(minHeap);
        while (!tempHeap.isEmpty() && result.size() < limit) {
            result.add(tempHeap.poll());
        }
        return result;
    }

    public int size() {
        return minHeap.size();
    }
}
