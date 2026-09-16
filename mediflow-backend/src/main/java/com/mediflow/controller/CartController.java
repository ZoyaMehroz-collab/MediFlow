package com.mediflow.controller;

import com.mediflow.dto.request.AddToCartRequest;
import com.mediflow.dto.response.CartDTO;
import com.mediflow.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/items")
    public ResponseEntity<CartDTO> addToCart(@Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> updateCartItem(@PathVariable Long itemId,
                                                   @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDTO> removeCartItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeCartItem(itemId));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
    }
}
