package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer>{
	List<Contact> findByStatus(int orderStatus);
	List<Contact>  findByMessageTextContaining(String text);
	 List<Contact> findBySellerIdAndBuyerId(int sellerId, int buyerId);
	 List<Contact> findByReceiverId(int receiverId);
	
}