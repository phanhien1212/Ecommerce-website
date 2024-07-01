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
@Table(name = "banners")
public class Banner {
	@Override
	public String toString() {
		return "Banner [id=" + id + ", name=" + name + ", image=" + image + ", link=" + link + ", position=" + position
				+ ", description=" + description + ", created_by=" + created_by + ", updated_by=" + updated_by
				+ ", status=" + status + ", created_at=" + created_at + ", updated_at=" + updated_at + "]";
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public String getLink() {
		return link;
	}
	public void setLink(String link) {
		this.link = link;
	}
	public String getPosition() {
		return position;
	}
	public void setPosition(String position) {
		this.position = position;
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
	private String name;
	private String image;
	private String link;
	private String position;
	private String description;
	private int created_by;
	private int updated_by;
	private int status;
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
