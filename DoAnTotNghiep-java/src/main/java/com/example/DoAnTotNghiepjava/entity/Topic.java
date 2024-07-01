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
@Table(name = "topics")
public class Topic {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getSort_order() {
		return sort_order;
	}
	public void setSort_order(int sort_order) {
		this.sort_order = sort_order;
	}
	public int getUpdated_by() {
		return updated_by;
	}
	public void setUpdated_by(int updated_by) {
		this.updated_by = updated_by;
	}
	public int getCreated_by() {
		return created_by;
	}
	public void setCreated_by(int created_by) {
		this.created_by = created_by;
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
		return "Topic [id=" + id + ", name=" + name + ", slug=" + slug + ", description=" + description
				+ ", sort_order=" + sort_order + ", status=" + status + ", updated_by=" + updated_by + ", created_by="
				+ created_by + ", created_at=" + created_at + ", updated_at=" + updated_at + "]";
	}
	private String name;
	 @Column(unique = true)
	 private String slug;
	private String description;
	private int sort_order;
	private int status;
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	private int updated_by=1;
	private int created_by=1;
	@Column(name = "created_at", nullable = false, updatable = false)
	 private Date created_at;
@Column(name = "updated_at", nullable = false)
private Date updated_at;
@PrePersist
protected void onCreate() {
    created_at = new Date();
    updated_at = new Date();
    slug = createSlug(name);
}
@PreUpdate
protected void onUpdate() {
    updated_at = new Date();
    slug = createSlug(name);
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
