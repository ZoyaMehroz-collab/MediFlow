package com.mediflow.service;

import com.mediflow.dto.request.AssignDeliveryRequest;
import com.mediflow.dto.response.DeliveryDTO;
import com.mediflow.dsa.graph.DeliveryGraph;
import com.mediflow.dsa.graph.DijkstraShortestPath;
import com.mediflow.entity.*;
import com.mediflow.exception.BadRequestException;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.DeliveryRepository;
import com.mediflow.repository.OrderRepository;
import com.mediflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeliveryGraph deliveryGraph;

    @Autowired
    private AuthService authService;

    @Transactional
    public DeliveryDTO assignDelivery(AssignDeliveryRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + request.getOrderId()));

        if (deliveryRepository.findByOrderId(order.getId()).isPresent()) {
            throw new BadRequestException("Delivery already assigned for Order ID: " + request.getOrderId());
        }

        User agent = userRepository.findById(request.getDeliveryAgentId())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery agent not found with ID: " + request.getDeliveryAgentId()));

        if (agent.getRole() != Role.ROLE_DELIVERY_AGENT) {
            throw new BadRequestException("User ID " + request.getDeliveryAgentId() + " is not a delivery agent");
        }

        // Run Dijkstra's algorithm to compute shortest delivery route
        int startHub = request.getStartHubNodeId() != null ? request.getStartHubNodeId() : 1;
        int destinationNode = order.getShippingAddress().getGraphNodeId();

        DijkstraShortestPath.RouteResult route = DijkstraShortestPath.findShortestRoute(deliveryGraph, startHub, destinationNode);

        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setDeliveryAgent(agent);
        delivery.setStatus("ASSIGNED");
        delivery.setOptimalRouteNodes(route.getRouteSummary());
        delivery.setTotalDistanceKm(BigDecimal.valueOf(route.getTotalDistanceKm()));
        delivery.setEstimatedTimeMins(route.getTotalTimeMins());

        order.setOrderStatus("OUT_FOR_DELIVERY");
        orderRepository.save(order);

        Delivery saved = deliveryRepository.save(delivery);
        return mapToDTO(saved);
    }

    public List<DeliveryDTO> getMyDeliveries() {
        User agent = authService.getCurrentAuthenticatedUser();
        return deliveryRepository.findByDeliveryAgentId(agent.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DeliveryDTO> getAllDeliveries() {
        return deliveryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DeliveryDTO getDeliveryById(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with ID: " + id));
        return mapToDTO(delivery);
    }

    @Transactional
    public DeliveryDTO updateDeliveryStatus(Long id, String status) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with ID: " + id));

        String upperStatus = status.toUpperCase().trim();
        delivery.setStatus(upperStatus);

        if ("PICKED_UP".equals(upperStatus)) {
            delivery.setPickedUpAt(LocalDateTime.now());
        } else if ("DELIVERED".equals(upperStatus)) {
            delivery.setDeliveredAt(LocalDateTime.now());
            delivery.getOrder().setOrderStatus("DELIVERED");
            orderRepository.save(delivery.getOrder());
        }

        return mapToDTO(deliveryRepository.save(delivery));
    }

    public DeliveryDTO mapToDTO(Delivery delivery) {
        DeliveryDTO dto = new DeliveryDTO();
        dto.setId(delivery.getId());
        dto.setOrderId(delivery.getOrder().getId());
        dto.setOrderNumber(delivery.getOrder().getOrderNumber());
        if (delivery.getDeliveryAgent() != null) {
            dto.setDeliveryAgentId(delivery.getDeliveryAgent().getId());
            dto.setDeliveryAgentName(delivery.getDeliveryAgent().getFullName());
        }
        dto.setStatus(delivery.getStatus());
        dto.setOptimalRouteNodes(delivery.getOptimalRouteNodes());
        dto.setTotalDistanceKm(delivery.getTotalDistanceKm());
        dto.setEstimatedTimeMins(delivery.getEstimatedTimeMins());
        dto.setAssignedAt(delivery.getAssignedAt());
        dto.setPickedUpAt(delivery.getPickedUpAt());
        dto.setDeliveredAt(delivery.getDeliveredAt());
        return dto;
    }
}
