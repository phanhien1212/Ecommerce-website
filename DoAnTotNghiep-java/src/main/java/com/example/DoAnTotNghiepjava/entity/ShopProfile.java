package com.example.DoAnTotNghiepjava.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "shopprofiles")
public class ShopProfile {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	@Override
	public String toString() {
		return "ShopProfile [id=" + id + ", idSeller=" + idSeller + ", name=" + name + ", email=" + email
				+ ", latitude=" + latitude + ", longitude=" + longitude + ", phone=" + phone + ", address=" + address
				+ ", image=" + image + "]";
	}
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
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	  public int getIdSeller() {
		return idSeller;
	}
	public void setIdSeller(int idSeller) {
		this.idSeller = idSeller;
	}
	@Column(name = "id_seller") // Đặt tên trường tương ứng trong cơ sở dữ liệu
	private int idSeller;
	private String name;
	private String email;
	private BigDecimal latitude;
	public BigDecimal getLatitude() {
		return latitude;
	}
	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}
	public BigDecimal getLongitude() {
		return longitude;
	}
	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}
	private BigDecimal longitude;
	private String phone;
	private String address;
	private String image;
}
