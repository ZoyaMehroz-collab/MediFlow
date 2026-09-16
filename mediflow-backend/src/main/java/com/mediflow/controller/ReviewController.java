package com.mediflow.controller;

import com.mediflow.dto.request.CreateReviewRequest;
import com.mediflow.dto.response.ReviewDTO;
import com.mediflow.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByMedicine(@PathVariable Long medicineId) {
        return ResponseEntity.ok(reviewService.getReviewsByMedicine(medicineId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReviewDTO>> getMyReviews() {
        return ResponseEntity.ok(reviewService.getMyReviews());
    }

    @PostMapping("/medicine/{medicineId}")
    public ResponseEntity<ReviewDTO> createReview(@PathVariable Long medicineId,
                                                   @Valid @RequestBody CreateReviewRequest request) {
        return new ResponseEntity<>(reviewService.createReview(medicineId, request), HttpStatus.CREATED);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }
}
