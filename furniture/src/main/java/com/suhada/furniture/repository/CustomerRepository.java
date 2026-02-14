package com.suhada.furniture.repository;

import com.suhada.furniture.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Customer> findByPhoneNumber(String phoneNumber);

    List<Customer> findByCity(String city);

    List<Customer> findByFullNameContainingIgnoreCase(String name);

    // Find customers with WhatsApp
    List<Customer> findByWhatsappNumberIsNotNull();
}