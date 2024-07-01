package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.math.BigDecimal;
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

import com.example.DoAnTotNghiepjava.entity.AdvertisingAccount;
import com.example.DoAnTotNghiepjava.repository.AdvertisingAccountRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class AdvertisingAccountController {
	@Autowired
	AdvertisingAccountRepository advertisingAccountRepository;
	/* lấy danh sách tất cả danh mục */
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@GetMapping("/advertisingAccounts")
	public List<AdvertisingAccount> index() {
		return advertisingAccountRepository.findAll();
	}

	/* thêm mới 1 danh mục */
	@PostMapping("/advertisingAccount")
	@ResponseStatus(HttpStatus.CREATED)
	public AdvertisingAccount createOrUpdate(@RequestParam int user_id, @RequestParam BigDecimal balance)
			throws IOException {
		Optional<AdvertisingAccount> existingAccountOptional = advertisingAccountRepository.findByUserId(user_id);

		if (existingAccountOptional.isPresent()) {
			AdvertisingAccount existingAccount = existingAccountOptional.get();
			BigDecimal currentBalance = existingAccount.getBalance();
			BigDecimal newBalance = currentBalance.add(balance); // Cộng thêm balance vào số dư hiện tại
			existingAccount.setBalance(newBalance);
			return advertisingAccountRepository.save(existingAccount);
		} else {
			AdvertisingAccount newAccount = new AdvertisingAccount();
			newAccount.setUserId(user_id);
			newAccount.setBalance(balance);
			return advertisingAccountRepository.save(newAccount);
		}
	}

	/* lấy chi tiết 1 danh mục theo id */
	@GetMapping("/advertisingAccount/{user_id}")
	public ResponseEntity<AdvertisingAccount> show(@PathVariable String user_id) {
		return ResponseEntity.of(advertisingAccountRepository.findByUserId(Integer.parseInt(user_id)));
	}
	@PutMapping("/updateBalance/{user_id}/{amount}")
	public void deductBalance(@PathVariable("user_id") int userId, @PathVariable("amount") BigDecimal amount) {
	    Optional<AdvertisingAccount> accountOptional = advertisingAccountRepository.findByUserId(userId);

	    if (accountOptional.isPresent()) {
	        AdvertisingAccount account = accountOptional.get();
	        BigDecimal currentBalance = account.getBalance();

	        // Kiểm tra xem số dư hiện tại có đủ để trừ không
	        if (currentBalance.compareTo(amount) >= 0) {
	            BigDecimal newBalance = currentBalance.subtract(amount);
	            account.setBalance(newBalance);
	            advertisingAccountRepository.save(account);
	        } else {
	            // Xử lý trường hợp không đủ số dư
	            throw new IllegalArgumentException("Insufficient balance");
	        }
	    } else {
	        // Xử lý trường hợp không tìm thấy tài khoản
	        throw new IllegalArgumentException("Account not found");
	    }
	}


	/* update danh mục */
//	  @PutMapping("/advertisingAccount/update/{id}")
//	  public ResponseEntity<AdvertisingAccount> update(@PathVariable int id,
//			  @RequestParam int product_id,
//   			@RequestParam double budget,
//   			@RequestParam double bid_price,
//   			@RequestParam String keyword,
//   			@RequestParam @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss") Date startTime,
//   			@RequestParam @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss") Date endtime,
//   			@RequestParam int status
//	                                      ) throws IOException {
//	      try {
//	          Optional<AdvertisingAccount> optionalAdvertisingAccount = advertisingAccountRepository.findById(id);
//
//	          if (optionalAdvertisingAccount.isPresent()) {
//	              AdvertisingAccount advertisingAccount = optionalAdvertisingAccount.get();
//	              advertisingAccount.setProductId(product_id);
//	    	      advertisingAccount.setBudget(budget);
//	    	      advertisingAccount.setBidPrice(bid_price);
//	    	      advertisingAccount.setKeyword(keyword);
//	    	      advertisingAccount.setStart_date(startTime);
//	    	      advertisingAccount.setEnd_date(endtime);
//	    	      advertisingAccount.setStatus(status);
//
//	              // Xử lý ảnh
//	             
//	              // Lưu sản phẩm đã cập n
//	              advertisingAccountRepository.save(advertisingAccount);
//
//	              return ResponseEntity.ok(advertisingAccount);
//	          } else {
//	              return ResponseEntity.notFound().build(); 
//	          }
//	      } catch (Exception e) {
//	          return ResponseEntity.status(500).build(); 
//	      }
//	  }
	/* cập nhật trạng thái danh mục */

	/* xóa vĩnh viễn */
	@DeleteMapping("/advertisingAccount/destroy/{id}")
	public ResponseEntity<Void> destroy(@PathVariable String id) {
		int advertisingAccountId = Integer.parseInt(id);
		Optional<AdvertisingAccount> existingAdvertisingAccount = advertisingAccountRepository
				.findById(advertisingAccountId);

		if (existingAdvertisingAccount.isPresent()) {
			advertisingAccountRepository.deleteById(advertisingAccountId);
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	
}
