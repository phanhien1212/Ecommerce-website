package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Banner;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Integer> {
	List<Banner> findByNameContainingOrDescriptionContaining(String text, String textAgain);
	List<Banner> findByStatus(int orderStatus);
}
