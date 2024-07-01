package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Page;

@Repository
public interface PageRepository extends JpaRepository<Page, Integer> {
	List<Page> findByTitleContainingOrDescriptionContaining(String text, String textAgain);
	List<Page> findBySlug(String slug);
	  List<Page> findByStatus(int orderStatus);
}
