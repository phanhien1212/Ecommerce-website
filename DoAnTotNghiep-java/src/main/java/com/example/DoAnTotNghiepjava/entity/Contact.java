package com.example.DoAnTotNghiepjava.entity;

import java.time.LocalDateTime;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "contacts")
public class Contact {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public String getMessageText() {
		return messageText;
	}
	public void setMessageText(String messageText) {
		this.messageText = messageText;
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
	@Override
	public String toString() {
		return "Contact [id=" + id + ", messageText=" + messageText + ", buyerId=" + buyerId + ", sellerId=" + sellerId
				+ ", senderId=" + senderId + ", receiverId=" + receiverId + ", status=" + status + ", created_at="
				+ created_at + "]";
	}
	
	
	  @Column(name = "message_text") // Đặt tên trường tương ứng trong cơ sở dữ liệu
	    private String messageText;
	  public int getBuyerId() {
		return buyerId;
	}
	public void setBuyerId(int buyerId) {
		this.buyerId = buyerId;
	}
	public int getSellerId() {
		return sellerId;
	}
	public void setSellerId(int sellerId) {
		this.sellerId = sellerId;
	}


	@Column(name = "buyer_id") // Đặt tên trường tương ứng trong cơ sở dữ liệu
	    private int buyerId;
	  @Column(name = "seller_id") // Đặt tên trường tương ứng trong cơ sở dữ liệu
	    private int sellerId;
	  public int getSenderId() {
		return senderId;
	}
	public void setSenderId(int senderId) {
		this.senderId = senderId;
	}
	public int getReceiverId() {
		return receiverId;
	}
	public void setReceiverId(int receiverId) {
		this.receiverId = receiverId;
	}


	@Column(name = "sender_id") // Đặt tên trường tương ứng trong cơ sở dữ liệu
	    private int senderId;
	  @Column(name = "receiver_id") // Đặt tên trường tương ứng trong cơ sở dữ liệu
	    private int receiverId;
	private int status;
	@Column(name = "created_at", nullable = false, updatable = false)
	 private Date created_at;
	@PrePersist
	protected void onCreate() {
	    created_at = new Date();
	}
}
