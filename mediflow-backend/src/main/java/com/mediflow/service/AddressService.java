package com.mediflow.service;

import com.mediflow.dto.request.CreateAddressRequest;
import com.mediflow.dto.response.AddressDTO;
import com.mediflow.entity.Address;
import com.mediflow.entity.User;
import com.mediflow.exception.ResourceNotFoundException;
import com.mediflow.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AuthService authService;

    public List<AddressDTO> getMyAddresses() {
        User user = authService.getCurrentAuthenticatedUser();
        return addressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDTO addAddress(CreateAddressRequest request) {
        User user = authService.getCurrentAuthenticatedUser();

        Address address = new Address();
        address.setUser(user);
        address.setRecipientName(request.getRecipientName());
        address.setPhone(request.getPhone());
        address.setStreetAddress(request.getStreetAddress());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setGraphNodeId(request.getGraphNodeId() != null ? request.getGraphNodeId() : 6);
        address.setDefault(request.isDefault());

        return mapToDTO(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + id));
        addressRepository.delete(address);
    }

    public AddressDTO mapToDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setRecipientName(address.getRecipientName());
        dto.setPhone(address.getPhone());
        dto.setStreetAddress(address.getStreetAddress());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPostalCode(address.getPostalCode());
        dto.setGraphNodeId(address.getGraphNodeId());
        dto.setDefault(address.isDefault());
        return dto;
    }
}
