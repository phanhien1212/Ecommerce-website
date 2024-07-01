package com.example.DoAnTotNghiepjava.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "advertising_campaigns")
public class AdvertisingCampaigns {
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public double getBudget() {
		return budget;
	}

	public void setBudget(double budget) {
		this.budget = budget;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public Date getStart_date() {
		return start_date;
	}

	public void setStart_date(Date start_date) {
		this.start_date = start_date;
	}

	public Date getEnd_date() {
		return end_date;
	}

	public void setEnd_date(Date end_date) {
		this.end_date = end_date;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "AdvertisingCampaigns [id=" + id + ", productId=" + productId + ", budget=" + budget + ", bidPrice="
				+ bidPrice + ", keyword=" + keyword + ", start_date=" + start_date + ", end_date=" + end_date
				+ ", status=" + status  + "]";
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	public double getBidPrice() {
		return bidPrice;
	}

	public void setBidPrice(double bidPrice) {
		this.bidPrice = bidPrice;
	}

	

	@Column(name = "product_id") // Đặt tên trường tương ứng trong cơ sở dữ liệu
	private int productId;

	public void setProductId(int productId) {
		this.productId = productId;
	}

	private double budget;
	@Column(name = "bid_price")
	private double bidPrice;
	private String keyword;
	private Date start_date;
	private Date end_date;
	private int status;
	
}
