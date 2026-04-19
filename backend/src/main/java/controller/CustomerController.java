package com.suhada.furniture.controller;

import com.suhada.furniture.dto.ApiResponse;
import com.suhada.furniture.dto.CreateCustomerRequest;
import com.suhada.furniture.dto.CustomerDTO;
import com.suhada.furniture.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Slf4j
public class CustomerController {

    private final CustomerService customerService;

    // ============================================================
    // CREATE CUSTOMER - POST /api/customers
    // ============================================================
    @PostMapping
    public ResponseEntity<ApiResponse<CustomerDTO>> createCustomer(
            @Valid @RequestBody CreateCustomerRequest request) {

        log.info("👤 Creating new customer: {}", request.getFullName());

        CustomerDTO customer = customerService.createCustomer(request);

        log.info("✅ Customer created with ID: {}", customer.getId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer created successfully", customer));
    }

    // ============================================================
    // GET ALL CUSTOMERS - GET /api/customers
    // ============================================================
    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerDTO>>> getAllCustomers() {

        log.info("📋 Fetching all customers");

        List<CustomerDTO> customers = customerService.getAllCustomers();

        log.info("✅ Found {} customers", customers.size());

        return ResponseEntity.ok(
                ApiResponse.success("Customers retrieved successfully", customers)
        );
    }

    // ============================================================
    // GET CUSTOMER BY ID - GET /api/customers/{id}
    // ============================================================
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDTO>> getCustomerById(
            @PathVariable Long id) {

        log.info("🔍 Fetching customer with ID: {}", id);

        CustomerDTO customer = customerService.getCustomerById(id);

        log.info("✅ Customer found: {}", customer.getFullName());

        return ResponseEntity.ok(
                ApiResponse.success("Customer found", customer)
        );
    }

    // ============================================================
    // GET CUSTOMER BY EMAIL - GET /api/customers/email/{email}
    // ============================================================
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<CustomerDTO>> getCustomerByEmail(
            @PathVariable String email) {

        log.info("🔍 Fetching customer with email: {}", email);

        CustomerDTO customer = customerService.getCustomerByEmail(email);

        log.info("✅ Customer found: {}", customer.getFullName());

        return ResponseEntity.ok(
                ApiResponse.success("Customer found", customer)
        );
    }

    // ============================================================
    // SEARCH CUSTOMERS - GET /api/customers/search?query=john
    // ============================================================
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CustomerDTO>>> searchCustomers(
            @RequestParam String query) {

        log.info("🔎 Searching customers with query: {}", query);

        List<CustomerDTO> customers = customerService.searchCustomers(query);

        log.info("✅ Found {} customers matching '{}'", customers.size(), query);

        return ResponseEntity.ok(
                ApiResponse.success("Search results", customers)
        );
    }

    // ============================================================
    // GET CUSTOMERS BY CITY - GET /api/customers/city/{city}
    // ============================================================
    @GetMapping("/city/{city}")
    public ResponseEntity<ApiResponse<List<CustomerDTO>>> getCustomersByCity(
            @PathVariable String city) {

        log.info("📍 Fetching customers in city: {}", city);

        List<CustomerDTO> customers = customerService.getCustomersByCity(city);

        log.info("✅ Found {} customers in {}", customers.size(), city);

        return ResponseEntity.ok(
                ApiResponse.success("Customers in " + city, customers)
        );
    }

    // ============================================================
    // UPDATE CUSTOMER - PUT /api/customers/{id}
    // ============================================================
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDTO>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CreateCustomerRequest request) {

        log.info("📝 Updating customer with ID: {}", id);

        CustomerDTO customer = customerService.updateCustomer(id, request);

        log.info("✅ Customer {} updated successfully", id);

        return ResponseEntity.ok(
                ApiResponse.success("Customer updated successfully", customer)
        );
    }

    // ============================================================
    // DELETE CUSTOMER - DELETE /api/customers/{id}
    // ============================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {

        log.info("🗑️ Deleting customer with ID: {}", id);

        customerService.deleteCustomer(id);

        log.info("✅ Customer {} deleted successfully", id);

        return ResponseEntity.ok(
                ApiResponse.success("Customer deleted successfully", null)
        );
    }
}