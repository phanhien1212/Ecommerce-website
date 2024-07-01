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
@Table(name = "follows")
public class Follow {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Date getFollowdate() {
		return followdate;
	}
	public void setFollowdate(Date followdate) {
		this.followdate = followdate;
	}
	@Override
	public String toString() {
		return "Follow [id=" + id + ", user_id=" + user_id + ", shop_id=" + shop_id + ",status=" + status + ", followdate="
				+ followdate + "]";
	}
	private int user_id;
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public int getShop_id() {
		return shop_id;
	}
	public void setShop_id(int shop_id) {
		this.shop_id = shop_id;
	}
	private int shop_id;
	private int status;
	 public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	@Column(name = "followdate", nullable = false, updatable = false)
	 private Date followdate;
	 @PrePersist
	 protected void onCreate() {
	     followdate = new Date();
	 }

}

