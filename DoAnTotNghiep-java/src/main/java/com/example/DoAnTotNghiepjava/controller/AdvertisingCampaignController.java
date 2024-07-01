package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.DoAnTotNghiepjava.entity.AdvertisingCampaigns;
import com.example.DoAnTotNghiepjava.repository.AdvertisingCampaignRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class AdvertisingCampaignController {
	@Autowired
	AdvertisingCampaignRepository advertisingCampaignRepository;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	/* lấy danh sách tất cả danh mục */
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@GetMapping("/advertisingCampaigns")
	public List<AdvertisingCampaigns> index() {
		return advertisingCampaignRepository.findAll();
	}

	/* thêm mới 1 danh mục */
	@PostMapping("/advertisingCampaign")
	@ResponseStatus(HttpStatus.CREATED)
	public AdvertisingCampaigns create(@RequestParam int product_id, @RequestParam double budget,
			@RequestParam double bid_price, @RequestParam String keyword,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date start_date,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date end_date, @RequestParam int status)
			throws IOException {
		AdvertisingCampaigns advertisingCampaign = new AdvertisingCampaigns();
		advertisingCampaign.setProductId(product_id);
		advertisingCampaign.setBudget(budget);
		advertisingCampaign.setBidPrice(bid_price);
		advertisingCampaign.setKeyword(keyword);
		advertisingCampaign.setStart_date(start_date);
		advertisingCampaign.setEnd_date(end_date);
		advertisingCampaign.setStatus(status);

		return advertisingCampaignRepository.save(advertisingCampaign);
	}

	@GetMapping("/advertising_compaigns/{seller_id}")
	public ResponseEntity<List<Map<String, Object>>> getAdForSeller(@PathVariable("seller_id") int sellerId) {
		String sql = "SELECT ac.id AS ad_campaign_id, ac.budget, ac.bid_price, ac.keyword, ac.start_date, ac.end_date, ac.status, "
				+ "ap.id AS ad_performance_id, ap.date, ap.clicks, ap.purchases, ap.views, "
				+ "p.id AS product_id, p.name AS name_product, p.image AS product_image, p.slug AS product_slug, "
				+ "p.price AS product_price, p.status AS product_status, p.seller_id, p.stockquantity "
				+ "FROM advertising_campaigns ac "
				+ "INNER JOIN advertising_performance ap ON ac.id = ap.ad_campaign_id "
				+ "INNER JOIN products p ON ac.product_id = p.id " + "WHERE p.seller_id = ? ";

		List<Map<String, Object>> advertisement = jdbcTemplate.queryForList(sql, sellerId);
		return ResponseEntity.ok(advertisement);
	}

	/* lấy chi tiết 1 danh mục theo id */
	@GetMapping("/advertisingCampaign/{id}")
	public ResponseEntity<AdvertisingCampaigns> show(@PathVariable String id) {
		return ResponseEntity.of(advertisingCampaignRepository.findById(Integer.parseInt(id)));
	}

	/* update danh mục */
	@PutMapping("/advertisingCampaign/update/{id}")
	public ResponseEntity<AdvertisingCampaigns> update(@PathVariable int id, @RequestParam int product_id,
			@RequestParam double budget, @RequestParam double bid_price, @RequestParam String keyword,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endtime, @RequestParam int status)
			throws IOException {
		try {
			Optional<AdvertisingCampaigns> optionalAdvertisingCampaign = advertisingCampaignRepository.findById(id);

			if (optionalAdvertisingCampaign.isPresent()) {
				AdvertisingCampaigns advertisingCampaign = optionalAdvertisingCampaign.get();
				advertisingCampaign.setProductId(product_id);
				advertisingCampaign.setBudget(budget);
				advertisingCampaign.setBidPrice(bid_price);
				advertisingCampaign.setKeyword(keyword);
				advertisingCampaign.setStart_date(startTime);
				advertisingCampaign.setEnd_date(endtime);
				advertisingCampaign.setStatus(status);

				// Xử lý ảnh

				// Lưu sản phẩm đã cập n
				advertisingCampaignRepository.save(advertisingCampaign);

				return ResponseEntity.ok(advertisingCampaign);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build();
		}
	}
	@GetMapping("/orderdetails/getADOrdersSummaryBySellerId/{seller_id}")
	public ResponseEntity<List<Map<String, Object>>> getADOrdersSummaryBySellerId(@PathVariable("seller_id") int sellerId) {
	    try {
	        String sql = "SELECT ac.id AS ad_campaign_id, " +
	                     "       SUM(od.amount) AS total_amount,COUNT(od.id) AS count_amount " +
	                     "FROM orderdetails od " +
	                     "INNER JOIN products p ON od.product_id = p.id " +
	                     "INNER JOIN advertising_campaigns ac ON p.id = ac.product_id " +
	                     "INNER JOIN advertising_performance ap ON ac.id = ap.ad_campaign_id " +
	                     "WHERE od.note = 'AD' AND p.seller_id = :seller_id " +
	                     "GROUP BY ac.id";
	        MapSqlParameterSource parameters = new MapSqlParameterSource();
	        parameters.addValue("seller_id", sellerId);

	        List<Map<String, Object>> adOrdersSummary = namedParameterJdbcTemplate.queryForList(sql, parameters);
	        if (!adOrdersSummary.isEmpty()) {
	            return ResponseEntity.ok(adOrdersSummary);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}



	@PutMapping("/advertisingCampaigns/increaseClicks/{ad_campaign_id}")
	public ResponseEntity<Void> increaseClicks(@PathVariable int ad_campaign_id) {
		String sql = "UPDATE advertising_performance SET clicks = clicks + 1 WHERE ad_campaign_id = :ad_campaign_id";
		MapSqlParameterSource parameters = new MapSqlParameterSource();
		parameters.addValue("ad_campaign_id", ad_campaign_id);

		try {
			int updatedRows = namedParameterJdbcTemplate.update(sql, parameters);
			if (updatedRows > 0) {
				return ResponseEntity.ok().build();
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/* cập nhật trạng thái danh mục */
	@PutMapping("/advertisingCampaign/updatestatus/{id}")
	public ResponseEntity<AdvertisingCampaigns> updateStatus(@PathVariable int id) {
		try {
			Optional<AdvertisingCampaigns> optionalAdvertisingCampaign = advertisingCampaignRepository.findById(id);

			if (optionalAdvertisingCampaign.isPresent()) {
				AdvertisingCampaigns advertisingCampaign = optionalAdvertisingCampaign.get();

				if (advertisingCampaign.getStatus() == 1) {
					advertisingCampaign.setStatus(2);
				} else if (advertisingCampaign.getStatus() == 2) {
					advertisingCampaign.setStatus(1);
				} else {
					return ResponseEntity.badRequest().build();
				}

				advertisingCampaignRepository.save(advertisingCampaign);

				return ResponseEntity.ok(advertisingCampaign);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build();
		}
	}

	/* xóa vĩnh viễn */
	@DeleteMapping("/advertisingCampaign/destroy/{id}")
	public ResponseEntity<Void> destroy(@PathVariable String id) {
		int advertisingCampaignId = Integer.parseInt(id);
		Optional<AdvertisingCampaigns> existingAdvertisingCampaign = advertisingCampaignRepository
				.findById(advertisingCampaignId);

		if (existingAdvertisingCampaign.isPresent()) {
			advertisingCampaignRepository.deleteById(advertisingCampaignId);
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/advertisingCampaign/search")
	public ResponseEntity<List<Map<String, Object>>> searchCampaigns(@RequestParam String keyword) {
	    String sql = "SELECT ac.*, ap.*, p.*, ps.pricesale " +
	                 "FROM advertising_campaigns ac " +
	                 "INNER JOIN advertising_performance ap ON ac.id = ap.ad_campaign_id " +
	                 "INNER JOIN products p ON ac.product_id = p.id " +
	                 "LEFT JOIN productsale ps ON p.id = ps.product_id " +
	                 "WHERE ac.keyword LIKE CONCAT('%', ?, '%') " +
	                 "ORDER BY ac.bid_price DESC, ac.budget DESC " +
	                 "LIMIT 3";

	    List<Map<String, Object>> campaigns = jdbcTemplate.queryForList(sql, keyword);
	    return ResponseEntity.ok(campaigns);
	}
	/* Hàm tăng lượt xem khi tìm kiếm từ khóa trùng */
	@PutMapping("/advertisingCampaigns/increaseViews")
	public ResponseEntity<Void> increaseViews(@RequestParam String keyword) {
		String sql = "UPDATE advertising_performance ap " + "INNER JOIN ( " + "    SELECT ap.id "
				+ "    FROM advertising_performance ap "
				+ "    INNER JOIN advertising_campaigns ac ON ap.ad_campaign_id = ac.id "
				+ "    WHERE ac.keyword = :keyword " + "    ORDER BY ac.bid_price DESC, ac.budget DESC "
				+ "    LIMIT 3 " + ") as top_campaigns ON ap.id = top_campaigns.id " + "SET ap.views = ap.views + 1";
		MapSqlParameterSource parameters = new MapSqlParameterSource();
		parameters.addValue("keyword", keyword);

		try {
			int updatedRows = namedParameterJdbcTemplate.update(sql, parameters);
			if (updatedRows > 0) {
				return ResponseEntity.ok().build();
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

}
