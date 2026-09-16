package com.mediflow.dsa.heap;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public class ExpiryMinHeap {

    public static class InventoryExpiryItem {
        private final Long batchId;
        private final String medicineName;
        private final String batchNumber;
        private final LocalDate expiryDate;
        private final int stockQuantity;

        public InventoryExpiryItem(Long batchId, String medicineName, String batchNumber, LocalDate expiryDate, int stockQuantity) {
            this.batchId = batchId;
            this.medicineName = medicineName;
            this.batchNumber = batchNumber;
            this.expiryDate = expiryDate;
            this.stockQuantity = stockQuantity;
        }

        public Long getBatchId() { return batchId; }
        public String getMedicineName() { return medicineName; }
        public String getBatchNumber() { return batchNumber; }
        public LocalDate getExpiryDate() { return expiryDate; }
        public int getStockQuantity() { return stockQuantity; }
    }

    private final PriorityQueue<InventoryExpiryItem> minHeap = new PriorityQueue<>(
            Comparator.comparing(InventoryExpiryItem::getExpiryDate)
    );

    public void insert(InventoryExpiryItem item) {
        minHeap.offer(item);
    }

    public List<InventoryExpiryItem> getEarliestExpiringItems(int limit) {
        List<InventoryExpiryItem> result = new ArrayList<>();
        PriorityQueue<InventoryExpiryItem> tempHeap = new PriorityQueue<>(minHeap);
        while (!tempHeap.isEmpty() && result.size() < limit) {
            result.add(tempHeap.poll());
        }
        return result;
    }

    public int size() {
        return minHeap.size();
    }
}
