package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.DoAnTotNghiepjava.entity.Product;
import com.example.DoAnTotNghiepjava.entity.ProductAttribute;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class ProductAttributeController {
	@Autowired
	com.example.DoAnTotNghiepjava.repository.ProductAttributeRepository productAttributeRepository;

	/* lấy danh sách tất cả sản phẩm */
	@GetMapping("/productAttributes")
	public List<ProductAttribute> index() {
		return productAttributeRepository.findAll();
	}

	/* thêm mới sản phẩm */
	@PostMapping("/productAttribute")
	@ResponseStatus(HttpStatus.CREATED)
	public ProductAttribute create(@RequestParam(required = false) Integer product_id,
			@RequestParam(required = false) String attribute_name1,
			@RequestParam(required = false) String attribute_name2,
			@RequestParam(required = false) String attribute_value1,
			@RequestParam(required = false) String attribute_value2) throws IOException {

		ProductAttribute productAttribute = new ProductAttribute();
		if (product_id != null) {
			productAttribute.setProductId(product_id);
		}
		productAttribute.setAttribute_name1(attribute_name1);
		productAttribute.setAttribute_name2(attribute_name2);
		productAttribute.setAttribute_value1(attribute_value1);
		productAttribute.setAttribute_value2(attribute_value2);

		return productAttributeRepository.save(productAttribute);
	}

	/* hiển thị chi tiết sản phẩm theo id */

	@GetMapping("/productAttribute/{id}")
	public ResponseEntity<ProductAttribute> show(@PathVariable String id) {
		return ResponseEntity.of(productAttributeRepository.findById(Integer.parseInt(id)));
	}

	/* update sản phẩm */
	@PutMapping("/productAttribute/{id}")
	public ResponseEntity<ProductAttribute> update(@PathVariable int id, @RequestParam int product_id,
			@RequestParam String attributeName1, @RequestParam String attributeName2,
			@RequestParam String attributeValue2, @RequestParam String attributeValue1) throws IOException {
		try {
			Optional<ProductAttribute> optionalProductAttribute = productAttributeRepository.findById(id);

			if (optionalProductAttribute.isPresent()) {
				ProductAttribute productAttribute = optionalProductAttribute.get();
				productAttribute.setProductId(product_id);
				productAttribute.setAttribute_name1(attributeName1);
				productAttribute.setAttribute_name1(attributeName2);
				productAttribute.setAttribute_value1(attributeValue1);
				productAttribute.setAttribute_value2(attributeValue2);
				// Lưu sản phẩm đã cập nhật
				productAttributeRepository.save(productAttribute);

				return ResponseEntity.ok(productAttribute);
			} else {
				return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not
															// Found
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		}
	}
	/* Lấy Thuộc Tính Sản Phẩm Theo ProductId */

	@GetMapping("/product/attribute/{productId}")
	public ResponseEntity<ProductAttribute> getByProductId(@PathVariable int productId) {
		List<ProductAttribute> attribute = productAttributeRepository.findByProductId(productId);

		if (!attribute.isEmpty()) {
			return ResponseEntity.ok(attribute.get(0));
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	/* xóa vĩnh viễn */
	@DeleteMapping("/productAttribute/destroy/{id}")
	public ResponseEntity<Void> destroy(@PathVariable String id) {
		int productAttributeId = Integer.parseInt(id);
		Optional<ProductAttribute> existingProductAttribute = productAttributeRepository.findById(productAttributeId);

		if (existingProductAttribute.isPresent()) {
			productAttributeRepository.deleteById(productAttributeId);
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	

}
