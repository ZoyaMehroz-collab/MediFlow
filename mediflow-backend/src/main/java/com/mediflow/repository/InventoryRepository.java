package com.mediflow.repository;

import com.mediflow.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByMedicineId(Long medicineId);
    Optional<Inventory> findByBatchNumber(String batchNumber);
    List<Inventory> findByExpiryDateBefore(LocalDate limitDate);
    List<Inventory> findByStockQuantityLessThanEqual(Integer threshold);
}
