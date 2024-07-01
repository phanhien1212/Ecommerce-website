package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.DoAnTotNghiepjava.entity.Category;
import com.example.DoAnTotNghiepjava.entity.Product;
import com.example.DoAnTotNghiepjava.entity.ShopProfile;
import com.example.DoAnTotNghiepjava.repository.ShopProfileRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class ShopProfileController {
	@Autowired
	ShopProfileRepository shopprofileRepository;
	private static final String DEFAULT_FOLDER = "src/main/resources/static";
	private static final Path CURRENT_FOLDER;

	static {
		String userDir = System.getProperty("shopprofile.dir");
		if (userDir != null) {
			CURRENT_FOLDER = Paths.get(userDir, DEFAULT_FOLDER);
		} else {
			CURRENT_FOLDER = Paths.get(DEFAULT_FOLDER);
		}
	}

	/* lấy danh sách tất cả danh mục */
	@GetMapping("/shopprofiles")
	public List<ShopProfile> index() {
		return shopprofileRepository.findAll();
	}

	@PostMapping("/shopprofile")
	@ResponseStatus(HttpStatus.CREATED)
	/* thêm mới 1 danh mục */
	public ShopProfile create(@RequestParam int id_seller, @RequestParam String name, @RequestParam String address,
			@RequestParam MultipartFile image, @RequestParam String phone, @RequestParam String email,@RequestParam BigDecimal latitude,@RequestParam BigDecimal longitude)
			throws IOException {
		Path staticPath = Paths.get("images/shopprofile");
		Path imagePath = Paths.get("");
		if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
			Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
		}
		Path file = CURRENT_FOLDER.resolve(staticPath).resolve(imagePath).resolve(image.getOriginalFilename());
		try (OutputStream os = Files.newOutputStream(file)) {
			os.write(image.getBytes());
		}

		ShopProfile shopprofile = new ShopProfile();
		shopprofile.setIdSeller(id_seller);
		shopprofile.setName(name);
		shopprofile.setLatitude(latitude);
		shopprofile.setLongitude(longitude);
		shopprofile.setAddress(address);
		// Lưu trữ đường dẫn hoặc tên tệp hình ảnh trong ShopProfile
		shopprofile.setImage(file.toString()); // hoặc image.getOriginalFilename() tùy thuộc vào cách bạn muốn lưu trữ
		shopprofile.setPhone(phone);
		shopprofile.setEmail(email);
		return shopprofileRepository.save(shopprofile);
	}

	/* lấy chi tiết 1 danh mục theo id */
	@GetMapping("/shopprofile/{id}")
	public ResponseEntity<ShopProfile> show(@PathVariable String id) {
		return ResponseEntity.of(shopprofileRepository.findById(Integer.parseInt(id)));
	}

	/* lấy chi tiết shop theo seller_id */
	@GetMapping("/shopprofilebyseller/{idSeller}")
	public ResponseEntity<ShopProfile> getBySeller(@PathVariable int idSeller) {
		List<ShopProfile> shopProfiles = shopprofileRepository.findByIdSeller(idSeller);

		if (!shopProfiles.isEmpty()) {
			return ResponseEntity.ok(shopProfiles.get(0));
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PutMapping("/shopprofile/{id}")
	public ResponseEntity<?> updateShopProfile(@PathVariable int id, @RequestParam int id_seller,
			@RequestParam String name, @RequestParam String address, @RequestParam MultipartFile image,
			@RequestParam String phone, @RequestParam String email,@RequestParam BigDecimal latitude,@RequestParam BigDecimal longitude) {
		try {
			Optional<ShopProfile> optionalShopProfile = shopprofileRepository.findById(id);

			if (optionalShopProfile.isPresent()) {
				ShopProfile shopprofile = optionalShopProfile.get();
				shopprofile.setIdSeller(id_seller);
				shopprofile.setName(name);
				shopprofile.setAddress(address);
				shopprofile.setLatitude(latitude);
				shopprofile.setLongitude(longitude);
				shopprofile.setPhone(phone);
				shopprofile.setEmail(email);
				 if (!image.isEmpty()) {
	                   Path staticPath = Paths.get("images/shopprofile");
	                   Path imagePath = Paths.get("");
	                   if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
	                       Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
	                   }
	                   Path file = CURRENT_FOLDER.resolve(staticPath)
	                           .resolve(imagePath).resolve(image.getOriginalFilename());
	                   try (OutputStream os = Files.newOutputStream(file)) {
	                       os.write(image.getBytes());
	                   }
	                   shopprofile.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
	               }
				ShopProfile updatedProfile = shopprofileRepository.save(shopprofile);
				return ResponseEntity.ok(updatedProfile);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/* chỉnh sửa trạng thái sản phẩm */

	/* xóa vĩnh viễn */
	@DeleteMapping("/shopprofile/destroy/{id}")
	public ResponseEntity<Void> destroy(@PathVariable String id) {
		int shopprofileId = Integer.parseInt(id);
		Optional<ShopProfile> existingShopProfile = shopprofileRepository.findById(shopprofileId);

		if (existingShopProfile.isPresent()) {
			shopprofileRepository.deleteById(shopprofileId);
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.notFound().build();
		}
	}
}
