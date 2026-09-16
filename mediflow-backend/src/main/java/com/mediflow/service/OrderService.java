package com.mediflow.service;

import com.mediflow.dto.request.CreateOrderRequest;
import com.mediflow.dto.response.AddressDTO;
import com.mediflow.dto.response.OrderDTO;
import com.mediflow.dto.response.OrderItemDTO;
import com.mediflow.entity.*;
import com.mediflow.exception.BadRequestException;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private CartService cartService;

    @Transactional
    public OrderDTO placeOrder(CreateOrderRequest request) {
        User customer = authService.getCurrentAuthenticatedUser();

        Address shippingAddress = addressRepository.findById(request.getShippingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found with ID: " + request.getShippingAddressId()));

        if (!shippingAddress.getUser().getId().equals(customer.getId())) {
            throw new BadRequestException("Address does not belong to customer profile");
        }

        Cart cart = cartRepository.findByUserId(customer.getId())
                .orElseThrow(() -> new BadRequestException("User shopping cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with an empty cart");
        }

        Prescription prescription = null;
        if (request.getPrescriptionId() != null) {
            prescription = prescriptionRepository.findById(request.getPrescriptionId()).orElse(null);
        }

        // Check if any cart item requires prescription
        boolean rxRequired = cart.getItems().stream()
                .anyMatch(item -> item.getMedicine().isPrescriptionRequired());

        if (rxRequired && (prescription == null || !"VERIFIED".equals(prescription.getStatus()))) {
            throw new BadRequestException("One or more medicines in your cart require a VERIFIED prescription before checkout");
        }

        Order order = new Order();
        order.setOrderNumber("MDF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setCustomer(customer);
        order.setShippingAddress(shippingAddress);
        order.setPrescription(prescription);
        order.setOrderStatus("PLACED");
        order.setPaymentStatus("PAID");

        BigDecimal totalAmount = BigDecimal.ZERO;

        Order savedOrder = orderRepository.save(order);

        for (CartItem cartItem : cart.getItems()) {
            BigDecimal subtotal = cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            OrderItem orderItem = new OrderItem(savedOrder, cartItem.getMedicine(), cartItem.getQuantity(), cartItem.getUnitPrice(), subtotal);
            savedOrder.getOrderItems().add(orderItem);
            totalAmount = totalAmount.add(subtotal);
        }

        savedOrder.setTotalAmount(totalAmount);
        Order finalizedOrder = orderRepository.save(savedOrder);

        // Clear cart after successful order creation
        cartService.clearCart();

        return mapToDTO(finalizedOrder);
    }

    public Page<OrderDTO> getUserOrders(int page, int size) {
        User customer = authService.getCurrentAuthenticatedUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        if (customer.getRole() == Role.ROLE_PHARMACY_ADMIN) {
            return orderRepository.findAll(pageable).map(this::mapToDTO);
        } else {
            return orderRepository.findByCustomerId(customer.getId(), pageable).map(this::mapToDTO);
        }
    }

    public OrderDTO getOrderById(Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        if (user.getRole() == Role.ROLE_CUSTOMER && !order.getCustomer().getId().equals(user.getId())) {
            throw new BadRequestException("Order does not belong to logged in customer");
        }

        return mapToDTO(order);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        order.setOrderStatus(status.toUpperCase().trim());
        Order updated = orderRepository.save(order);
        return mapToDTO(updated);
    }

    public OrderDTO mapToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getFullName());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setCreatedAt(order.getCreatedAt());

        if (order.getPrescription() != null) {
            dto.setPrescriptionId(order.getPrescription().getId());
        }

        if (order.getShippingAddress() != null) {
            Address addr = order.getShippingAddress();
            AddressDTO addrDto = new AddressDTO();
            addrDto.setId(addr.getId());
            addrDto.setRecipientName(addr.getRecipientName());
            addrDto.setPhone(addr.getPhone());
            addrDto.setStreetAddress(addr.getStreetAddress());
            addrDto.setCity(addr.getCity());
            addrDto.setState(addr.getState());
            addrDto.setPostalCode(addr.getPostalCode());
            addrDto.setGraphNodeId(addr.getGraphNodeId());
            addrDto.setDefault(addr.isDefault());
            dto.setShippingAddress(addrDto);
        }

        if (order.getOrderItems() != null) {
            List<OrderItemDTO> items = order.getOrderItems().stream().map(item -> {
                OrderItemDTO itemDto = new OrderItemDTO();
                itemDto.setId(item.getId());
                itemDto.setMedicineId(item.getMedicine().getId());
                itemDto.setMedicineName(item.getMedicine().getName());
                itemDto.setDosageForm(item.getMedicine().getDosageForm());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setUnitPrice(item.getUnitPrice());
                itemDto.setSubtotal(item.getSubtotal());
                return itemDto;
            }).collect(Collectors.toList());
            dto.setItems(items);
        }

        return dto;
    }
}
