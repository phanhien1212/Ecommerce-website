package com.example.DoAnTotNghiepjava.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Shipping;

@Repository
public interface ShippingRepository extends JpaRepository<Shipping, Integer> {

}
