package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Product;
import com.example.DoAnTotNghiepjava.entity.ProductAttribute;

@Repository
public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, Integer>{
	  List<ProductAttribute> findByProductId(int productId);
}
