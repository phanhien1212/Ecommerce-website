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

import com.example.DoAnTotNghiepjava.entity.Banner;
import com.example.DoAnTotNghiepjava.repository.BannerRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class BannerController {
	@Autowired
	BannerRepository bannerRepository;
	private static final String DEFAULT_FOLDER = "src/main/resources/static"; 
	  private static final Path CURRENT_FOLDER;

	  static {
	      String userDir = System.getProperty("banner.dir");
	      if (userDir != null) {
	          CURRENT_FOLDER = Paths.get(userDir, DEFAULT_FOLDER);
	      } else {
	          CURRENT_FOLDER = Paths.get(DEFAULT_FOLDER);
	      }
	  }
		@GetMapping("/banners1")
		public List<Banner> getCategory1(){
			List<Banner> banners = bannerRepository.findAll();
			banners.removeIf(banner -> banner.getStatus() != 1);
	        return banners;
		}
	  @GetMapping("/banners1and2")
	    public List<Banner> getBanners() {
		  return bannerRepository.findAll();
	    }
	  /*thêm mới 1 danh mục*/
	  @PostMapping("/banner")
	  @ResponseStatus(HttpStatus.CREATED)
	  public Banner create(@RequestParam String name,
	         			@RequestParam String description,
	         			@RequestParam int created_by,
	         			@RequestParam int updated_by,
	         			@RequestParam int status,
	         			@RequestParam String link,
	         			@RequestParam String position,
	                     @RequestParam MultipartFile image) throws IOException {
	      Path staticPath = Paths.get("images/banner");
	      Path imagePath = Paths.get("");
	      if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
	          Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
	      }
	      Path file = CURRENT_FOLDER.resolve(staticPath)
	              .resolve(imagePath).resolve(image.getOriginalFilename());
	      try (OutputStream os = Files.newOutputStream(file)) {
	          os.write(image.getBytes());
	      }
	      Banner banner = new Banner();
	      banner.setName(name);
	      banner.setDescription(description);
	      banner.setCreated_by(created_by);
	      banner.setUpdated_by(updated_by);
	      banner.setStatus(status);
	      banner.setLink(link);
	      banner.setPosition(position);
	      banner.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
	      return bannerRepository.save(banner);
	  }
	  /*lấy chi tiết 1 danh mục theo id*/
	  @GetMapping("/banner/{id}")
	  public ResponseEntity<Banner> show(@PathVariable String id) {
	      return ResponseEntity.of(bannerRepository.findById(Integer.parseInt(id)));
	  }
	  /*lấy danh sách danh mục trong thùng rác*/
	  @GetMapping("/banner/trash")
	  public ResponseEntity<List<Banner>> getBannersInTrash() {
	      List<Banner> bannersInTrash = bannerRepository.findByStatus(0);
	      return ResponseEntity.ok(bannersInTrash);
	  }
	  /*update danh mục*/
	  @PutMapping("/banner/update/{id}")
	  public ResponseEntity<Banner> update(@PathVariable int id,
	                                        @RequestParam String name,
	                                        @RequestParam String description,
	                                        @RequestParam int created_by,
	                                        @RequestParam int updated_by,
	                                        @RequestParam int status,
	                                        @RequestParam String link,
	                                        @RequestParam String position,
	                                        @RequestParam MultipartFile image) throws IOException {
	      try {
	          Optional<Banner> optionalBanner = bannerRepository.findById(id);

	          if (optionalBanner.isPresent()) {
	              Banner banner = optionalBanner.get();
	              banner.setName(name);
	              banner.setDescription(description);
	              banner.setCreated_by(created_by);
	              banner.setUpdated_by(updated_by);
	              banner.setStatus(status);
	              banner.setLink(link);
	              banner.setPosition(position);

	              // Xử lý ảnh
	              if (!image.isEmpty()) {
	                  Path staticPath = Paths.get("images/banner");
	                  Path imagePath = Paths.get("");
	                  if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
	                      Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
	                  }
	                  Path file = CURRENT_FOLDER.resolve(staticPath)
	                          .resolve(imagePath).resolve(image.getOriginalFilename());
	                  try (OutputStream os = Files.newOutputStream(file)) {
	                      os.write(image.getBytes());
	                  }
	                  banner.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
	              }

	              // Lưu sản phẩm đã cập n
	              bannerRepository.save(banner);

	              return ResponseEntity.ok(banner);
	          } else {
	              return ResponseEntity.notFound().build(); 
	          }
	      } catch (Exception e) {
	          return ResponseEntity.status(500).build(); 
	      }
	  }
	  /*cập nhật trạng thái danh mục*/
	  @PutMapping("/banner/updatestatus/{id}")
	  public ResponseEntity<Banner> updateStatus(@PathVariable int id) {
	      try {
	          Optional<Banner> optionalBanner = bannerRepository.findById(id);
	          
	          if (optionalBanner.isPresent()) {
	              Banner banner = optionalBanner.get();
	              
	              if (banner.getStatus() == 1) {
	            	  banner.setStatus(2);
	              } else if (banner.getStatus() == 2) {
	            	  banner.setStatus(1);
	              } else {
	                  return ResponseEntity.badRequest().build(); 
	              }
	              
	              
	              bannerRepository.save(banner);
	              
	              return ResponseEntity.ok(banner);
	          } else {
	              return ResponseEntity.notFound().build(); 
	          }
	      } catch (Exception e) {
	          return ResponseEntity.status(500).build(); 
	      }
	  }
	  /*xóa vĩnh viễn*/
	  @DeleteMapping("/banner/destroy/{id}")
	  public ResponseEntity<Void> destroy(@PathVariable String id) {
	      int bannerId = Integer.parseInt(id);
	      Optional<Banner> existingBanner = bannerRepository.findById(bannerId);

	      if (existingBanner.isPresent()) {
	    	  bannerRepository.deleteById(bannerId);
	          return ResponseEntity.noContent().build();
	      } else {
	          return ResponseEntity.notFound().build();
	      }
	  }
	  /*tìm kiếm danh mục*/
	  @PostMapping("/banner/search")
	  public List<Banner> search(@RequestBody Map<String, String> body){
	      String searchTerm = body.get("text");
	      return bannerRepository.findByNameContainingOrDescriptionContaining(searchTerm, searchTerm);
	  }
	  /*xóa danh mục vào thùng rác*/
	  @PutMapping("/banner/delete/{id}")
	  public ResponseEntity<Banner> deleteTrash(@PathVariable int id) {
	      try {
	          Optional<Banner> optionalBanner = bannerRepository.findById(id);
	          
	          if (optionalBanner.isPresent()) {
	          	Banner banner = optionalBanner.get();
	              
	              // Thiết lập trạng thái mới cho sản phẩm là 0
	          	banner.setStatus(0);
	              
	              // Lưu sản phẩm đã cập nhật
	          	bannerRepository.save(banner);
	              
	              return ResponseEntity.ok(banner);
	          } else {
	              return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	          }
	      } catch (Exception e) {
	          return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	      }
	  }
	  /*Khôi phục banner*/
	  @PutMapping("/banner/restore/{id}")
	  public ResponseEntity<Banner> restoreTrash(@PathVariable int id) {
	      try {
	          Optional<Banner> optionalBanner = bannerRepository.findById(id);
	          
	          if (optionalBanner.isPresent()) {
	          	Banner banner = optionalBanner.get();
	              
	              // Thiết lập trạng thái mới cho sản phẩm là 0
	          	banner.setStatus(2);
	              
	              // Lưu sản phẩm đã cập nhật
	          	bannerRepository.save(banner);
	              
	              return ResponseEntity.ok(banner);
	          } else {
	              return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	          }
	      } catch (Exception e) {
	          return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	      }
	  }


}
