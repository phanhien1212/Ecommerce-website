package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.DoAnTotNghiepjava.entity.AdvertisingCampaigns;

public interface AdvertisingCampaignRepository extends JpaRepository<AdvertisingCampaigns, Integer> {
	List<AdvertisingCampaigns> findByKeywordContainingIgnoreCase(String keyword);
}
