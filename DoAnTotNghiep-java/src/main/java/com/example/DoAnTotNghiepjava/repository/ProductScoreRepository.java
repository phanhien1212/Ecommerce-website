package com.example.DoAnTotNghiepjava.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.DoAnTotNghiepjava.entity.ProductScore;

public interface ProductScoreRepository extends JpaRepository<ProductScore, Integer> {
	Optional<ProductScore> findByProductId(int productId);

	@Query("SELECT ps FROM ProductScore ps WHERE ps.productId IN :productIds")
	List<ProductScore> findByProductIds(List<Integer> productIds);
}
