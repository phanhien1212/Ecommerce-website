package com.example.DoAnTotNghiepjava.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "advertising_performance")
public class AdvertisingPerformance {
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getAdCampaignId() {
		return adCampaignId;
	}
	public void setAdCampaignId(int adCampaignId) {
		this.adCampaignId = adCampaignId;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public int getClicks() {
		return clicks;
	}
	public void setClicks(int clicks) {
		this.clicks = clicks;
	}
	public int getPurchases() {
		return purchases;
	}
	public void setPurchases(int purchases) {
		this.purchases = purchases;
	}
	@Override
	public String toString() {
		return "AdvertisingPerformance [id=" + id + ", adCampaignId=" + adCampaignId + ", date=" + date + ", clicks="
				+ clicks + ", purchases=" + purchases + ", views=" + views + "]";
	}
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@Column(name = "ad_campaign_id")
	private int adCampaignId;
	private Date date;
	private int clicks;
	private int purchases;
	private int views;
	public int getViews() {
		return views;
	}
	public void setViews(int views) {
		this.views = views;
	}
	
}
