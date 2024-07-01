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
@Table(name = "productsale")
public class ProductSale {
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public double getDiscount() {
		return discount;
	}

	public void setDiscount(double discount) {
		this.discount = discount;
	}

	

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

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

	@Override
	public String toString() {
		return "ProductSale [id=" + id + ", productId=" + productId + ", discount=" + discount + ", pricesale="
				+ pricesale + ", promotion_name=" + promotion_name + ", datebegin=" + datebegin + ", dateend=" + dateend
				+ ", status=" + status + ", created_by=" + created_by + ", updated_by=" + updated_by + ", created_at="
				+ created_at + ", updated_at=" + updated_at + "]";
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@Column(name = "product_id")
	private int productId;

	public int getProductId() {
		return productId;
	}

	public void setProductId(int productId) {
		this.productId = productId;
	}

	private double discount;

	public double getPricesale() {
		return pricesale;
	}

	public void setPricesale(double pricesale) {
		this.pricesale = pricesale;
	}

	public String getPromotion_name() {
		return promotion_name;
	}

	public void setPromotion_name(String promotion_name) {
		this.promotion_name = promotion_name;
	}

	private double pricesale;
	private String promotion_name;
	public void setDatebegin(Date datebegin) {
		this.datebegin = datebegin;
	}

	public void setDateend(Date dateend) {
		this.dateend = dateend;
	}

	private Date datebegin;
	private Date dateend;
	private int status;
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
