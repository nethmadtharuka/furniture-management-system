package com.suhada.furniture.service;

import com.suhada.furniture.dto.CreateCustomerRequest;
import com.suhada.furniture.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {

    // Create new customer
    CustomerDTO createCustomer(CreateCustomerRequest request);

    // Get customer by ID
    CustomerDTO getCustomerById(Long id);

    // Get customer by email
    CustomerDTO getCustomerByEmail(String email);

    // Get all customers
    List<CustomerDTO> getAllCustomers();

    // Search customers by name
    List<CustomerDTO> searchCustomers(String query);

    // Get customers by city
    List<CustomerDTO> getCustomersByCity(String city);

    // Update customer
    CustomerDTO updateCustomer(Long id, CreateCustomerRequest request);

    // Delete customer
    void deleteCustomer(Long id);

    // Check if email exists
    boolean emailExists(String email);
}