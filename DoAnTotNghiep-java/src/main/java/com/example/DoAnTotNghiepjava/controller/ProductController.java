package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import com.example.DoAnTotNghiepjava.entity.Category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
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

import com.example.DoAnTotNghiepjava.entity.Order;
import com.example.DoAnTotNghiepjava.entity.Product;
import com.example.DoAnTotNghiepjava.entity.ProductImage;
import com.example.DoAnTotNghiepjava.entity.Review;



@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class ProductController {
	@Autowired
	 private JdbcTemplate jdbcTemplate;
	@Autowired
    com.example.DoAnTotNghiepjava.repository.ProductRepository productRepository;
	private static final String DEFAULT_FOLDER = "src/main/resources/static"; 
	  private static final Path CURRENT_FOLDER;

	  static {
	      String userDir = System.getProperty("product.dir");
	      if (userDir != null) {
	          CURRENT_FOLDER = Paths.get(userDir, DEFAULT_FOLDER);
	      } else {
	          CURRENT_FOLDER = Paths.get(DEFAULT_FOLDER);
	      }
	  }
	  @PutMapping("/{id}/reduce-stock")
	    public ResponseEntity<Void> reduceStock(@PathVariable Long id, @RequestParam int qty) {
		 	int updatedRows = productRepository.reduceStock(id, qty);
	        if (updatedRows == 0) {
	            // Không có hàng tồn kho đủ
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	        }
	        return ResponseEntity.ok().build();
	    }
	  @GetMapping("/products/{slug}")
	  public ResponseEntity<Map<String, Object>> getProductDetailsById(@PathVariable String slug) {
	      Optional<Map<String, Object>> productDetailsOptional = productRepository.findProductDetailsBySlug(slug);
	      return productDetailsOptional.map(ResponseEntity::ok)
	                                   .orElse(ResponseEntity.notFound().build());
	  }
	  @GetMapping("/products-status-qty-sale")
	  public ResponseEntity<List<Map<String, Object>>> getProductsStatusQtySale() {
	      String sql = "SELECT p.id AS id, " +
	                   "p.created_at, p.name, p.slug, p.image, p.detail, p.price, " +
	                   "p.description, p.status, p.category_id, p.seller_id, p.stockquantity," +
	                   "ps.product_id, ps.id AS order_detail_id, ps.discount, " +
	                   "ps.product_id, " +
	                   "CASE WHEN p.stockquantity > 0 AND p.status = 1 " +
	                   "AND ps.product_id IS NOT NULL " +
	                   "AND CURRENT_TIMESTAMP > ps.datebegin AND CURRENT_TIMESTAMP < ps.dateend " +
	                   "AND ps.status = 1 THEN ps.pricesale " +
	                   "ELSE p.price END AS price_display, " +
	                   "CASE WHEN p.stockquantity > 0 AND p.status = 1 " +
	                   "AND ps.product_id IS NOT NULL " +
	                   "AND CURRENT_TIMESTAMP > ps.datebegin AND CURRENT_TIMESTAMP < ps.dateend " +
	                   "AND ps.status = 1 THEN ps.promotion_name " +
	                   "ELSE NULL END AS promotion_name " +
	                   "FROM products p " +
	                   "LEFT JOIN productsale ps ON p.id = ps.product_id " +
	                   "WHERE (p.status = 1 AND p.stockquantity > 0)";

	      List<Map<String, Object>> getProductsStatusQtySale = jdbcTemplate.queryForList(sql);
	      return ResponseEntity.ok(getProductsStatusQtySale);
	  }

	  @GetMapping("/products-status-qty-sale/{categoryId}")
	    public ResponseEntity<List<Map<String, Object>>> getProductsStatusQtySaleByCategory(@PathVariable int categoryId) {
	        String sql = "SELECT p.id AS id, " +
	                     "p.created_at, p.name, p.slug, p.image, p.detail, p.price, " +
	                     "p.description, p.status, p.category_id, p.seller_id, p.stockquantity, " +
	                     "ps.product_id, ps.discount , ps.id AS order_detail_id, " +
	                     "CASE WHEN p.stockquantity > 0 AND p.status = 1 " +
	                     "AND ps.product_id IS NOT NULL " +
	                     "AND CURRENT_TIMESTAMP > ps.datebegin AND CURRENT_TIMESTAMP < ps.dateend " +
	                     "AND ps.status = 1 THEN ps.pricesale " +
	                     "ELSE p.price END AS price_display, " +
	                     "CASE WHEN p.stockquantity > 0 AND p.status = 1 " +
	                     "AND ps.product_id IS NOT NULL " +
	                     "AND CURRENT_TIMESTAMP > ps.datebegin AND CURRENT_TIMESTAMP < ps.dateend " +
	                     "THEN ps.pricesale " +
	                     "ELSE p.price END AS price " +
	                     "FROM products p " +
	                     "LEFT JOIN productsale ps ON p.id = ps.product_id " +
	                     "WHERE (p.status = 1 AND p.stockquantity > 0) AND p.category_id = ?";

	        List<Map<String, Object>> products = jdbcTemplate.queryForList(sql, categoryId);
	        return ResponseEntity.ok(products);
	    }


	   /*thêm mới sản phẩm*/
	   @PostMapping("/product")
	    @ResponseStatus(HttpStatus.CREATED)
	    public Product create(@RequestParam String name,
               			@RequestParam String description,
               			@RequestParam String detail,
               			@RequestParam int created_by,
               			@RequestParam int status,
               			@RequestParam int category_id,
               			@RequestParam int seller_id,
               			@RequestParam int stockquantity,
               			@RequestParam Double price,
	                       @RequestParam MultipartFile image) throws IOException {
	        Path staticPath = Paths.get("images/product");
	        Path imagePath = Paths.get("");
	        if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
	            Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
	        }
	        Path file = CURRENT_FOLDER.resolve(staticPath)
	                .resolve(imagePath).resolve(image.getOriginalFilename());
	        try (OutputStream os = Files.newOutputStream(file)) {
	            os.write(image.getBytes());
	        }
	        Product product = new Product();
	        product.setName(name);
	        product.setPrice(price);
	        product.setDetail(detail);
	        product.setDescription(description);
	        product.setCreated_by(created_by);
	        product.setStatus(status);
	        product.setCategory_id(category_id);
	        product.setSeller_id(seller_id);
	        product.setStockquantity(stockquantity);
	        product.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
	        return productRepository.save(product);
	    }
	   /*hiển thị chi tiết sản phẩm theo id*/
	   @GetMapping("/products")
	   public List<Product> index(){
	       return productRepository.findAll();
	   }
	   @GetMapping("/product/{id}")
	    public ResponseEntity<Product> show(@PathVariable String id) {
	        return ResponseEntity.of(productRepository.findById(Integer.parseInt(id)));
	    }
	   /*hiển thị chi tiết sản phẩm theo slug*/
	   @GetMapping("/product/showbySlug/{slug}")
	   public ResponseEntity<Product> showBySlug(@PathVariable String slug) {
		    List<Product> products = productRepository.findBySlug(slug);

		    if (!products.isEmpty()) {
		        return ResponseEntity.ok(products.get(0));
		    } else {
		        return ResponseEntity.notFound().build();
		    }
		}
	   /*lấy danh sách sản phẩm trong thùng rác*/
	   @GetMapping("/product/trash")
	    public ResponseEntity<List<Product>> getProductsInTrash() {
	        List<Product> productsInTrash = productRepository.findByStatus(0);
	        return ResponseEntity.ok(productsInTrash);
	    }
	

	  
	  /*lấy danh sách tất cả sản phẩm của người bán đó*/
	   @GetMapping("/products/seller/{sellerId}")
	   public List<Product> getProductsBySeller(@PathVariable Integer sellerId) {
	       return productRepository.findProductsBySeller(sellerId);
	   }

	   @GetMapping("/products/image/{product_id}")
	    public List<ProductImage> getProductImage(@PathVariable Integer product_id) {
	        return productRepository.findProductImage(product_id);
	    }
	   
	   /*update sản phẩm*/
	   @PutMapping("/product/{id}")
	   public ResponseEntity<Product> update(@PathVariable int id,
	                                         @RequestParam String name,
	                                         @RequestParam String description,
	                                         @RequestParam String detail,
	                                         @RequestParam int updated_by,
	                                         @RequestParam int status,
	                                         @RequestParam int category_id,
	                                         @RequestParam int seller_id,
	                                         @RequestParam int stockquantity,
	                                         @RequestParam Double price,
	                                         @RequestParam MultipartFile image) throws IOException {
	       try {
	           Optional<Product> optionalProduct = productRepository.findById(id);

	           if (optionalProduct.isPresent()) {
	               Product product = optionalProduct.get();
	               product.setName(name);
	               product.setDescription(description);
	               product.setDetail(detail);
	               product.setUpdated_by(updated_by);
	               product.setStatus(status);
	               product.setCategory_id(category_id);
	               product.setSeller_id(seller_id);
	               product.setStockquantity(stockquantity);
	               product.setPrice(price);

	               // Xử lý ảnh
	               if (!image.isEmpty()) {
	                   Path staticPath = Paths.get("images/product");
	                   Path imagePath = Paths.get("");
	                   if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
	                       Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
	                   }
	                   Path file = CURRENT_FOLDER.resolve(staticPath)
	                           .resolve(imagePath).resolve(image.getOriginalFilename());
	                   try (OutputStream os = Files.newOutputStream(file)) {
	                       os.write(image.getBytes());
	                   }
	                   product.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
	               }

	               // Lưu sản phẩm đã cập nhật
	               productRepository.save(product);

	               return ResponseEntity.ok(product);
	           } else {
	               return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	           }
	       } catch (Exception e) {
	           return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	       }
	   }
	   /*chỉnh sửa trạng thái sản phẩm*/
	   @PutMapping("/product/updatestatus/{id}")
	   public ResponseEntity<Product> updateStatus(@PathVariable int id, @RequestParam int status) {
	       try {
	           Optional<Product> optionalProduct = productRepository.findById(id);
	           
	           if (optionalProduct.isPresent()) {
	               Product product = optionalProduct.get();
	               
	               // Cập nhật trạng thái của đơn hàng
	               product.setStatus(status);
	               
	               // Lưu cập nhật trạng thái vào cơ sở dữ liệu
	               productRepository.save(product);
	               
	               return ResponseEntity.ok(product);
	           } else {
	               // Trả về lỗi nếu không tìm thấy đơn hàng
	               return ResponseEntity.notFound().build(); 
	           }
	       } catch (Exception e) {
	           // Trả về lỗi nếu có lỗi xảy ra trong quá trình xử lý
	           return ResponseEntity.status(500).build(); 
	       }
	   }


	   /*xóa vĩnh viễn*/
	   @DeleteMapping("/product/destroy/{id}")
	    public ResponseEntity<Void> destroy(@PathVariable String id) {
	        int productId = Integer.parseInt(id);
	        Optional<Product> existingProduct = productRepository.findById(productId);

	        if (existingProduct.isPresent()) {
	            productRepository.deleteById(productId);
	            return ResponseEntity.noContent().build();
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	   
		 /*xóa sản phẩm vào thùng rác*/
		 @PutMapping("/product/delete/{id}")
		 public ResponseEntity<Product> deleteTrash(@PathVariable int id) {
		     try {
		         Optional<Product> optionalProduct = productRepository.findById(id);
		         
		         if (optionalProduct.isPresent()) {
		             Product product = optionalProduct.get();
		             
		             // Thiết lập trạng thái mới cho sản phẩm là 0
		             product.setStatus(0);
		             
		             // Lưu sản phẩm đã cập nhật
		             productRepository.save(product);
		             
		             return ResponseEntity.ok(product);
		         } else {
		             return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
		         }
		     } catch (Exception e) {
		         return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		     }
		 }

		 /*khôi phục sản phẩm*/
		 @PutMapping("/product/restore/{id}")
		 public ResponseEntity<Product> restoreTrash(@PathVariable int id) {
		     try {
		         Optional<Product> optionalProduct = productRepository.findById(id);
		         
		         if (optionalProduct.isPresent()) {
		             Product product = optionalProduct.get();
		             
		             // Thiết lập trạng thái mới cho sản phẩm là 0
		             product.setStatus(2);
		             
		             // Lưu sản phẩm đã cập nhật
		             productRepository.save(product);
		             
		             return ResponseEntity.ok(product);
		         } else {
		             return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
		         }
		     } catch (Exception e) {
		         return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		     }
		 }
		 /*tìm kiếm sản phẩm theo tên hoặc description*/
		   @PostMapping("/product/search")
		   public ResponseEntity<List<Map<String, Object>>> searchProducts(@RequestBody Map<String, String> body) {
		       String searchTerm = body.get("text");
		       String sql = "SELECT p.id AS id, " +
		                    "p.created_at, p.name, p.slug, p.image, p.detail, p.price, " +
		                    "p.description, p.status, p.category_id, p.seller_id, p.stockquantity, " +
		                    "ps.product_id, ps.discount, ps.id AS product_sale_id, " +
		                    "CASE WHEN p.stockquantity > 0 AND p.status = 1 " +
		                    "AND ps.product_id IS NOT NULL " +
		                    "AND CURRENT_TIMESTAMP > ps.datebegin AND CURRENT_TIMESTAMP < ps.dateend " +
		                    "AND ps.status = 1 THEN ps.pricesale " +
		                    "ELSE p.price END AS price_display, " +
		                    "CASE WHEN p.stockquantity > 0 AND p.status = 1 " +
		                    "AND ps.product_id IS NOT NULL " +
		                    "AND CURRENT_TIMESTAMP > ps.datebegin AND CURRENT_TIMESTAMP < ps.dateend " +
		                    "THEN ps.pricesale " +
		                    "ELSE p.price END AS price " +
		                    "FROM products p " +
		                    "LEFT JOIN productsale ps ON p.id = ps.product_id " +
		                    "WHERE (p.status = 1 AND p.stockquantity > 0) " +
		                    "AND (p.name LIKE CONCAT('%', ?, '%') OR p.description LIKE CONCAT('%', ?, '%'))";

		       List<Map<String, Object>> products = jdbcTemplate.queryForList(sql, searchTerm, searchTerm);
		       return ResponseEntity.ok(products);
		   }
		   @GetMapping("/category/seller/{sellerId}")
		    public List<Category> getCategoriesBySeller(@PathVariable Integer sellerId) {
		        return productRepository.findCategoriesBySeller(sellerId);
		    }
		   
		   
		   
		   @GetMapping("/check-quantity")
		    public ResponseEntity<?> checkProductQuantity(
		        @RequestParam Long productId, 
		        @RequestParam int quantity) {
		        
		        Integer availableQuantity = productRepository.findQuantityById(productId);

		        if (availableQuantity != null && availableQuantity >= quantity) {
		            return ResponseEntity.ok().body("Sufficient quantity available");
		        } else {
		            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
		                                 .body("Not enough quantity available");
		        }
		    }

}
