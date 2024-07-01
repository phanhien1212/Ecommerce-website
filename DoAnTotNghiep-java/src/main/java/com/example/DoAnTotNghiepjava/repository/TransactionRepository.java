package com.example.DoAnTotNghiepjava.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Transaction;


@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer>{
	  
}