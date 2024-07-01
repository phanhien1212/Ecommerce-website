package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.FlashSale;
@Repository
public interface FlashSaleRepository extends JpaRepository<FlashSale, Integer> {
	List<FlashSale> findByStatus(int orderStatus);
}
