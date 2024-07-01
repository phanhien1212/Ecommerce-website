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
@Table(name = "orderdetails")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "order_id")
    private int orderId;

    @Column(name = "product_id")
    private int productId;

    private int qty;
    public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	private int status;
	private String note;
    public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	private double discount;
    private double amount;
    private double price;
    private String attribute;

    public String getAttribute() {
		return attribute;
	}

	public void setAttribute(String attribute) {
		this.attribute = attribute;
	}

	@Column(name = "created_at", nullable = false, updatable = false)
    private Date created_at;

    @Column(name = "updated_at", nullable = false)
    private Date updated_at;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getQty() {
        return qty;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
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
		return "OrderDetail [id=" + id + ", orderId=" + orderId + ", productId=" + productId + ", qty=" + qty
				+ ", status=" + status + ", note=" + note + ", discount=" + discount + ", amount=" + amount + ", price="
				+ price + ", attribute=" + attribute + ", created_at=" + created_at + ", updated_at=" + updated_at
				+ "]";
	}

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
