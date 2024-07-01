package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.io.OutputStream;
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

import com.example.DoAnTotNghiepjava.entity.Category;
import com.example.DoAnTotNghiepjava.entity.Product;
import com.example.DoAnTotNghiepjava.repository.CategoryRepository;
import com.example.DoAnTotNghiepjava.repository.ProductRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class CategoryController {
	@Autowired
	CategoryRepository categoryRepository;
	private static final String DEFAULT_FOLDER = "src/main/resources/static";
	private static final Path CURRENT_FOLDER;

	static {
		String userDir = System.getProperty("category.dir");
		if (userDir != null) {
			CURRENT_FOLDER = Paths.get(userDir, DEFAULT_FOLDER);
		} else {
			CURRENT_FOLDER = Paths.get(DEFAULT_FOLDER);
		}
	}

	/* lấy danh sách tất cả danh mục */
	@GetMapping("/categories")
	public List<Category> index() {
		return categoryRepository.findAll();
	}

	@GetMapping("/categoriesActive")
	public List<Category> getCategoriesActive() {
		return categoryRepository.findByStatus(1);
	}

	/* thêm mới 1 danh mục */
	@PostMapping("/category")
	@ResponseStatus(HttpStatus.CREATED)
	public Category create(@RequestParam String name, @RequestParam String description, @RequestParam int created_by,
			@RequestParam int status, @RequestParam int sort_order, @RequestParam int parent_id,
			@RequestParam MultipartFile image) throws IOException {
		Path staticPath = Paths.get("images/category");
		Path imagePath = Paths.get("");
		if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
			Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
		}
		Path file = CURRENT_FOLDER.resolve(staticPath).resolve(imagePath).resolve(image.getOriginalFilename());
		try (OutputStream os = Files.newOutputStream(file)) {
			os.write(image.getBytes());
		}
		Category category = new Category();
		category.setName(name);
		category.setDescription(description);
		category.setCreated_by(created_by);
		category.setStatus(status);
		category.setParent_id(parent_id);
		category.setSort_order(sort_order);
		category.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
		return categoryRepository.save(category);
	}

	/* lấy chi tiết 1 danh mục theo id */
	@GetMapping("/category/{id}")
	public ResponseEntity<Category> show(@PathVariable String id) {
		return ResponseEntity.of(categoryRepository.findById(Integer.parseInt(id)));
	}

	/* lấy chi tiết 1 danh mục theo slug */
	@GetMapping("/category/showbySlug/{slug}")
	public ResponseEntity<Category> showBySlug(@PathVariable String slug) {
		List<Category> categories = categoryRepository.findBySlug(slug);

		if (!categories.isEmpty()) {
			return ResponseEntity.ok(categories.get(0));
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	/* lấy danh sách danh mục trong thùng rác */
	@GetMapping("/category/trash")
	public ResponseEntity<List<Category>> getCategorysInTrash() {
		List<Category> categoriesInTrash = categoryRepository.findByStatus(0);
		return ResponseEntity.ok(categoriesInTrash);
	}

	/* update danh mục */
	@PutMapping("/category/update/{id}")
	public ResponseEntity<Category> update(@PathVariable int id, @RequestParam String name,
			@RequestParam String description, @RequestParam int created_by, @RequestParam int updated_by,
			@RequestParam int status, @RequestParam int parent_id, @RequestParam int sort_order,
			@RequestParam MultipartFile image) throws IOException {
		try {
			Optional<Category> optionalCategory = categoryRepository.findById(id);

			if (optionalCategory.isPresent()) {
				Category category = optionalCategory.get();
				category.setName(name);
				category.setDescription(description);
				category.setCreated_by(created_by);
				category.setUpdated_by(updated_by);
				category.setStatus(status);
				category.setParent_id(parent_id);
				category.setSort_order(sort_order);

				// Xử lý ảnh
				if (!image.isEmpty()) {
					Path staticPath = Paths.get("images/category");
					Path imagePath = Paths.get("");
					if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
						Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
					}
					Path file = CURRENT_FOLDER.resolve(staticPath).resolve(imagePath)
							.resolve(image.getOriginalFilename());
					try (OutputStream os = Files.newOutputStream(file)) {
						os.write(image.getBytes());
					}
					category.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
				}

				// Lưu sản phẩm đã cập n
				categoryRepository.save(category);

				return ResponseEntity.ok(category);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build();
		}
	}

	/* cập nhật trạng thái danh mục */
	@PutMapping("/category/updatestatus/{id}")
	public ResponseEntity<Category> updateStatus(@PathVariable int id) {
		try {
			Optional<Category> optionalCategory = categoryRepository.findById(id);

			if (optionalCategory.isPresent()) {
				Category category = optionalCategory.get();

				if (category.getStatus() == 1) {
					category.setStatus(2);
				} else if (category.getStatus() == 2) {
					category.setStatus(1);
				} else {
					return ResponseEntity.badRequest().build();
				}

				categoryRepository.save(category);

				return ResponseEntity.ok(category);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build();
		}
	}

	/* xóa vĩnh viễn */
	@DeleteMapping("/category/destroy/{id}")
	public ResponseEntity<Void> destroy(@PathVariable String id) {
		int categoryId = Integer.parseInt(id);
		Optional<Category> existingCategory = categoryRepository.findById(categoryId);

		if (existingCategory.isPresent()) {
			categoryRepository.deleteById(categoryId);
			return ResponseEntity.noContent().build();
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	/* tìm kiếm danh mục */
	@PostMapping("/category/search")
	public List<Category> search(@RequestBody Map<String, String> body) {
		String searchTerm = body.get("text");
		return categoryRepository.findByNameContainingOrDescriptionContaining(searchTerm, searchTerm);
	}

	/* xóa danh mục vào thùng rác */
	@PutMapping("/category/delete/{id}")
	public ResponseEntity<Category> deleteTrash(@PathVariable int id) {
		try {
			Optional<Category> optionalCategory = categoryRepository.findById(id);

			if (optionalCategory.isPresent()) {
				Category category = optionalCategory.get();

				// Thiết lập trạng thái mới cho sản phẩm là 0
				category.setStatus(0);

				// Lưu sản phẩm đã cập nhật
				categoryRepository.save(category);

				return ResponseEntity.ok(category);
			} else {
				return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not
															// Found
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		}
	}

	/* khôi phục danh mục */
	@PutMapping("/category/destroy/{id}")
	public ResponseEntity<Category> destroyTrash(@PathVariable int id) {
		try {
			Optional<Category> optionalCategory = categoryRepository.findById(id);

			if (optionalCategory.isPresent()) {
				Category category = optionalCategory.get();

				// Thiết lập trạng thái mới cho sản phẩm là 0
				category.setStatus(2);

				// Lưu sản phẩm đã cập nhật
				categoryRepository.save(category);

				return ResponseEntity.ok(category);
			} else {
				return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not
															// Found
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		}
	}
	 @GetMapping("/children/{parentId}")
	    public List<Category> getChildren(@PathVariable int parentId) {
	        return categoryRepository.findByParentId(parentId);
	  }


}
