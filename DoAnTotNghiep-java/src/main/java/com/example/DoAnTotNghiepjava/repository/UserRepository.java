package com.example.DoAnTotNghiepjava.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Order;
import com.example.DoAnTotNghiepjava.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	List<User> findByStatus(int orderStatus);

	Optional<User> findByUsernameAndPassword(String username, String password);

	Optional<User> findByUsernameOrEmail(String username, String email);

	List<User> findByRole(String role);

	@Query("SELECT u FROM User u WHERE u.role = 'admin'")
	List<User> findAllUsers();

}
