package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Topic;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {
	List<Topic> findByNameContainingOrDescriptionContaining(String text, String textAgain);

	List<Topic> findBySlug(String slug);

	List<Topic> findByStatus(int orderStatus);
}
