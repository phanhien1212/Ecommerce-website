package com.example.DoAnTotNghiepjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.Follow;
import com.example.DoAnTotNghiepjava.entity.ShopProfile;
import com.example.DoAnTotNghiepjava.entity.User;

@Repository
public interface FollowRepository extends CrudRepository<Follow, Long> {

	@Query("SELECT fp FROM Follow fp WHERE fp.user_id = :userId")
	List<Follow> findByuserId(int userId);

	@Query("SELECT f FROM Follow f WHERE f.user_id = ?1 AND f.shop_id = ?2")
	Follow findByUserIdAndShopId(int user_id, int shop_id);

	@Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Follow f WHERE f.user_id = :user_id AND f.shop_id = :shop_id")
	boolean existsByUserIdAndShopId(int user_id, int shop_id);

	@Query("SELECT sp FROM ShopProfile sp JOIN Follow f ON sp.id = f.shop_id JOIN User u ON f.user_id = u.id WHERE u.id = :userId")
	List<ShopProfile> findShopsFollowedByUserId(int userId);

	@Query("SELECT u FROM User u JOIN Follow f ON u.id = f.user_id JOIN ShopProfile sp ON sp.id = f.shop_id WHERE sp.id = :shopId")
	List<User> findUsersFollowingShopId(int shopId);

	@Query("SELECT COUNT(f) FROM Follow f WHERE f.shop_id = :shopId")
	long countFollowersByShopId(@Param("shopId") int shopId);

}
