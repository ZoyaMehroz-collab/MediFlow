package com.mediflow.repository;

import com.mediflow.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMedicineId(Long medicineId);
    List<Review> findByCustomerId(Long customerId);
}
