package com.example.DoAnTotNghiepjava.entity;

import java.math.BigDecimal;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "advertising_account")
public class AdvertisingAccount {
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public BigDecimal getBalance() {
		return balance;
	}
	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}
	public Date getCreated_at() {
		return created_at;
	}
	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}
	public Date getUpdated_at() {
		return updated_at;
	}
	public void setUpdated_at(Date updated_at) {
		this.updated_at = updated_at;
	}
	@Override
	public String toString() {
		return "AdvertisingAccount [id=" + id + ", userId=" + userId + ", balance=" + balance + ", created_at="
				+ created_at + ", updated_at=" + updated_at + "]";
	}
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@Column(name = "user_id")
	private int userId;
	private BigDecimal balance;
	@Column(name = "created_at", nullable = false, updatable = false)
	 private Date created_at;
@Column(name = "updated_at", nullable = false)
private Date updated_at;
	@PrePersist
    protected void onCreate() {
        created_at = new Date();
        updated_at = new Date();
    }
 @PreUpdate
    protected void onUpdate() {
        updated_at = new Date();
    }
}
