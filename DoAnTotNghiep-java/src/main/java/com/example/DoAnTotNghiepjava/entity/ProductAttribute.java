package com.example.DoAnTotNghiepjava.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "productattributes")
public class ProductAttribute {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	@Override
	public String toString() {
		return "ProductAttribute [id=" + id + ", productId=" + productId + ", attribute_name1=" + attribute_name1
				+ ", attribute_name2=" + attribute_name2 + ", attribute_value1=" + attribute_value1
				+ ", attribute_value2=" + attribute_value2 + "]";
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public String getAttribute_name1() {
		return attribute_name1;
	}
	public void setAttribute_name1(String attribute_name1) {
		this.attribute_name1 = attribute_name1;
	}
	public String getAttribute_name2() {
		return attribute_name2;
	}
	public void setAttribute_name2(String attribute_name2) {
		this.attribute_name2 = attribute_name2;
	}
	public String getAttribute_value1() {
		return attribute_value1;
	}
	public void setAttribute_value1(String attribute_value1) {
		this.attribute_value1 = attribute_value1;
	}
	public String getAttribute_value2() {
		return attribute_value2;
	}
	public void setAttribute_value2(String attribute_value2) {
		this.attribute_value2 = attribute_value2;
	}
	 public int getProductId() {
		return productId;
	}
	public void setProductId(int productId) {
		this.productId = productId;
	}
	@Column(name = "product_id")
	    private int productId;
	private String attribute_name1;
	private String attribute_name2;
	private String attribute_value1;
	private String attribute_value2;
}
