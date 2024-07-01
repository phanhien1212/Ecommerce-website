package com.example.DoAnTotNghiepjava.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Category;
import com.example.DoAnTotNghiepjava.entity.Follow;
import com.example.DoAnTotNghiepjava.entity.Product;
import com.example.DoAnTotNghiepjava.entity.ProductImage;

import jakarta.transaction.Transactional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
	List<Product> findByNameContainingOrDescriptionContaining(String text, String textAgain);

	List<Product> findBySlug(String slug);

	List<Product> findByStatus(int orderStatus);

	List<Product> findByStockquantityGreaterThan(int Stockquantity);

	@Query("SELECT p FROM Product p JOIN User u ON p.seller_id = u.id WHERE u.id = :sellerId")
	List<Product> findProductsBySeller(@Param("sellerId") Integer sellerId);
	
	@Query("SELECT pi FROM ProductImage pi WHERE pi.product_id = :product_id")
	List<ProductImage> findProductImage(@Param("product_id") Integer product_id);

	@Query("SELECT p.id as id, p.name as name, p.description as description, p.price as price, p.image as image, p.detail as detail, p.stockquantity as stockquantity, p.seller_id as seller_id, s.name as storeName, s.image as storeImage FROM Product p JOIN User u ON p.seller_id = u.id JOIN ShopProfile s ON u.id = s.idSeller WHERE p.slug = :slug")
	Optional<Map<String, Object>> findProductDetailsBySlug(@Param("slug") String slug);

	@Modifying
	@Transactional
	@Query("UPDATE Product p SET p.stockquantity = p.stockquantity - :qty WHERE p.id = :id AND p.stockquantity >= :qty")
	int reduceStock(@Param("id") Long id, @Param("qty") int qty);

	@Query("SELECT DISTINCT c FROM Category c JOIN Product p ON p.category_id = c.id JOIN User u ON p.seller_id = u.id WHERE u.id = :sellerId")
	List<Category> findCategoriesBySeller(@Param("sellerId") Integer sellerId);
	
	@Query("SELECT p.stockquantity FROM Product p WHERE p.id = :productId")
    Integer findQuantityById(@Param("productId") Long productId);

}
