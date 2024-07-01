package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Contact;
import com.example.DoAnTotNghiepjava.entity.ShopProfile;

@Repository
public interface ShopProfileRepository extends JpaRepository<ShopProfile, Integer> {
	List<ShopProfile> findByIdSeller(int idSeller);
}
