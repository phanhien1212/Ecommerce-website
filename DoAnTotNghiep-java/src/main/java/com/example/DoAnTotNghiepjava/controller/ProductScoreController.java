package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.DoAnTotNghiepjava.entity.Product;
import com.example.DoAnTotNghiepjava.entity.ProductSale;
import com.example.DoAnTotNghiepjava.entity.ProductScore;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class ProductScoreController {
	@Autowired
	com.example.DoAnTotNghiepjava.repository.ProductScoreRepository productScoreRepository;
	@Autowired
	com.example.DoAnTotNghiepjava.repository.ProductRepository productRepository;
	@Autowired
	com.example.DoAnTotNghiepjava.repository.ProductSaleRepository productsaleRepository;
	@Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	private JdbcTemplate jdbcTemplate;

	  public static class SellerScore {
	        private String sellerName;
	        private int totalScore;

	        public SellerScore(String sellerName, int totalScore) {
	            this.sellerName = sellerName;
	            this.totalScore = totalScore;
	        }

	        public String getSellerName() {
	            return sellerName;
	        }

	        public int getTotalScore() {
	            return totalScore;
	        }
	  }

	/* lấy danh sách tất cả sản phẩm */
	@GetMapping("/productScores")
	public List<ProductScore> index() {
		return productScoreRepository.findAll();
	}

	/* thêm mới sản phẩm */
	@PostMapping("/productScore")
	@ResponseStatus(HttpStatus.CREATED)
	public ProductScore create(@RequestParam int product_id, @RequestParam int category_id,

			@RequestParam int score) throws IOException {

		ProductScore productScore = new ProductScore();
		productScore.setProductId(product_id);
		productScore.setCategoryId(category_id);
		productScore.setScore(score);
		return productScoreRepository.save(productScore);
	}

	@PostMapping("/addProductScore")
	@ResponseStatus(HttpStatus.OK)
	public ProductScore addScore(@RequestParam int product_id, @RequestParam int score) {
		Optional<ProductScore> optionalProductScore = productScoreRepository.findByProductId(product_id);

		if (optionalProductScore.isPresent()) {
			ProductScore productScore = optionalProductScore.get();
			productScore.setScore(productScore.getScore() + score);
			return productScoreRepository.save(productScore);
		} else {
			// Xử lý khi không tìm thấy sản phẩm với product_id tương ứng
			throw new RuntimeException("Product not found with id " + product_id);
		}
	}
	@GetMapping("/sellerScoresByCategory/{categoryId}")
    public ResponseEntity<List<SellerScore>> getSellerScoresByCategory(@PathVariable("categoryId") int categoryId) {
        String sql = "SELECT u.username, SUM(ps.score) AS total_score " +
                     "FROM products p " +
                     "JOIN users u ON p.seller_id = u.id " +
                     "JOIN productscores ps ON p.id = ps.product_id " +
                     "WHERE ps.category_id = :categoryId " +
                     "GROUP BY u.id " +
                     "ORDER BY total_score DESC";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("categoryId", categoryId);

        try {
            List<SellerScore> scores = namedParameterJdbcTemplate.query(
                sql,
                parameters,
                (rs, rowNum) -> new SellerScore(rs.getString("username"), rs.getInt("total_score"))
            );
            return ResponseEntity.ok(scores);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
	 @PostMapping("/highestScoreProductsFromList")
	 public ResponseEntity<List<Product>> getHighestScoreProductsFromList(
	         @RequestBody ProductIdsWrapper productIdsWrapper) {
	     try {
	         List<Integer> productIds = productIdsWrapper.getProductIds();
	         List<ProductScore> productScores = productScoreRepository.findByProductIds(productIds);

	         List<Product> highestScoreProducts = productScores.stream()
	                 .sorted((ps1, ps2) -> Integer.compare(ps2.getScore(), ps1.getScore()))
	                 .map(ps -> {
	                     Product product = productRepository.findById(ps.getProductId()).orElse(null);
	                     if (product != null) {
	                         Optional<ProductSale> productSaleOpt = productsaleRepository.findByProductId(product.getId());
	                         productSaleOpt.ifPresent(productSale -> {
	                             product.setPrice(productSale.getPricesale());
	                         });
	                     }
	                     return product;
	                 })
	                 .filter(Objects::nonNull)
	                 .collect(Collectors.toList());

	         return ResponseEntity.ok(highestScoreProducts);
	     } catch (Exception e) {
	         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	     }
	 }



}

//Wrapper class to match the JSON structure
class ProductIdsWrapper {
	private List<Integer> productIds;

	public List<Integer> getProductIds() {
		return productIds;
	}

	public void setProductIds(List<Integer> productIds) {
		this.productIds = productIds;
	}
}
