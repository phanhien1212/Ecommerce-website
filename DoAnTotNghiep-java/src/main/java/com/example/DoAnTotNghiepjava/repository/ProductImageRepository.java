package com.example.DoAnTotNghiepjava.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.ProductImage;
@Repository
public interface ProductImageRepository extends JpaRepository< ProductImage, Integer> {

}
