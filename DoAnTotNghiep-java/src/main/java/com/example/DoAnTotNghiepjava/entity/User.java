package com.example.DoAnTotNghiepjava.entity;

import java.math.BigDecimal;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
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
@Table(name = "users")
public class User {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	 public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getCreated_by() {
		return created_by;
	}
	public void setCreated_by(int created_by) {
		this.created_by = created_by;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public int getUpdated_by() {
		return updated_by;
	}
	public void setUpdated_by(int updated_by) {
		this.updated_by = updated_by;
	}
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
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
		return "User [id=" + id + ", created_by=" + created_by + ", status=" + status + ", updated_by=" + updated_by
				+ ", firstname=" + firstname + ", lastname=" + lastname + ", username=" + username + ", gender="
				+ gender + ", phone=" + phone + ", email=" + email + ", longitude=" + longitude + ", latitude="
				+ latitude + ", role=" + role + ", address=" + address + ", image=" + image + ", password=" + password
				+ ", created_at=" + created_at + ", updated_at=" + updated_at + "]";
	}
	private int created_by=1;
	 private int status;
	 private int updated_by=1;
	 private String firstname;
	 private String lastname;
	 private String username;
	 private String gender;
	 private String phone;
	 private String email;
	 public BigDecimal getLongitude() {
		return longitude;
	}
	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}
	public BigDecimal getLatitude() {
		return latitude;
	}
	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}
	private BigDecimal longitude;
	 private BigDecimal latitude;
	 private String role;
	 private String address;
	 private String image;
	 private String password;
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
public String getPassword() {
    return password;
}
public void setPassword(String password) {
    this.password = hashPassword(password);
}
private String hashPassword(String password) {
    try {
        // Create MessageDigest instance for SHA-1
        MessageDigest md = MessageDigest.getInstance("SHA-1");

        // Add password bytes to digest
        md.update(password.getBytes());

        // Get the hashed password bytes
        byte[] bytes = md.digest();

        // Convert bytes to hexadecimal format
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(Integer.toString((b & 0xff) + 0x100, 16).substring(1));
        }

        // Return the hashed password
        return sb.toString();
    } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
        return null; // Handle the error appropriately
    }
}
}
