package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.example.DoAnTotNghiepjava.entity.Product;
import com.example.DoAnTotNghiepjava.entity.ProductSale;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class ProductSaleController {
	@Autowired
	private JdbcTemplate jdbcTemplate;
	@Autowired
	com.example.DoAnTotNghiepjava.repository.ProductSaleRepository productsaleRepository;
	com.example.DoAnTotNghiepjava.repository.ProductRepository productRepository;

	/* lấy danh sách tất cả sản phẩm */
	@GetMapping("/productsales")
	public List<ProductSale> index() {
		return productsaleRepository.findAll();
	}

	/* thêm mới sản phẩm */
	@PostMapping("/productsale")
	@ResponseStatus(HttpStatus.CREATED)
	public ProductSale create(@RequestParam int product_id, @RequestParam double discount,
			@RequestParam double pricesale, @RequestParam Date datebegin, @RequestParam String promotion_name,
			@RequestParam Date dateend, @RequestParam int created_by, @RequestParam int status) throws IOException {

		ProductSale productsale = new ProductSale();
		productsale.setProductId(product_id);
		productsale.setPricesale(pricesale);
		productsale.setPromotion_name(promotion_name);
		productsale.setDiscount(discount);
		productsale.setDatebegin(datebegin);
		productsale.setDateend(dateend);
		productsale.setCreated_by(created_by);
		productsale.setStatus(status);
		return productsaleRepository.save(productsale);
	}
	/* hiển thị chi tiết sản phẩm theo id */

	@GetMapping("/productsale/{id}")
	public ResponseEntity<ProductSale> show(@PathVariable String id) {
		return ResponseEntity.of(productsaleRepository.findById(Integer.parseInt(id)));
	}

	/* lấy danh sách sản phẩm trong thùng rác */
	@GetMapping("/productsale/trash")
	public ResponseEntity<List<ProductSale>> getProductSalesInTrash() {
		List<ProductSale> productsalesalesInTrash = productsaleRepository.findByStatus(0);
		return ResponseEntity.ok(productsalesalesInTrash);
	}

	/* update sản phẩm */
	@PutMapping("/productsale/{id}")
	public ResponseEntity<ProductSale> update(@PathVariable int id, @RequestParam int product_id,
			@RequestParam double discount, @RequestParam Date datebegin, @RequestParam Date dateend,
			@RequestParam int updated_by, @RequestParam int status) throws IOException {
		try {
			Optional<ProductSale> optionalProductSale = productsaleRepository.findById(id);

			if (optionalProductSale.isPresent()) {
				ProductSale productsale = optionalProductSale.get();
				productsale.setProductId(product_id);
				productsale.setDiscount(discount);
				productsale.setDatebegin(datebegin);
				productsale.setDateend(dateend);
				productsale.setUpdated_by(updated_by);
				productsale.setStatus(status);

				productsaleRepository.save(productsale);

				return ResponseEntity.ok(productsale);
			} else {
				return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not
															// Found
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		}
	}

	@GetMapping("/products-sales-with-details/{sellerId}")
	public ResponseEntity<List<Map<String, Object>>> getProductSalesWithDetails(
			@PathVariable("sellerId") Long sellerId) {
		String sql = "SELECT s.id AS sale_id, s.pricesale, s.discount, s.datebegin, s.dateend, s.status, s.product_id, s.promotion_name, "
				+ "p.name AS product_name, p.image AS product_image, p.slug AS product_slug, p.price AS product_price, "
				+ "p.seller_id AS product_seller_id, p.stockquantity AS product_stockquantity " + "FROM productsale s "
				+ "INNER JOIN products p ON s.product_id = p.id " + "WHERE p.seller_id = ?";

		List<Map<String, Object>> flashSalesWithDetails = jdbcTemplate.queryForList(sql, sellerId);
		return ResponseEntity.ok(flashSalesWithDetails);
	}

	/* chỉnh sửa trạng thái sản phẩm */
	@PutMapping("/productsale/updatestatus/{id}")
	public ResponseEntity<ProductSale> updateStatus(@PathVariable int id) {
		try {
			Optional<ProductSale> optionalProductSale = productsaleRepository.findById(id);

			if (optionalProductSale.isPresent()) {
				ProductSale productsale = optionalProductSale.get();

				// Đảo ngược trạng thái: nếu là 1, chuyển thành 2; nếu là 2, chuyển thành 1
				if (productsale.getStatus() == 1) {
					productsale.setStatus(2);
				} else if (productsale.getStatus() == 2) {
					productsale.setStatus(1);
				} else {
					return ResponseEntity.badRequest().build(); // Trạng thái không hợp lệ, trả về 400 Bad Request
				}

				// Lưu sản phẩm đã cập nhật
				productsaleRepository.save(productsale);

				return ResponseEntity.ok(productsale);
			} else {
				return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not
															// Found
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		}
	}

	/* xóa vĩnh viễn */
	@DeleteMapping("/productsale/destroy/{id}")
	public ResponseEntity<Void> destroy(@PathVariable String id) {
		int productsaleId = Integer.parseInt(id);
		Optional<ProductSale> existingProductSale = productsaleRepository.findById(productsaleId);

		if (existingProductSale.isPresent()) {
			productsaleRepository.deleteById(productsaleId);
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	/* xóa sản phẩm vào thùng rác */
	@PutMapping("/productsale/delete/{id}")
	public ResponseEntity<ProductSale> deleteTrash(@PathVariable int id) {
		try {
			Optional<ProductSale> optionalProductSale = productsaleRepository.findById(id);

			if (optionalProductSale.isPresent()) {
				ProductSale productsale = optionalProductSale.get();

				// Thiết lập trạng thái mới cho sản phẩm là 0
				productsale.setStatus(0);

				// Lưu sản phẩm đã cập nhật
				productsaleRepository.save(productsale);

				return ResponseEntity.ok(productsale);
			} else {
				return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not
															// Found
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		}
	}

	/* khôi phục sản phẩm */
	@PutMapping("/productsale/restore/{id}")
	public ResponseEntity<ProductSale> restoreTrash(@PathVariable int id) {
		try {
			Optional<ProductSale> optionalProductSale = productsaleRepository.findById(id);

			if (optionalProductSale.isPresent()) {
				ProductSale productsale = optionalProductSale.get();

				// Thiết lập trạng thái mới cho sản phẩm là 0
				productsale.setStatus(2);

				// Lưu sản phẩm đã cập nhật
				productsaleRepository.save(productsale);

				return ResponseEntity.ok(productsale);
			} else {
				return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not
															// Found
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		}
	}
	@GetMapping("/product/sale/{productId}")
	public ResponseEntity<ProductSale> getByProductId(@PathVariable int productId) {
	    Optional<ProductSale> productSaleOpt = productsaleRepository.findByProductId(productId);

	    return productSaleOpt.map(ResponseEntity::ok)
	                         .orElseGet(() -> ResponseEntity.notFound().build());
	}


}
