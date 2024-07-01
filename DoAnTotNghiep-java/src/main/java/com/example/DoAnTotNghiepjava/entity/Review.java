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
@Table(name = "reviews")
public class Review {
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
	public int getRating() {
		return rating;
	}
	public void setRating(int rating) {
		this.rating = rating;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public int getCreated_by() {
		return created_by;
	}
	public void setCreated_by(int created_by) {
		this.created_by = created_by;
	}
	public Date getCreated_at() {
		return created_at;
	}
	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}
	@Override
	public String toString() {
		return "Review [id=" + id + ", user_id=" + user_id + ", product_id=" + product_id + ", rating=" + rating
				+ ", comment=" + comment + ", image=" + image + ", created_by=" + created_by + ", created_at="
				+ created_at + "]";
	}
	private int user_id;
	 private int product_id;
	 private int rating;
	 private String comment;
	 private String image;
	 private int created_by=1;
	 @Column(name = "created_at", nullable = false, updatable = false)
	 private Date created_at;
	 @PrePersist
		protected void onCreate() {
		    created_at = new Date();
		}
}
