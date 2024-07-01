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
import com.example.DoAnTotNghiepjava.entity.Nofication;
import com.example.DoAnTotNghiepjava.repository.NoficationRepository;
@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class NoficationController {
	@Autowired
	NoficationRepository noficationRepository;
	
	  /*lấy danh sách tất cả danh mục*/
	  @GetMapping("/nofications")
	  public List<Nofication> index(){
	      return noficationRepository.findAll();
	  }
	  /*thêm mới 1 danh mục*/
	  @PostMapping("/nofication")
	  @ResponseStatus(HttpStatus.CREATED)
	  public Nofication create(@RequestParam String title,
	         			@RequestParam String content,
	         			@RequestParam int recipient_id,
	         			@RequestParam String role,
	         			@RequestParam int status,
	         			@RequestParam String link) throws IOException {
	      
	      Nofication nofication = new Nofication();
	      nofication.setTitle(title);
	      nofication.setContent(content);
	      nofication.setRole(role);
	      nofication.setRecipientId(recipient_id);
	      nofication.setStatus(status);
	      nofication.setLink(link);
	      return noficationRepository.save(nofication);
	  }
	  /*lấy chi tiết 1 danh mục theo id*/
	  @GetMapping("/nofication/{id}")
	  public ResponseEntity<Nofication> show(@PathVariable String id) {
	      return ResponseEntity.of(noficationRepository.findById(Integer.parseInt(id)));
	  }
	  @GetMapping("/nofications/{repicient_id}")
	  public List<Nofication> getbyrepicient(@PathVariable int repicient_id) {
	      return noficationRepository.findByRecipientId(repicient_id);
	  }


	  /*lấy danh sách danh mục trong thùng rác*/
	  @GetMapping("/nofication/trash")
	  public ResponseEntity<List<Nofication>> getNoficationsInTrash() {
	      List<Nofication> noficationsInTrash = noficationRepository.findByStatus(0);
	      return ResponseEntity.ok(noficationsInTrash);
	  }
	  /*update danh mục*/
	  @PutMapping("/nofication/update/{id}")
	  public ResponseEntity<Nofication> update(@PathVariable int id,
			  @RequestParam String title,
   			@RequestParam String content,
   			@RequestParam int recipient_id,
   			@RequestParam int status,
   			@RequestParam String link) throws IOException {
	      try {
	          Optional<Nofication> optionalNofication = noficationRepository.findById(id);

	          if (optionalNofication.isPresent()) {
	              Nofication nofication = optionalNofication.get();
	              nofication.setTitle(title);
	    	      nofication.setContent(content);
	    	      nofication.setRecipientId(recipient_id);
	    	      nofication.setStatus(status);
	    	      nofication.setLink(link);

	              
	              noficationRepository.save(nofication);

	              return ResponseEntity.ok(nofication);
	          } else {
	              return ResponseEntity.notFound().build(); 
	          }
	      } catch (Exception e) {
	          return ResponseEntity.status(500).build(); 
	      }
	  }
	  /*cập nhật trạng thái danh mục*/
	  @PutMapping("/nofication/updatestatus/{id}")
	   public ResponseEntity<Nofication> updateStatus(@PathVariable int id) {
	       try {
	           Optional<Nofication> optionalNofication = noficationRepository.findById(id);
	           
	           if (optionalNofication.isPresent()) {
	               Nofication nofication = optionalNofication.get();
	               
	               // Đảo ngược trạng thái: nếu là 1, chuyển thành 2; nếu là 2, chuyển thành 1
	               if (nofication.getStatus() == 1) {
	                   nofication.setStatus(2);
	               } else if (nofication.getStatus() == 2) {
	                   nofication.setStatus(1);
	               } else {
	                   return ResponseEntity.badRequest().build(); // Trạng thái không hợp lệ, trả về 400 Bad Request
	               }
	               
	               // Lưu sản phẩm đã cập nhật
	               noficationRepository.save(nofication);
	               
	               return ResponseEntity.ok(nofication);
	           } else {
	               return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	           }
	       } catch (Exception e) {
	           return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	       }
	   }
	  /*xóa vĩnh viễn*/
	  @DeleteMapping("/nofication/destroy/{id}")
	  public ResponseEntity<Void> destroy(@PathVariable String id) {
	      int noficationId = Integer.parseInt(id);
	      Optional<Nofication> existingNofication = noficationRepository.findById(noficationId);

	      if (existingNofication.isPresent()) {
	    	  noficationRepository.deleteById(noficationId);
	          return ResponseEntity.noContent().build();
	      } else {
	          return ResponseEntity.notFound().build();
	      }
	  }
	 
	  /*xóa danh mục vào thùng rác*/
	  @PutMapping("/nofication/delete/{id}")
	  public ResponseEntity<Nofication> deleteTrash(@PathVariable int id) {
	      try {
	          Optional<Nofication> optionalNofication = noficationRepository.findById(id);
	          
	          if (optionalNofication.isPresent()) {
	          	Nofication nofication = optionalNofication.get();
	              
	              // Thiết lập trạng thái mới cho sản phẩm là 0
	          	nofication.setStatus(0);
	              
	              // Lưu sản phẩm đã cập nhật
	          	noficationRepository.save(nofication);
	              
	              return ResponseEntity.ok(nofication);
	          } else {
	              return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	          }
	      } catch (Exception e) {
	          return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	      }
	  }
	  /*Khôi phục nofication*/
	  @PutMapping("/nofication/restore/{id}")
	  public ResponseEntity<Nofication> restoreTrash(@PathVariable int id) {
	      try {
	          Optional<Nofication> optionalNofication = noficationRepository.findById(id);
	          
	          if (optionalNofication.isPresent()) {
	          	Nofication nofication = optionalNofication.get();
	              
	              // Thiết lập trạng thái mới cho sản phẩm là 0
	          	nofication.setStatus(2);
	              
	              // Lưu sản phẩm đã cập nhật
	          	noficationRepository.save(nofication);
	              
	              return ResponseEntity.ok(nofication);
	          } else {
	              return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	          }
	      } catch (Exception e) {
	          return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	      }
	  }
}
