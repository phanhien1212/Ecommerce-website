package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
	@Query("SELECT r FROM Review r JOIN Product p ON r.product_id = p.id WHERE p.id = :product_id")
	List<Review> findProductId(@Param("product_id") Integer product_id);

	@Query("SELECT r FROM Review r JOIN User u ON r.user_id = u.id WHERE u.id = :user_id")
	List<Review> findUserId(@Param("user_id") Integer user_id);
}
