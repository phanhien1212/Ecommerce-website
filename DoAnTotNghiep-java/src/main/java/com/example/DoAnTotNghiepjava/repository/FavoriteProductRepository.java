package com.example.DoAnTotNghiepjava.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.FavoriteProduct;
import com.example.DoAnTotNghiepjava.entity.Product;

import java.util.List;

@Repository
public interface FavoriteProductRepository extends CrudRepository<FavoriteProduct, Long> {

	@Query("SELECT fp FROM FavoriteProduct fp WHERE fp.user_id = :userId")
    List<FavoriteProduct> findByUserId(int userId);
    
    @Query("SELECT fp FROM FavoriteProduct fp WHERE fp.user_id = ?1 AND fp.product_id = ?2")
    FavoriteProduct findByUserIdAndProductId(int user_id, int product_id);
    
    @Query("SELECT CASE WHEN COUNT(fp) > 0 THEN true ELSE false END FROM FavoriteProduct fp WHERE fp.user_id = :user_id AND fp.product_id = :product_id")
    boolean existsByUserIdAndProductId(int user_id, int product_id);
    
    @Query("SELECT p FROM Product p JOIN FavoriteProduct fp ON p.id = fp.product_id JOIN User u ON fp.user_id = u.id WHERE u.id = :userId")
    List<Product> findFavariteProductByUserId(int userId);
    
    @Query("SELECT COUNT(fp) FROM FavoriteProduct fp WHERE fp.product_id = :productId")
	long countsFavoriteProduct(@Param("productId") int productId);
    
}

