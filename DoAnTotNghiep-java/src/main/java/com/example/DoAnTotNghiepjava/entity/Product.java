package com.example.DoAnTotNghiepjava.entity;

import java.text.Normalizer;
import java.util.Date;
import java.util.Locale;
import java.util.regex.Pattern;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
	@Override
	public String toString() {
		return "Product [id=" + id + ", created_at=" + created_at + ", updated_at=" + updated_at + ", name=" + name
				+ ", slug=" + slug + ", price=" + price + ", image=" + image + ", detail=" + detail + ", description="
				+ description + ", created_by=" + created_by + ", updated_by=" + updated_by + ", attribute_id="
				+ ", status=" + status + ", category_id=" + category_id + ", seller_id=" + seller_id
				+ ", stockquantity=" + stockquantity + "]";
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public int getCategory_id() {
		return category_id;
	}

	public void setCategory_id(int category_id) {
		this.category_id = category_id;
	}

	@Column(name = "created_at", nullable = false, updatable = false)
	private Date created_at;
	@Column(name = "updated_at", nullable = false)
	private Date updated_at;
	private String name;
	@Column(unique = true)
	private String slug;
	private double price;
	private String image;
	private String detail;
	private String description;
	private int created_by;
	private int updated_by = 0;

	private int status;
	private int category_id;

	public int getSeller_id() {
		return seller_id;
	}

	public void setSeller_id(int seller_id) {
		this.seller_id = seller_id;
	}

	public int getStockquantity() {
		return stockquantity;
	}

	public void setStockquantity(int stockquantity) {
		this.stockquantity = stockquantity;
	}

	private int seller_id;
	private int stockquantity;

	@PrePersist
	protected void onCreate() {
		created_at = new Date();
		updated_at = new Date();
		slug = createSlug(name);
	}

	@PreUpdate
	protected void onUpdate() {
		updated_at = new Date();
	}

	private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
	private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

	private String createSlug(String input) {
		String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
		String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
		String slug = NONLATIN.matcher(normalized).replaceAll("");
		return slug.toLowerCase(Locale.ENGLISH);
	}
}