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

import com.example.DoAnTotNghiepjava.entity.Topic;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class TopicController {
	@Autowired
    com.example.DoAnTotNghiepjava.repository.TopicRepository topicRepository;
	
	  /*lấy danh sách tất cả sản phẩm*/
	   @GetMapping("/topics")
	    public List<Topic> index(){
	        return topicRepository.findAll();
	    }
	   
	   /*thêm mới sản phẩm*/
	   @PostMapping("/topic")
	    @ResponseStatus(HttpStatus.CREATED)
	    public Topic create(@RequestParam String name,
               			@RequestParam String description,
               			@RequestParam int created_by,
               			@RequestParam int status,
               			@RequestParam int sort_order) throws IOException {
	      
	        Topic topic = new Topic();
	        topic.setName(name);
	        topic.setDescription(description);
	        topic.setCreated_by(created_by);
	        topic.setStatus(status);
	        topic.setSort_order(sort_order);
	        return topicRepository.save(topic);
	    }
	   /*hiển thị chi tiết sản phẩm theo id*/
	    
	   @GetMapping("/topic/{id}")
	    public ResponseEntity<Topic> show(@PathVariable String id) {
	        return ResponseEntity.of(topicRepository.findById(Integer.parseInt(id)));
	    }
	   /*hiển thị chi tiết sản phẩm theo slug*/
	   @GetMapping("/topic/showbySlug/{slug}")
	   public ResponseEntity<Topic> showBySlug(@PathVariable String slug) {
		    List<Topic> topics = topicRepository.findBySlug(slug);

		    if (!topics.isEmpty()) {
		        return ResponseEntity.ok(topics.get(0));
		    } else {
		        return ResponseEntity.notFound().build();
		    }
		}
	   /*lấy danh sách sản phẩm trong thùng rác*/
	   @GetMapping("/topic/trash")
	    public ResponseEntity<List<Topic>> getTopicsInTrash() {
	        List<Topic> topicsInTrash = topicRepository.findByStatus(0);
	        return ResponseEntity.ok(topicsInTrash);
	    }

	   
	   /*update sản phẩm*/
	   @PutMapping("/topic/{id}")
	   public ResponseEntity<Topic> update(
			   @PathVariable int id,
			   @RequestParam String name,
      			@RequestParam String description,
      			@RequestParam int updated_by,
      			@RequestParam int status,
      			@RequestParam int sort_order) throws IOException {
	       try {
	           Optional<Topic> optionalTopic = topicRepository.findById(id);

	           if (optionalTopic.isPresent()) {
	               Topic topic = optionalTopic.get();
	               topic.setName(name);
	   	        topic.setDescription(description);
	   	        topic.setUpdated_by(updated_by);
	   	        topic.setStatus(status);
	   	        topic.setSort_order(sort_order);

	               topicRepository.save(topic);

	               return ResponseEntity.ok(topic);
	           } else {
	               return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	           }
	       } catch (Exception e) {
	           return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	       }
	   }
	   /*chỉnh sửa trạng thái sản phẩm*/
	   @PutMapping("/topic/updatestatus/{id}")
	   public ResponseEntity<Topic> updateStatus(@PathVariable int id) {
	       try {
	           Optional<Topic> optionalTopic = topicRepository.findById(id);
	           
	           if (optionalTopic.isPresent()) {
	               Topic topic = optionalTopic.get();
	               
	               // Đảo ngược trạng thái: nếu là 1, chuyển thành 2; nếu là 2, chuyển thành 1
	               if (topic.getStatus() == 1) {
	                   topic.setStatus(2);
	               } else if (topic.getStatus() == 2) {
	                   topic.setStatus(1);
	               } else {
	                   return ResponseEntity.badRequest().build(); // Trạng thái không hợp lệ, trả về 400 Bad Request
	               }
	               
	               // Lưu sản phẩm đã cập nhật
	               topicRepository.save(topic);
	               
	               return ResponseEntity.ok(topic);
	           } else {
	               return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	           }
	       } catch (Exception e) {
	           return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	       }
	   }


	   /*xóa vĩnh viễn*/
	   @DeleteMapping("/topic/destroy/{id}")
	    public ResponseEntity<Void> destroy(@PathVariable String id) {
	        int topicId = Integer.parseInt(id);
	        Optional<Topic> existingTopic = topicRepository.findById(topicId);

	        if (existingTopic.isPresent()) {
	            topicRepository.deleteById(topicId);
	            return ResponseEntity.noContent().build();
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
		 /*xóa sản phẩm vào thùng rác*/
		 @PutMapping("/topic/delete/{id}")
		 public ResponseEntity<Topic> deleteTrash(@PathVariable int id) {
		     try {
		         Optional<Topic> optionalTopic = topicRepository.findById(id);
		         
		         if (optionalTopic.isPresent()) {
		             Topic topic = optionalTopic.get();
		             
		             // Thiết lập trạng thái mới cho sản phẩm là 0
		             topic.setStatus(0);
		             
		             // Lưu sản phẩm đã cập nhật
		             topicRepository.save(topic);
		             
		             return ResponseEntity.ok(topic);
		         } else {
		             return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
		         }
		     } catch (Exception e) {
		         return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		     }
		 }

		 /*khôi phục sản phẩm*/
		 @PutMapping("/topic/restore/{id}")
		 public ResponseEntity<Topic> restoreTrash(@PathVariable int id) {
		     try {
		         Optional<Topic> optionalTopic = topicRepository.findById(id);
		         
		         if (optionalTopic.isPresent()) {
		             Topic topic = optionalTopic.get();
		             
		             // Thiết lập trạng thái mới cho sản phẩm là 0
		             topic.setStatus(2);
		             
		             // Lưu sản phẩm đã cập nhật
		             topicRepository.save(topic);
		             
		             return ResponseEntity.ok(topic);
		         } else {
		             return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
		         }
		     } catch (Exception e) {
		         return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
		     }
		 }

}
