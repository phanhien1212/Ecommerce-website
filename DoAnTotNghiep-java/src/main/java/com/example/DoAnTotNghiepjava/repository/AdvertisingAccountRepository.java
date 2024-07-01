package com.example.DoAnTotNghiepjava.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.DoAnTotNghiepjava.entity.AdvertisingAccount;

public interface AdvertisingAccountRepository extends JpaRepository<AdvertisingAccount, Integer> {
	 Optional<AdvertisingAccount> findByUserId(int userId);
}
