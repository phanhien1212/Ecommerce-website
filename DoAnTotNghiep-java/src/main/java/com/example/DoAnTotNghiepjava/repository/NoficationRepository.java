package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.DoAnTotNghiepjava.entity.Nofication;

public interface NoficationRepository extends JpaRepository<Nofication, Integer>{
	List<Nofication> findByStatus(int orderStatus);
	List<Nofication> findByRecipientId(int recipientId);
}
