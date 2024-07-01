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
@Table(name = "nofications")
public class Nofication {
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	
	public Date getCreated_at() {
		return created_at;
	}
	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getLink() {
		return link;
	}
	public void setLink(String link) {
		this.link = link;
	}
	@Override
	public String toString() {
		return "Nofication [id=" + id + ", title=" + title + ", content=" + content + ", recipientId=" + recipientId
				+ ", created_at=" + created_at + ", status=" + status + ", role=" + role + ", link=" + link + "]";
	}
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	private String title;
	private String content;
	 
	public int getRecipientId() {
		return recipientId;
	}
	public void setRecipientId(int recipientId) {
		this.recipientId = recipientId;
	}
	@Column(name = "recipient_id") // Đặt tên trường tương ứng trong cơ sở dữ liệu
	    private int recipientId;
	
	@Column(name = "created_at", nullable = false, updatable = false)
	 private Date created_at;
	 @PrePersist
	    protected void onCreate() {
	        created_at = new Date();
	    }
	    private int status;
	    public String getRole() {
			return role;
		}
		public void setRole(String role) {
			this.role = role;
		}
		private String role;
	   
		private String link;
}

