package com.mediflow.service;

import com.mediflow.dto.request.CreateReviewRequest;
import com.mediflow.dto.response.ReviewDTO;
import com.mediflow.entity.Medicine;
import com.mediflow.entity.Review;
import com.mediflow.entity.User;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.MedicineRepository;
import com.mediflow.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private AuthService authService;

    public List<ReviewDTO> getReviewsByMedicine(Long medicineId) {
        return reviewRepository.findByMedicineId(medicineId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getMyReviews() {
        User user = authService.getCurrentAuthenticatedUser();
        return reviewRepository.findByCustomerId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO createReview(Long medicineId, CreateReviewRequest request) {
        User customer = authService.getCurrentAuthenticatedUser();
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + medicineId));

        Review review = new Review(medicine, customer, request.getRating(), request.getComment());
        Review saved = reviewRepository.save(review);
        return mapToDTO(saved);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));
        reviewRepository.delete(review);
    }

    public ReviewDTO mapToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setMedicineId(review.getMedicine().getId());
        dto.setMedicineName(review.getMedicine().getName());
        dto.setCustomerId(review.getCustomer().getId());
        dto.setCustomerName(review.getCustomer().getFullName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
