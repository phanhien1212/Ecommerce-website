package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.DoAnTotNghiepjava.entity.AdvertisingPerformance;
import com.example.DoAnTotNghiepjava.entity.OrderDetail;
import com.example.DoAnTotNghiepjava.repository.AdvertisingPerformanceRepository;
import com.example.DoAnTotNghiepjava.repository.OrderDetailRepository;
@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class AdvertisingPerformanceController {
	@Autowired
	OrderDetailRepository orderDetailRepository;
	@Autowired
    private DataSource dataSource;
	@Autowired
	AdvertisingPerformanceRepository advertisingPerformance;
	 @PostMapping("/advertisingPerformance")
	  @ResponseStatus(HttpStatus.CREATED)
	  public AdvertisingPerformance create(@RequestParam int ad_campaign_id,
	         			@RequestParam int clicks,
	         			@RequestParam int purchases,
	         			@RequestParam int views,
	         			@RequestParam @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss") Date date) throws IOException {
	      AdvertisingPerformance advertisingCampaign = new AdvertisingPerformance();
	      advertisingCampaign.setAdCampaignId(ad_campaign_id);
	      advertisingCampaign.setClicks(clicks);
	      advertisingCampaign.setPurchases(purchases);
	      advertisingCampaign.setViews(views);
	      advertisingCampaign.setDate(date);
	   
	  
	      return advertisingPerformance.save(advertisingCampaign);
	  }
	 
}
