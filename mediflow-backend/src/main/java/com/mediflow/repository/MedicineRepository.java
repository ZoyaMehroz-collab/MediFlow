package com.mediflow.repository;

import com.mediflow.entity.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    Page<Medicine> findByActiveTrue(Pageable pageable);
    
    @Query("SELECT m FROM Medicine m WHERE m.active = true AND " +
           "(:categoryId IS NULL OR m.category.id = :categoryId) AND " +
           "(:search IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(m.genericName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Medicine> searchMedicines(@Param("categoryId") Long categoryId,
                                  @Param("search") String search,
                                  Pageable pageable);

    List<Medicine> findByActiveTrue();
}
