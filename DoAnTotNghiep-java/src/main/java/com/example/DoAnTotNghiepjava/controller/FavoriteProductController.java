package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.util.HashMap;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.DoAnTotNghiepjava.entity.FavoriteProduct;
import com.example.DoAnTotNghiepjava.repository.FavoriteProductRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class FavoriteProductController {
	@Autowired
	 private JdbcTemplate jdbcTemplate;
	@Autowired
	FavoriteProductRepository favoriteProductRepository;
	/*lấy danh sách tất cả danh mục*/
	  @GetMapping("/fproduct")
	  public List<FavoriteProduct> index(){
	      return (List<FavoriteProduct>) favoriteProductRepository.findAll();
	  }
	  /*thêm mới 1 danh mục*/
	  @PostMapping("/fproduct")
	  @ResponseStatus(HttpStatus.CREATED)
	  public FavoriteProduct create(
	         			@RequestParam int user_id,
	         			@RequestParam int product_id) throws IOException {
		  FavoriteProduct fproduct = new FavoriteProduct();
		  fproduct.setUser_id(user_id);
		  fproduct.setProduct_id(product_id);
	      return favoriteProductRepository.save(fproduct);
	  }
	 
	  /*xóa vĩnh viễn*/
	  @DeleteMapping("/fproduct/destroy/{id}")
	  public ResponseEntity<Void> destroy(@PathVariable String id) {
	      int fproductId = Integer.parseInt(id);
	      Optional<FavoriteProduct> existingBanner = favoriteProductRepository.findById((long) fproductId);

	      if (existingBanner.isPresent()) {
	    	  favoriteProductRepository.deleteById((long) fproductId);
	          return ResponseEntity.noContent().build();
	      } else {
	          return ResponseEntity.notFound().build();
	      }
	  }
	  @PostMapping("/favorite")
	    public ResponseEntity<FavoriteProduct> favoriteProduct(@RequestBody FavoriteProduct favorite) {
	        // Lưu đối tượng favorite vào cơ sở dữ liệu
		  	FavoriteProduct savedFavorite = favoriteProductRepository.save(favorite);
	        
	        // Kiểm tra xem đối tượng favorite đã được lưu thành công hay không
	        if(savedFavorite != null) {
	            return new ResponseEntity<>(savedFavorite, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	  
	  

	  @PostMapping("/unfavorite")
	    public ResponseEntity<String> unfollowShop(@RequestBody FavoriteProduct favorite) {
	        // Kiểm tra xem liệu đối tượng favorite có tồn tại trong cơ sở dữ liệu không
		  	FavoriteProduct existingFavorite = favoriteProductRepository.findByUserIdAndProductId(favorite.getUser_id(), favorite.getProduct_id());
	        if (existingFavorite != null) {
	            // Nếu tồn tại, xóa đối tượng favorite khỏi cơ sở dữ liệu
	        	favoriteProductRepository.delete(existingFavorite);
	            return new ResponseEntity<>("Successfully unfollowed shop", HttpStatus.OK);
	        } else {
	            // Nếu không tồn tại, trả về thông báo lỗi và mã HTTP 404 Not Found
	            return new ResponseEntity<>("Follow record not found", HttpStatus.NOT_FOUND);
	        }
	    }
	  
	  
	  @GetMapping("/isFavorited")
	    public ResponseEntity<Map<String, Boolean>> isFollowing(@RequestParam int user_id, @RequestParam int product_id) {
	        // Kiểm tra xem người dùng đã theo dõi cửa hàng hay chưa
	        boolean isFavorited = favoriteProductRepository.existsByUserIdAndProductId(user_id, product_id);
	        Map<String, Boolean> response = new HashMap();
	        response.put("isFavorited", isFavorited);
	        return ResponseEntity.ok(response);
	    }
	  

	  @GetMapping("/favorite-products/{userId}")
	  public ResponseEntity<List<Map<String, Object>>> getFavoriteProductsByUserId(@PathVariable("userId") Long userId) {
	      String sql = "SELECT fp.id AS favorite_product_id, " +
	                   "fp.user_id, fp.product_id, p.name AS product_name, p.category_id, " +
	                   "p.price AS product_price, p.slug , p.image AS product_image, p.detail AS product_detail " +
	                   "FROM favoriteproducts fp " +
	                   "INNER JOIN products p ON fp.product_id = p.id " +
	                   "WHERE fp.user_id = ?";

	      List<Map<String, Object>> favoriteProductsList = jdbcTemplate.queryForList(sql, userId);
	      return ResponseEntity.ok(favoriteProductsList);
	  }
	  
	  
	  @GetMapping("/{productId}/favorites/count")
	    public long getFavortitesCount(@PathVariable int productId) {
	        return favoriteProductRepository.countsFavoriteProduct(productId);
	    }
}
