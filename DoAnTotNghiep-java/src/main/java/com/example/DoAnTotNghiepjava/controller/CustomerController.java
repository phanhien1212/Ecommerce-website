package com.example.DoAnTotNghiepjava.controller;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.DoAnTotNghiepjava.entity.User;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class CustomerController {
	@Autowired
    com.example.DoAnTotNghiepjava.repository.CustomerRepository customerRepository;
	
	private static final String DEFAULT_FOLDER = "src/main/resources/static"; 
	  private static final Path CURRENT_FOLDER;

	  static {
	      String userDir = System.getProperty("customer.dir");
	      if (userDir != null) {
	          CURRENT_FOLDER = Paths.get(userDir, DEFAULT_FOLDER);
	      } else {
	          CURRENT_FOLDER = Paths.get(DEFAULT_FOLDER);
	      }
	  }
	
	  /*lấy user có role là khách hàng*/
	 @GetMapping("/customers")
	    public List<User> getCustomers() {
	        List<User> customers = customerRepository.findAllCustomers();
	        return customers;
	    }
	 
	 /*hiện khách hàng trong thùng rác*/
	 @GetMapping("/customers/trash")
	    public List<User> getCustomersTrash() {
	        List<User> customers = customerRepository.findAllCustomers();
	        customers.removeIf(customer -> customer.getStatus() != 0);
	        return customers;
	    }
	 
	 /*hiện khách hàng theo id*/
	 @GetMapping("/customer/{id}")
	    public Optional<User> getCustomerById(@PathVariable Integer id) {
	        Optional<User> customer = customerRepository.findCustomerByIdAndRole(id, "customer");
	        return customer;
	    }
	 
	 
	 /*update khách hàng*/
	 @PutMapping("/customer/update/{id}")
	    public ResponseEntity<User> updateCustomer(@PathVariable int id,
	            
	            @RequestParam String firstname,
	            @RequestParam String lastname,
	            @RequestParam String username,
	            @RequestParam String gender,
	            @RequestParam String phone,
	            @RequestParam String email,
	            @RequestParam String password,
	            @RequestParam String role,
	            @RequestParam int updated_by,
	            @RequestParam String address,
	            @RequestParam int status,
	            @RequestParam MultipartFile image
	    ) throws IOException {
	        try {
	            Optional<User> optionalUser = customerRepository.findById(id);

	            if (optionalUser.isPresent()) {
	                User user = optionalUser.get();
	                user.setFirstname(firstname);
	                user.setLastname(lastname);
	                user.setUsername(username);
	                user.setGender(gender);
	                user.setPhone(phone);
	                user.setEmail(email);
	                user.setPassword(password);
	                user.setRole(role);
	                user.setAddress(address);
	                user.setStatus(status);
	                user.setUpdated_by(updated_by);
	                
	                // Xử lý ảnh
	                if (image != null && !image.isEmpty()) { 
	                    Path staticPath = Paths.get("images/customer");
	                    Path imagePath = Paths.get("");
	                    if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
	                        Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
	                    }
	                    Path file = CURRENT_FOLDER.resolve(staticPath)
	                            .resolve(imagePath).resolve(image.getOriginalFilename());
	                    try (OutputStream os = Files.newOutputStream(file)) {
	                        os.write(image.getBytes());
	                    }
	                    user.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
	                }
	                // Lưu thông tin của khách hàng đã cập nhật vào cơ sở dữ liệu
	                User savedUser = customerRepository.save(user);

	                return ResponseEntity.ok(savedUser);
	            } else {
	                return ResponseEntity.notFound().build();
	            }
	        } catch (Exception e) {
	            return ResponseEntity.status(500).build();
	        }
	    }
	 
	 
	 
	 /*chỉnh sửa trạng thái khách hàng*/
	   @PutMapping("/customer/updatestatus/{id}")
	   public ResponseEntity<User> updateStatus(@PathVariable int id) {
	       try {
	           Optional<User> optionalUser = customerRepository.findById(id);
	           
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
	               customerRepository.save(user);
	               
	               return ResponseEntity.ok(user);
	           } else {
	               return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	           }
	       } catch (Exception e) {
	           return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	       }
	   }
	 
	 /*xóa khách hàng vào thùng rác*/
	 @PutMapping("/customer/delete/{id}")
	 public ResponseEntity<User> deleteTrash(@PathVariable int id) {
	     try {
	         Optional<User> optionalUser = customerRepository.findById(id);
	         
	         if (optionalUser.isPresent()) {
	             User user = optionalUser.get();
	             
	             // Thiết lập trạng thái mới cho sản phẩm là 0
	             user.setStatus(0);
	             
	             // Lưu sản phẩm đã cập nhật
	             customerRepository.save(user);
	             
	             return ResponseEntity.ok(user);
	         } else {
	             return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	         }
	     } catch (Exception e) {
	         return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	     }
	 }
	 
	 
	 @DeleteMapping("/customer/destroy/{id}")
	    public ResponseEntity<Void> destroy(@PathVariable String id) {
	        int userId = Integer.parseInt(id);
	        Optional<User> existingUser = customerRepository.findById(userId);

	        if (existingUser.isPresent()) {
	        	customerRepository.deleteById(userId);
	            return ResponseEntity.noContent().build();
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	
	 
	 
	 /*khôi phục khách hàng*/
	 @PutMapping("/customer/restore/{id}")
	 public ResponseEntity<User> restoreTrash(@PathVariable int id) {
	     try {
	         Optional<User> optionalUser = customerRepository.findById(id);
	         
	         if (optionalUser.isPresent()) {
	             User user = optionalUser.get();
	             
	             // Thiết lập trạng thái mới cho sản phẩm là 0
	             user.setStatus(2);
	             
	             // Lưu sản phẩm đã cập nhật
	             customerRepository.save(user);
	             
	             return ResponseEntity.ok(user);
	         } else {
	             return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	         }
	     } catch (Exception e) {
	         return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	     }
	 }
}
