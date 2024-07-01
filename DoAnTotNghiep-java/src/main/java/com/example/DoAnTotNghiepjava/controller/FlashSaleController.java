package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
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

import com.example.DoAnTotNghiepjava.entity.FlashSale;
import com.example.DoAnTotNghiepjava.entity.Product;
import com.example.DoAnTotNghiepjava.repository.FlashSaleRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class FlashSaleController {
	@Autowired
	 private JdbcTemplate jdbcTemplate;
	@Autowired
	FlashSaleRepository flashSaleRepository;
	/*lấy danh sách tất cả danh mục*/
	  @GetMapping("/flashsale")
	  public List<FlashSale> index(){
	      return (List<FlashSale>) flashSaleRepository.findAll();
	  }
	  @PostMapping("/flashsale")
	  @ResponseStatus(HttpStatus.CREATED)
	  public FlashSale create(
	          @RequestParam double priceSale,
	          @RequestParam double discount,
	          @RequestParam @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss") Date startTime,
	          @RequestParam @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss") Date endTime,
	          @RequestParam int status,
	          @RequestParam int productId) throws IOException {
	      FlashSale flashsale = new FlashSale();
	      flashsale.setPriceSale(priceSale);
	      flashsale.setDiscount(discount);
	      flashsale.setStartTime(startTime);
	      flashsale.setEndTime(endTime);
	      flashsale.setStatus(status);
	      flashsale.setProductId(productId);
	      return flashSaleRepository.save(flashsale);
	  }
	
	  @GetMapping("/flash-sales-with-details/{sellerId}")
	  public ResponseEntity<List<Map<String, Object>>> getFlashSalesWithDetails(@PathVariable("sellerId") Long sellerId) {
	      String sql = "SELECT fs.id AS flashsale_id, fs.price_sale, fs.discount, fs.start_time, fs.end_time, fs.status, fs.product_id, " +
	                   "p.name AS product_name, p.image AS product_image, p.slug AS product_slug, p.price AS product_price, " +
	                   "p.seller_id AS product_seller_id, p.stockquantity AS product_stockquantity " +
	                   "FROM flashsales fs " +
	                   "INNER JOIN products p ON fs.product_id = p.id " +
	                   "WHERE p.seller_id = ?";
	      
	      List<Map<String, Object>> flashSalesWithDetails = jdbcTemplate.queryForList(sql, sellerId);
	      return ResponseEntity.ok(flashSalesWithDetails);
	  }
	  @GetMapping("/flash-sales-with-details")
	  public ResponseEntity<List<Map<String, Object>>> getFlashSales() {
	      String sql = "SELECT fs.id AS flashsale_id, fs.price_sale, fs.discount, fs.start_time, fs.end_time, fs.status, fs.product_id, " +
	                   "p.name AS product_name, p.image AS product_image, p.slug AS product_slug, p.price AS product_price, " +
	                   "p.seller_id AS product_seller_id, p.stockquantity AS product_stockquantity " +
	                   "FROM flashsales fs " +
	                   "INNER JOIN products p ON fs.product_id = p.id";

	      List<Map<String, Object>> flashSalesWithDetails = jdbcTemplate.queryForList(sql);
	      return ResponseEntity.ok(flashSalesWithDetails);
	  }


	  @PutMapping("/flashsale/updatestatus/{id}")
	   public ResponseEntity<FlashSale> updateStatus(@PathVariable int id) {
	       try {
	           Optional<FlashSale> optionalFlashSale = flashSaleRepository.findById(id);
	           
	           if (optionalFlashSale.isPresent()) {
	               FlashSale flashsale = optionalFlashSale.get();
	               
	               // Đảo ngược trạng thái: nếu là 1, chuyển thành 2; nếu là 2, chuyển thành 1
	               if (flashsale.getStatus() == 1) {
	                   flashsale.setStatus(2);
	               } else if (flashsale.getStatus() == 2) {
	                   flashsale.setStatus(1);
	               } else {
	                   return ResponseEntity.badRequest().build(); // Trạng thái không hợp lệ, trả về 400 Bad Request
	               }
	               
	               // Lưu sản phẩm đã cập nhật
	               flashSaleRepository.save(flashsale);
	               
	               return ResponseEntity.ok(flashsale);
	           } else {
	               return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	           }
	       } catch (Exception e) {
	           return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	       }
	   }


	  /*xóa vĩnh viễn*/
	  @DeleteMapping("/flashsale/destroy/{id}")
	    public ResponseEntity<Void> destroy(@PathVariable String id) {
	        int flashSaleId = Integer.parseInt(id);
	        Optional<FlashSale> existingFlashSale = flashSaleRepository.findById(flashSaleId);

	        if (existingFlashSale.isPresent()) {
	            flashSaleRepository.deleteById(flashSaleId);
	            return ResponseEntity.noContent().build();
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
}
