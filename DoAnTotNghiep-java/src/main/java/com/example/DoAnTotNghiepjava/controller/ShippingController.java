package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.DoAnTotNghiepjava.entity.OrderDetail;
import com.example.DoAnTotNghiepjava.entity.Shipping;
import com.example.DoAnTotNghiepjava.entity.Shipping;
import com.example.DoAnTotNghiepjava.entity.Shipping;
import com.example.DoAnTotNghiepjava.entity.Shipping;
import com.example.DoAnTotNghiepjava.repository.ShippingRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class ShippingController {
	@Autowired
	ShippingRepository shippingRepository;

	/* lấy danh sách tất cả danh mục */
	@GetMapping("/shippings")
	public List<Shipping> index() {
		return shippingRepository.findAll();
	}

	/* thêm mới 1 danh mục */
	 @PostMapping("/shipping")
	    public Shipping create(@RequestBody Shipping shipping) {
	        return shippingRepository.save(shipping);
	    }
	/* lấy chi tiết 1 danh mục theo id */
	@GetMapping("/shipping/{id}")
	public ResponseEntity<Shipping> show(@PathVariable String id) {
		return ResponseEntity.of(shippingRepository.findById(Integer.parseInt(id)));
	}
	/* update danh mục */

	@PutMapping("/shipping/{id}")
	public ResponseEntity<Shipping> update(@PathVariable int id, @RequestParam int customer_id,
			@RequestParam int order_id, @RequestParam double shipping_cost, @RequestParam String shipping_address,
			@RequestParam String shipping_method, @RequestParam int status) throws IOException {
		try {
			Optional<Shipping> optionalShipping = shippingRepository.findById(id);

			if (optionalShipping.isPresent()) {
				Shipping shipping = optionalShipping.get();
				shipping.setCustomer_id(customer_id);
				shipping.setOrder_id(order_id);
				shipping.setShipping_method(shipping_method);
				shipping.setShipping_cost(shipping_cost);
				shipping.setShipping_address(shipping_address);
				shipping.setShipping_method(shipping_method);

				shippingRepository.save(shipping);

				return ResponseEntity.ok(shipping);
			} else {
				return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not
															// Found
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		}
	}

	/* chỉnh sửa trạng thái sản phẩm */
	@PutMapping("/shipping/updatestatus/{id}")
	public ResponseEntity<Shipping> updateStatus(@PathVariable int id, @RequestParam int status) {
		try {
			Optional<Shipping> optionalShipping = shippingRepository.findById(id);

			if (optionalShipping.isPresent()) {
				Shipping shipping = optionalShipping.get();

				// Cập nhật trạng thái của đơn hàng
				shipping.setStatus(status);

				// Lưu cập nhật trạng thái vào cơ sở dữ liệu
				shippingRepository.save(shipping);

				return ResponseEntity.ok(shipping);
			} else {
				// Trả về lỗi nếu không tìm thấy đơn hàng
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			// Trả về lỗi nếu có lỗi xảy ra trong quá trình xử lý
			return ResponseEntity.status(500).build();
		}
	}

	/* xóa vĩnh viễn */
	@DeleteMapping("/shipping/destroy/{id}")
	public ResponseEntity<Void> destroy(@PathVariable String id) {
		int shippingId = Integer.parseInt(id);
		Optional<Shipping> existingShipping = shippingRepository.findById(shippingId);

		if (existingShipping.isPresent()) {
			shippingRepository.deleteById(shippingId);
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.notFound().build();
		}
	}

}