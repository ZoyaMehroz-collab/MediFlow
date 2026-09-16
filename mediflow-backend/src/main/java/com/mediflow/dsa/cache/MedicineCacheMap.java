package com.mediflow.dsa.cache;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MedicineCacheMap {

    public static class CachedMedicineInfo {
        private final Long id;
        private final String name;
        private final BigDecimal unitPrice;
        private final boolean active;

        public CachedMedicineInfo(Long id, String name, BigDecimal unitPrice, boolean active) {
            this.id = id;
            this.name = name;
            this.unitPrice = unitPrice;
            this.active = active;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public boolean isActive() { return active; }
    }

    private final Map<Long, CachedMedicineInfo> cache = new ConcurrentHashMap<>();

    public void put(Long medicineId, String name, BigDecimal unitPrice, boolean active) {
        cache.put(medicineId, new CachedMedicineInfo(medicineId, name, unitPrice, active));
    }

    public CachedMedicineInfo get(Long medicineId) {
        return cache.get(medicineId);
    }

    public void remove(Long medicineId) {
        cache.remove(medicineId);
    }

    public void clear() {
        cache.clear();
    }

    public boolean contains(Long medicineId) {
        return cache.containsKey(medicineId);
    }
}
