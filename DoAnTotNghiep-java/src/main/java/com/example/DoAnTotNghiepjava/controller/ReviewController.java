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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.DoAnTotNghiepjava.entity.Review;
import com.example.DoAnTotNghiepjava.repository.ReviewRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class ReviewController { 
	@Autowired
	ReviewRepository reviewRepository;
	private static final String DEFAULT_FOLDER = "src/main/resources/static"; 
	  private static final Path CURRENT_FOLDER;

	  static {
	      String userDir = System.getProperty("review.dir");
	      if (userDir != null) {
	          CURRENT_FOLDER = Paths.get(userDir, DEFAULT_FOLDER);
	      } else {
	          CURRENT_FOLDER = Paths.get(DEFAULT_FOLDER);
	      }
	  }
/*lấy danh sách tất cả danh mục*/
@GetMapping("/reviews")
public List<Review> index(){
    return reviewRepository.findAll();
}
/*thêm mới 1 danh mục*/
@PostMapping("/review")
@ResponseStatus(HttpStatus.CREATED)
public Review create(
       			@RequestParam int user_id,
       			@RequestParam int product_id,
       			@RequestParam int rating,
       			@RequestParam String comment,
       			@RequestParam int created_by,
                   @RequestParam MultipartFile image) throws IOException {
    Path staticPath = Paths.get("images/review");
    Path imagePath = Paths.get("");
    if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
        Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
    }
    Path file = CURRENT_FOLDER.resolve(staticPath)
            .resolve(imagePath).resolve(image.getOriginalFilename());
    try (OutputStream os = Files.newOutputStream(file)) {
        os.write(image.getBytes());
    }
    Review review = new Review();
    review.setUser_id(user_id);
    review.setProduct_id(product_id);
    review.setRating(rating);
    review.setComment(comment);
    review.setCreated_by(created_by);
    review.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
    return reviewRepository.save(review);
}
/*lấy chi tiết 1 danh mục theo id*/
@GetMapping("/review/{id}")
public ResponseEntity<Review> show(@PathVariable String id) {
    return ResponseEntity.of(reviewRepository.findById(Integer.parseInt(id)));
}
/*update danh mục*/


/*xóa vĩnh viễn*/
@DeleteMapping("/review/destroy/{id}")
public ResponseEntity<Void> destroy(@PathVariable String id) {
    int reviewId = Integer.parseInt(id);
    Optional<Review> existingReview = reviewRepository.findById(reviewId);

    if (existingReview.isPresent()) {
    	reviewRepository.deleteById(reviewId);
        return ResponseEntity.noContent().build();
    } else {
        return ResponseEntity.notFound().build();
    }
}
@GetMapping("/product/review/{productId}")
public List<Review> getProductId(@PathVariable Integer productId) {
    return reviewRepository.findProductId(productId);
}

@GetMapping("/user/review/{user_id}")
public List<Review> getUserId(@PathVariable Integer user_id) {
    return reviewRepository.findUserId(user_id);
}

}