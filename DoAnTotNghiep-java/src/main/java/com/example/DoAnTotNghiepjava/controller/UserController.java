package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
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

import com.example.DoAnTotNghiepjava.entity.Order;
import com.example.DoAnTotNghiepjava.entity.User;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class UserController {
	@Autowired
	com.example.DoAnTotNghiepjava.repository.UserRepository userRepository;
	private static final String DEFAULT_FOLDER = "src/main/resources/static";
	private static final Path CURRENT_FOLDER;

	static {
		String userDir = System.getProperty("user.dir");
		if (userDir != null) {
			CURRENT_FOLDER = Paths.get(userDir, DEFAULT_FOLDER);
		} else {
			CURRENT_FOLDER = Paths.get(DEFAULT_FOLDER);
		}
	}

	/* lấy danh sách tất cả sản phẩm */
	@GetMapping("/users")
	public List<User> index() {
		return userRepository.findAll();
	}
	 @GetMapping("/admins")
	    public List<User> getCustomers() {
	        List<User> customers = userRepository.findAllUsers();
	        return customers;
	    }
	/* thêm mới sản phẩm */
	@PostMapping("/user")
	@ResponseStatus(HttpStatus.CREATED)
	public User create(@RequestParam String firstname, @RequestParam String lastname, @RequestParam String username,
			@RequestParam String gender, @RequestParam String password, @RequestParam String phone,
			@RequestParam String email, @RequestParam String role, @RequestParam String address,
			@RequestParam int status, @RequestParam BigDecimal latitude, @RequestParam BigDecimal longitude,

			@RequestParam int created_by, @RequestParam MultipartFile image) throws IOException {
		Path staticPath = Paths.get("images/user");
		Path imagePath = Paths.get("");
		if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
			Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
		}
		Path file = CURRENT_FOLDER.resolve(staticPath).resolve(imagePath).resolve(image.getOriginalFilename());
		try (OutputStream os = Files.newOutputStream(file)) {
			os.write(image.getBytes());
		}
		User user = new User();
		user.setFirstname(firstname);
		user.setLastname(lastname);
		user.setUsername(username);
		user.setGender(gender);
		user.setPhone(phone);
		user.setPassword(password);
		user.setLatitude(latitude);
		user.setLongitude(longitude);
		user.setEmail(email);
		user.setRole(role);
		user.setAddress(address);
		user.setStatus(status);
		user.setCreated_by(created_by);
		user.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
		return userRepository.save(user);
	}
	/* hiển thị chi tiết sản phẩm theo id */

	@GetMapping("/user/{id}")
	public ResponseEntity<User> show(@PathVariable String id) {
		return ResponseEntity.of(userRepository.findById(Integer.parseInt(id)));
	}

	/* lấy danh sách sản phẩm trong thùng rác */
	@GetMapping("/user/trash")
	public ResponseEntity<List<User>> getUsersInTrash() {
		List<User> usersInTrash = userRepository.findByStatus(0);
		return ResponseEntity.ok(usersInTrash);
	}

	/* update sản phẩm */
	@PutMapping("/user/{id}")
	public ResponseEntity<User> update(@PathVariable int id, @RequestParam String firstname,
			@RequestParam String lastname, @RequestParam String username, @RequestParam String gender,
			@RequestParam String phone, @RequestParam String email, @RequestParam String role,
			@RequestParam int updated_by, @RequestParam String address, @RequestParam BigDecimal latitude,
			@RequestParam BigDecimal longitude, @RequestParam int status, @RequestParam MultipartFile image)
			throws IOException {
		try {
			Optional<User> optionalUser = userRepository.findById(id);

			if (optionalUser.isPresent()) {
				User user = optionalUser.get();
				user.setFirstname(firstname);
				user.setLastname(lastname);
				user.setUsername(username);
				user.setGender(gender);
				user.setPhone(phone);
				user.setLatitude(latitude);
				user.setLongitude(longitude);
				user.setEmail(email);
				user.setRole(role);
				user.setAddress(address);
				user.setStatus(status);
				user.setUpdated_by(updated_by);
				// Xử lý ảnh
				if (!image.isEmpty()) {
					Path staticPath = Paths.get("images/user");
					Path imagePath = Paths.get("");
					if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
						Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
					}
					Path file = CURRENT_FOLDER.resolve(staticPath).resolve(imagePath)
							.resolve(image.getOriginalFilename());
					try (OutputStream os = Files.newOutputStream(file)) {
						os.write(image.getBytes());
					}
					user.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
				}

				// Lưu sản phẩm đã cập nhật
				userRepository.save(user);

				return ResponseEntity.ok(user);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build();
		}
	}

	/* chỉnh sửa trạng thái sản phẩm */
	@PutMapping("/user/updatestatus/{id}")
	public ResponseEntity<User> updateStatus(@PathVariable int id) {
		try {
			Optional<User> optionalUser = userRepository.findById(id);

			if (optionalUser.isPresent()) {
				User user = optionalUser.get();

				// Đảo ngược trạng thái: nếu là 1, chuyển thành 2; nếu là 2, chuyển thành 1
				if (user.getStatus() == 1) {
					user.setStatus(2);
				} else if (user.getStatus() == 2) {
					user.setStatus(1);
				} else {
					return ResponseEntity.badRequest().build(); // Trạng thái không hợp lệ, trả về 400 Bad Request
				}

				// Lưu sản phẩm đã cập nhật
				userRepository.save(user);

				return ResponseEntity.ok(user);
			} else {
				return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not
															// Found
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> create(@RequestBody User user) {
		String username = user.getUsername();
		String email = user.getEmail();

		Optional<User> existingUser = userRepository.findByUsernameOrEmail(username, email);
		if (existingUser.isPresent()) {

			return ResponseEntity.status(HttpStatus.CONFLICT).body("Tên người dùng hoặc email đã tồn tại");
		} else {

			User newUser = userRepository.save(user);

			return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
		}
	}

	@PostMapping("/login")
	public ResponseEntity<User> login(@RequestBody User loginUser) {

		String username = loginUser.getUsername();
		String password = loginUser.getPassword();

		Optional<User> userOptional = userRepository.findByUsernameAndPassword(username, password);
		if (userOptional.isPresent()) {

			return ResponseEntity.ok(userOptional.get());
		} else {

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}
	/* xóa vĩnh viễn */

	@DeleteMapping("/user/destroy/{id}")
	public ResponseEntity<Void> destroy(@PathVariable String id) {
		int userId = Integer.parseInt(id);
		Optional<User> existingUser = userRepository.findById(userId);

		if (existingUser.isPresent()) {
			userRepository.deleteById(userId);
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	/* Thay đổi role */
	@PutMapping("/user/updaterole/{id}")
	public ResponseEntity<User> updateRole(@PathVariable int id, @RequestParam String role) {
		try {
			Optional<User> optionalUser = userRepository.findById(id);

			if (optionalUser.isPresent()) {
				User user = optionalUser.get();

				// Cập nhật trạng thái của đơn hàng
				user.setRole(role);

				// Lưu cập nhật trạng thái vào cơ sở dữ liệu
				userRepository.save(user);

				return ResponseEntity.ok(user);
			} else {
				// Trả về lỗi nếu không tìm thấy đơn hàng
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			// Trả về lỗi nếu có lỗi xảy ra trong quá trình xử lý
			return ResponseEntity.status(500).build();
		}
	}

	/* xóa sản phẩm vào thùng rác */
	@PutMapping("/user/delete/{id}")
	public ResponseEntity<User> deleteTrash(@PathVariable int id) {
		try {
			Optional<User> optionalUser = userRepository.findById(id);

			if (optionalUser.isPresent()) {
				User user = optionalUser.get();

				// Thiết lập trạng thái mới cho sản phẩm là 0
				user.setStatus(0);

				// Lưu sản phẩm đã cập nhật
				userRepository.save(user);

				return ResponseEntity.ok(user);
			} else {
				return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not
															// Found
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		}
	}

	/* khôi phục sản phẩm */
	@PutMapping("/user/restore/{id}")
	public ResponseEntity<User> restoreTrash(@PathVariable int id) {
		try {
			Optional<User> optionalUser = userRepository.findById(id);

			if (optionalUser.isPresent()) {
				User user = optionalUser.get();

				// Thiết lập trạng thái mới cho sản phẩm là 0
				user.setStatus(2);

				// Lưu sản phẩm đã cập nhật
				userRepository.save(user);

				return ResponseEntity.ok(user);
			} else {
				return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not
															// Found
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		}
	}

}