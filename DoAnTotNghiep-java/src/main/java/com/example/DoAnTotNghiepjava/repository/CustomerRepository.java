package com.example.DoAnTotNghiepjava.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.DoAnTotNghiepjava.entity.User;

public interface CustomerRepository extends JpaRepository<User, Integer> {
	 @Query("SELECT u FROM User u WHERE u.role = 'customer'")
	 List<User> findAllCustomers();
	 Optional<User> findCustomerByIdAndRole(Integer id, String role);
	 List<User> findByStatus(int orderStatus);
	 
}
