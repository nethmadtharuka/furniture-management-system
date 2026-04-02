package com.suhada.furniture.service.impl;

import com.suhada.furniture.dto.CreateCustomerRequest;
import com.suhada.furniture.dto.CustomerDTO;
import com.suhada.furniture.entity.Customer;
import com.suhada.furniture.exception.BadRequestException;
import com.suhada.furniture.exception.ResourceNotFoundException;
import com.suhada.furniture.repository.CustomerRepository;
import com.suhada.furniture.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    @Transactional
    public CustomerDTO createCustomer(CreateCustomerRequest request) {

        log.info("Creating new customer with email: {}", request.getEmail());

        // Validate email is unique
        if (customerRepository.existsByEmail(request.getEmail())) {
            log.error("Customer with email {} already exists", request.getEmail());
            throw new BadRequestException(
                    "Customer with email '" + request.getEmail() + "' already exists"
            );
        }

        // Create customer entity
        Customer customer = Customer.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .city(request.getCity())
                .whatsappNumber(request.getWhatsappNumber())
                .build();

        // Save to database
        Customer savedCustomer = customerRepository.save(customer);

        log.info("Customer created successfully with ID: {}", savedCustomer.getId());

        return mapToDTO(savedCustomer);
    }

    @Override
    public CustomerDTO getCustomerById(Long id) {

        log.info("Fetching customer with ID: {}", id);

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Customer not found with ID: {}", id);
                    return new ResourceNotFoundException("Customer", "id", id);
                });

        return mapToDTO(customer);
    }

    @Override
    public CustomerDTO getCustomerByEmail(String email) {

        log.info("Fetching customer with email: {}", email);

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("Customer not found with email: {}", email);
                    return new ResourceNotFoundException("Customer", "email", email);
                });

        return mapToDTO(customer);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {

        log.info("Fetching all customers");

        List<Customer> customers = customerRepository.findAll();

        log.info("Found {} customers", customers.size());

        return customers.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDTO> searchCustomers(String query) {

        log.info("Searching customers with query: {}", query);

        List<Customer> customers = customerRepository
                .findByFullNameContainingIgnoreCase(query);

        log.info("Found {} customers matching '{}'", customers.size(), query);

        return customers.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDTO> getCustomersByCity(String city) {

        log.info("Fetching customers in city: {}", city);

        List<Customer> customers = customerRepository.findByCity(city);

        log.info("Found {} customers in {}", customers.size(), city);

        return customers.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CustomerDTO updateCustomer(Long id, CreateCustomerRequest request) {

        log.info("Updating customer with ID: {}", id);

        // Find existing customer
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        // Check if new email conflicts with another customer
        if (!customer.getEmail().equals(request.getEmail())) {
            if (customerRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException(
                        "Email '" + request.getEmail() + "' is already in use"
                );
            }
        }

        // Update fields
        customer.setFullName(request.getFullName());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity());
        customer.setWhatsappNumber(request.getWhatsappNumber());

        // Save changes
        Customer updatedCustomer = customerRepository.save(customer);

        log.info("Customer {} updated successfully", id);

        return mapToDTO(updatedCustomer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {

        log.info("Deleting customer with ID: {}", id);

        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer", "id", id);
        }

        customerRepository.deleteById(id);

        log.info("Customer {} deleted successfully", id);
    }

    @Override
    public boolean emailExists(String email) {
        return customerRepository.existsByEmail(email);
    }

    // Helper method: Convert Entity to DTO
    private CustomerDTO mapToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFullName(customer.getFullName());
        dto.setEmail(customer.getEmail());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setAddress(customer.getAddress());
        dto.setCity(customer.getCity());
        dto.setWhatsappNumber(customer.getWhatsappNumber());
        dto.setCreatedAt(customer.getCreatedAt());
        return dto;
    }
}