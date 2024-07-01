package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
	List<Category> findByNameContainingOrDescriptionContaining(String text, String textAgain);

	List<Category> findBySlug(String slug);

	List<Category> findByStatus(int orderStatus);

	@Query("SELECT c FROM Category c WHERE c.parent_id = :parentId")
	List<Category> findByParentId(int parentId);
	
}
