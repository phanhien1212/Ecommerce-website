package com.example.DoAnTotNghiepjava.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.DoAnTotNghiepjava.entity.User;

public interface SellerRepository extends JpaRepository<User, Integer>{
	@Query("SELECT u FROM User u WHERE u.role = 'seller'")
	 List<User> findAllSellers();
	 Optional<User> findSellerByIdAndRole(Integer id, String role);
	 List<User> findByStatus(int orderStatus);
}
