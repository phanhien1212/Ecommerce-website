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
@Table(name = "transactions")
public class Transaction {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getOrder_id() {
		return order_id;
	}
	public void setOrder_id(int order_id) {
		this.order_id = order_id;
	}
	public double getAmount() {
		return amount;
	}
	public void setAmount(double amount) {
		this.amount = amount;
	}
	public String getPayment_method() {
		return payment_method;
	}
	public void setPayment_method(String payment_method) {
		this.payment_method = payment_method;
	}
	public Date getTransaction_date() {
		return transaction_date;
	}
	public void setTransaction_date(Date transaction_date) {
		this.transaction_date = transaction_date;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	@Override
	public String toString() {
		return "Transaction [id=" + id + ", order_id=" + order_id + ", amount=" + amount + ", payment_method="
				+ payment_method + ", transaction_date=" + transaction_date + ", description=" + description + "]";
	}
	private int order_id;
	private double amount;
	private String payment_method;
	 @Column(name = "transaction_date", nullable = false, updatable = false)
	 private Date transaction_date;
	private String description;
	@PrePersist
	protected void onCreate() {
	    transaction_date = new Date();
	}
}
