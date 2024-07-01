package com.example.DoAnTotNghiepjava.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "flashsales")
public class FlashSale {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getProductId() {
		return productId;
	}
	public void setProductId(int productId) {
		this.productId = productId;
	}
	public double getPriceSale() {
		return priceSale;
	}
	public void setPriceSale(double priceSale) {
		this.priceSale = priceSale;
	}
	public double getDiscount() {
		return discount;
	}
	public void setDiscount(double discount) {
		this.discount = discount;
	}
	public Date getStartTime() {
		return startTime;
	}
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	public Date getEndTime() {
		return endTime;
	}
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	@Override
	public String toString() {
		return "FlashSale [id=" + id + ", productId=" + productId + ", priceSale=" + priceSale + ", discount="
				+ discount + ", startTime=" + startTime + ", endTime=" + endTime + ", status=" + status + "]";
	}
	@Column(name = "product_id") // Đặt tên trường tương ứng trong cơ sở dữ liệu
    private int productId;
	@Column(name = "price_sale") // Đặt tên trường tương ứng trong cơ sở dữ liệu
    private double priceSale;
	private double discount;
	@Column(name = "start_time") // Đặt tên trường tương ứng trong cơ sở dữ liệu
    private Date startTime;
	@Column(name = "end_time") // Đặt tên trường tương ứng trong cơ sở dữ liệu
    private Date endTime;
	private int status;
}
