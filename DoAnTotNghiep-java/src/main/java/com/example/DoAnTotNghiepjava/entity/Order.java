package com.example.DoAnTotNghiepjava.entity;

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
@Table(name = "orders")
public class Order {
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

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getDeliveryAddress() {
		return deliveryAddress;
	}

	public void setDeliveryAddress(String deliveryAddress) {
		this.deliveryAddress = deliveryAddress;
	}

	public String getDeliveryName() {
		return deliveryName;
	}

	public void setDeliveryName(String deliveryName) {
		this.deliveryName = deliveryName;
	}

	public String getDeliveryPhone() {
		return deliveryPhone;
	}

	public void setDeliveryPhone(String deliveryPhone) {
		this.deliveryPhone = deliveryPhone;
	}

	public String getDeliveryEmail() {
		return deliveryEmail;
	}

	public void setDeliveryEmail(String deliveryEmail) {
		this.deliveryEmail = deliveryEmail;
	}

	public double getTotal() {
		return total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "Order [id=" + id + ", user_id=" + user_id + ", note=" + note + ", deliveryAddress=" + deliveryAddress
				+ ", deliveryName=" + deliveryName + ", deliveryPhone=" + deliveryPhone + ", deliveryEmail="
				+ deliveryEmail + ", total=" + total + ", status=" + status + ", created_by=" + created_by
				+ ", updated_by=" + updated_by + ", created_at=" + created_at + ", updated_at=" + updated_at + "]";
	}

	private int user_id;
	private String note;
	@Column(name = "delivery_address")
	private String deliveryAddress;
	@Column(name = "delivery_name")
	private String deliveryName;
	@Column(name = "delivery_phone")
	private String deliveryPhone;
	@Column(name = "delivery_email")
	private String deliveryEmail;
	private double total;
	private int status;

	public int getCreated_by() {
		return created_by;
	}

	public void setCreated_by(int created_by) {
		this.created_by = created_by;
	}

	public int getUpdated_by() {
		return updated_by;
	}

	public void setUpdated_by(int updated_by) {
		this.updated_by = updated_by;
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

	private int created_by = 1;
	private int updated_by = 1;
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
