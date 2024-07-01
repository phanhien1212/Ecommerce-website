package com.example.DoAnTotNghiepjava.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "favoriteproducts")
public class FavoriteProduct {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private int id;
	 public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public int getProduct_id() {
		return product_id;
	}
	public void setProduct_id(int product_id) {
		this.product_id = product_id;
	}
	public Date getCreated_at() {
		return created_at;
	}
	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}
	@Override
	public String toString() {
		return "FavoriteProduct [id=" + id + ", user_id=" + user_id + ", product_id=" + product_id + ", created_at="
				+ created_at + "]";
	}
	private int user_id;
	 private int product_id;
	 @Column(name = "created_at", nullable = false, updatable = false)
	 private Date created_at;
	 @PrePersist
	 protected void onCreate() {
	     created_at = new Date();
	 }
}
