package com.mediflow.service;

import com.mediflow.dto.request.AddToCartRequest;
import com.mediflow.dto.response.CartDTO;
import com.mediflow.dto.response.CartItemDTO;
import com.mediflow.entity.Cart;
import com.mediflow.entity.CartItem;
import com.mediflow.entity.Medicine;
import com.mediflow.entity.User;
import com.mediflow.exception.BadRequestException;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.CartItemRepository;
import com.mediflow.repository.CartRepository;
import com.mediflow.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public Cart getOrCreateUserCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    public CartDTO getCart() {
        User user = authService.getCurrentAuthenticatedUser();
        Cart cart = getOrCreateUserCart(user);
        return mapToDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(AddToCartRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        Cart cart = getOrCreateUserCart(user);

        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + request.getMedicineId()));

        if (!medicine.isActive()) {
            throw new BadRequestException("Medicine is currently unavailable");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndMedicineId(cart.getId(), medicine.getId());

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setUnitPrice(medicine.getUnitPrice());
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem(cart, medicine, request.getQuantity(), medicine.getUnitPrice());
            cartItemRepository.save(item);
        }

        return getCart();
    }

    @Transactional
    public CartDTO updateCartItemQuantity(Long itemId, Integer quantity) {
        User user = authService.getCurrentAuthenticatedUser();
        Cart cart = getOrCreateUserCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to user's active cart");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCart();
    }

    @Transactional
    public CartDTO removeCartItem(Long itemId) {
        User user = authService.getCurrentAuthenticatedUser();
        Cart cart = getOrCreateUserCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to user's active cart");
        }

        cartItemRepository.delete(item);
        return getCart();
    }

    @Transactional
    public void clearCart() {
        User user = authService.getCurrentAuthenticatedUser();
        Cart cart = getOrCreateUserCart(user);
        cartItemRepository.deleteByCartId(cart.getId());
    }

    public CartDTO mapToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());

        BigDecimal grandTotal = BigDecimal.ZERO;
        int totalItemCount = 0;

        for (CartItem item : cart.getItems()) {
            CartItemDTO itemDto = new CartItemDTO();
            itemDto.setId(item.getId());
            itemDto.setMedicineId(item.getMedicine().getId());
            itemDto.setMedicineName(item.getMedicine().getName());
            itemDto.setDosageForm(item.getMedicine().getDosageForm());
            itemDto.setImageUrl(item.getMedicine().getImageUrl());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setUnitPrice(item.getUnitPrice());

            BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            itemDto.setSubtotal(subtotal);

            dto.getItems().add(itemDto);

            grandTotal = grandTotal.add(subtotal);
            totalItemCount += item.getQuantity();
        }

        dto.setGrandTotal(grandTotal);
        dto.setTotalItems(totalItemCount);
        return dto;
    }
}
