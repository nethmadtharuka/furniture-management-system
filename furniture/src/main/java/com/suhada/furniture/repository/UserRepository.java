package com.suhada.furniture.repository;

import com.suhada.furniture.entity.User;
import com.suhada.furniture.entity.Role;
import com.suhada.furniture.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring automatically generates: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // Spring generates: SELECT * FROM users WHERE email = ? (returns boolean)
    boolean existsByEmail(String email);

    // Spring generates: SELECT * FROM users WHERE role = ?
    List<User> findByRole(Role role);

    // Spring generates: SELECT * FROM users WHERE status = ?
    List<User> findByStatus(Status status);

    // Spring generates: SELECT * FROM users WHERE role = ? AND status = ?
    List<User> findByRoleAndStatus(Role role, Status status);

    // Spring generates: SELECT * FROM users WHERE full_name LIKE %?%
    List<User> findByFullNameContainingIgnoreCase(String name);
}