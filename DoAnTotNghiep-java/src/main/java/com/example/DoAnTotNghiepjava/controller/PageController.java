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

import com.example.DoAnTotNghiepjava.entity.Page;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class PageController {
	@Autowired
    com.example.DoAnTotNghiepjava.repository.PageRepository pageRepository;
	private static final String DEFAULT_FOLDER = "src/main/resources/static"; 
	  private static final Path CURRENT_FOLDER;

	  static {
	      String userDir = System.getProperty("page.dir");
	      if (userDir != null) {
	          CURRENT_FOLDER = Paths.get(userDir, DEFAULT_FOLDER);
	      } else {
	          CURRENT_FOLDER = Paths.get(DEFAULT_FOLDER);
	      }
	  }
	  /*lấy danh sách tất cả sản phẩm*/
	   @GetMapping("/pages")
	    public List<Page> index(){
	        return pageRepository.findAll();
	    }
	   
	   /*thêm mới sản phẩm*/
	   @PostMapping("/page")
	    @ResponseStatus(HttpStatus.CREATED)
	    public Page create(@RequestParam String title,
               			@RequestParam int topic_id,
               			@RequestParam String detail,
               			@RequestParam String description,
               			@RequestParam int created_by,
               			@RequestParam int status,
	                       @RequestParam MultipartFile image) throws IOException {
	        Path staticPath = Paths.get("images/page");
	        Path imagePath = Paths.get("");
	        if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
	            Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
	        }
	        Path file = CURRENT_FOLDER.resolve(staticPath)
	                .resolve(imagePath).resolve(image.getOriginalFilename());
	        try (OutputStream os = Files.newOutputStream(file)) {
	            os.write(image.getBytes());
	        }
	        Page page = new Page();
	        page.setTitle(title);
	        page.setTopic_id(topic_id);
	        page.setDetail(detail);
	        page.setDescription(description);
	        page.setCreated_by(created_by);
	        page.setStatus(status);
	        page.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
	        return pageRepository.save(page);
	    }
	   /*hiển thị chi tiết sản phẩm theo id*/
	    
	   @GetMapping("/page/{id}")
	    public ResponseEntity<Page> show(@PathVariable String id) {
	        return ResponseEntity.of(pageRepository.findById(Integer.parseInt(id)));
	    }
	   /*hiển thị chi tiết sản phẩm theo slug*/
	   @GetMapping("/page/showbySlug/{slug}")
	   public ResponseEntity<Page> showBySlug(@PathVariable String slug) {
		    List<Page> pages = pageRepository.findBySlug(slug);

		    if (!pages.isEmpty()) {
		        return ResponseEntity.ok(pages.get(0));
		    } else {
		        return ResponseEntity.notFound().build();
		    }
		}
	   /*lấy danh sách sản phẩm trong thùng rác*/
	   @GetMapping("/page/trash")
	    public ResponseEntity<List<Page>> getPagesInTrash() {
	        List<Page> pagesInTrash = pageRepository.findByStatus(0);
	        return ResponseEntity.ok(pagesInTrash);
	    }

	   
	   /*update sản phẩm*/
	   @PutMapping("/page/{id}")
	   public ResponseEntity<Page> update(@PathVariable int id,
			   @RequestParam String title,
      			@RequestParam int topic_id,
      			@RequestParam String detail,
      			@RequestParam String description,
      			@RequestParam int updated_by,
      			@RequestParam int status,
                  @RequestParam MultipartFile image) throws IOException {
	       try {
	           Optional<Page> optionalPage = pageRepository.findById(id);

	           if (optionalPage.isPresent()) {
	               Page page = optionalPage.get();
	               page.setTitle(title);
	   	        page.setTopic_id(topic_id);
	   	        page.setDetail(detail);
	   	        page.setDescription(description);
	   	        page.setUpdated_by(updated_by);
	   	        page.setStatus(status);

	               // Xử lý ảnh
	               if (!image.isEmpty()) {
	                   Path staticPath = Paths.get("images/page");
	                   Path imagePath = Paths.get("");
	                   if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
	                       Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
	                   }
	                   Path file = CURRENT_FOLDER.resolve(staticPath)
	                           .resolve(imagePath).resolve(image.getOriginalFilename());
	                   try (OutputStream os = Files.newOutputStream(file)) {
	                       os.write(image.getBytes());
	                   }
	                   page.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
	               }

	               // Lưu sản phẩm đã cập nhật
	               pageRepository.save(page);

	               return ResponseEntity.ok(page);
	           } else {
	               return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	           }
	       } catch (Exception e) {
	           return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	       }
	   }
	   /*chỉnh sửa trạng thái sản phẩm*/
	   @PutMapping("/page/updatestatus/{id}")
	   public ResponseEntity<Page> updateStatus(@PathVariable int id) {
	       try {
	           Optional<Page> optionalPage = pageRepository.findById(id);
	           
	           if (optionalPage.isPresent()) {
	               Page page = optionalPage.get();
	               
	               // Đảo ngược trạng thái: nếu là 1, chuyển thành 2; nếu là 2, chuyển thành 1
	               if (page.getStatus() == 1) {
	                   page.setStatus(2);
	               } else if (page.getStatus() == 2) {
	                   page.setStatus(1);
	               } else {
	                   return ResponseEntity.badRequest().build(); // Trạng thái không hợp lệ, trả về 400 Bad Request
	               }
	               
	               // Lưu sản phẩm đã cập nhật
	               pageRepository.save(page);
	               
	               return ResponseEntity.ok(page);
	           } else {
	               return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	           }
	       } catch (Exception e) {
	           return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	       }
	   }


	   /*xóa vĩnh viễn*/
	   @DeleteMapping("/page/destroy/{id}")
	    public ResponseEntity<Void> destroy(@PathVariable String id) {
	        int pageId = Integer.parseInt(id);
	        Optional<Page> existingPage = pageRepository.findById(pageId);

	        if (existingPage.isPresent()) {
	            pageRepository.deleteById(pageId);
	            return ResponseEntity.noContent().build();
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	   /*tìm kiếm sản phẩm theo tên hoặc description*/
		 @PostMapping("/page/search")
		    public List<Page> search(@RequestBody Map<String, String> body){
		        String searchTerm = body.get("text");
		        return pageRepository.findByTitleContainingOrDescriptionContaining(searchTerm, searchTerm);
		    }
		 /*xóa sản phẩm vào thùng rác*/
		 @PutMapping("/page/delete/{id}")
		 public ResponseEntity<Page> deleteTrash(@PathVariable int id) {
		     try {
		         Optional<Page> optionalPage = pageRepository.findById(id);
		         
		         if (optionalPage.isPresent()) {
		             Page page = optionalPage.get();
		             
		             // Thiết lập trạng thái mới cho sản phẩm là 0
		             page.setStatus(0);
		             
		             // Lưu sản phẩm đã cập nhật
		             pageRepository.save(page);
		             
		             return ResponseEntity.ok(page);
		         } else {
		             return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
		         }
		     } catch (Exception e) {
		         return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		     }
		 }

		 /*khôi phục sản phẩm*/
		 @PutMapping("/page/restore/{id}")
		 public ResponseEntity<Page> restoreTrash(@PathVariable int id) {
		     try {
		         Optional<Page> optionalPage = pageRepository.findById(id);
		         
		         if (optionalPage.isPresent()) {
		             Page page = optionalPage.get();
		             
		             // Thiết lập trạng thái mới cho sản phẩm là 0
		             page.setStatus(2);
		             
		             // Lưu sản phẩm đã cập nhật
		             pageRepository.save(page);
		             
		             return ResponseEntity.ok(page);
		         } else {
		             return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
		         }
		     } catch (Exception e) {
		         return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		     }
		 }

}

