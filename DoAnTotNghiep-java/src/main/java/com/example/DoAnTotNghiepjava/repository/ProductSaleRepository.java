package com.example.DoAnTotNghiepjava.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.ProductSale;

@Repository
public interface ProductSaleRepository extends JpaRepository<ProductSale, Integer> {
	List<ProductSale> findByStatus(int orderStatus);

	List<ProductSale> findByDiscountIsNotNull();

	
	@Query("SELECT ps FROM ProductSale ps " +
	           "WHERE ps.productId = :productId " +
	           "AND ps.status = 1 " +
	           "AND ps.datebegin <= CURRENT_DATE " +  // Ngày bắt đầu sale phải nhỏ hơn hoặc bằng ngày hiện tại
	           "AND ps.dateend >= CURRENT_DATE ")     // Ngày kết thúc sale phải lớn hơn hoặc bằng ngày hiện tại
	    Optional<ProductSale> findByProductId(@Param("productId") int productId);
}
