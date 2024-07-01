package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.DoAnTotNghiepjava.entity.Banner;
import com.example.DoAnTotNghiepjava.entity.Contact;
import com.example.DoAnTotNghiepjava.repository.ContactRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class ContactController {
	@Autowired
	 private JdbcTemplate jdbcTemplate;
	@Autowired
	ContactRepository contactRepository;
	/*lấy danh sách tất cả danh mục*/
	  @GetMapping("/contacts")
	  public List<Contact> index(){
	      return contactRepository.findAll();
	  }
	  /*thêm mới 1 danh mục*/
	  @PostMapping("/contact")
	  @ResponseStatus(HttpStatus.CREATED)
	  public Contact create(
	         			@RequestParam int status,
	         			@RequestParam int buyer_id,
	         			@RequestParam int seller_id,
	         			@RequestParam int sender_id,
	         			@RequestParam int receiver_id,
	         			@RequestParam String messageText) throws IOException {
	      Contact contact = new Contact();
	      contact.setStatus(status);
	      contact.setBuyerId(buyer_id);
	      contact.setSellerId(seller_id);
	      contact.setSenderId(sender_id);
	      contact.setReceiverId(receiver_id);
	      contact.setMessageText(messageText);
	      return contactRepository.save(contact);
	  }
	  /*lấy chi tiết 1 danh mục theo id*/
	  @GetMapping("/contact/{id}")
	  public ResponseEntity<Contact> show(@PathVariable String id) {
	      return ResponseEntity.of(contactRepository.findById(Integer.parseInt(id)));
	  }
	  @GetMapping("/contact/{sellerId}/{buyerId}")
	  public List<Contact> getMessagesBySellerAndBuyer(@PathVariable int sellerId, @PathVariable int buyerId) {
	      return contactRepository.findBySellerIdAndBuyerId(sellerId, buyerId);
	  }
	  @GetMapping("/contactseller/{receiverId}")
	  public List<Contact> getMessagesByReceiverId(@PathVariable int receiverId) {
	      return contactRepository.findByReceiverId(receiverId);
	  }
	  @GetMapping("/contacts-with-users/{seller_id}")
	  public ResponseEntity<List<List<Map<String, Object>>>> getContactsForSeller(@PathVariable("seller_id") int sellerId) {
	      String sql = "SELECT c.id AS contact_id, c.message_text, c.buyer_id, c.seller_id, c.sender_id, c.receiver_id, c.status, c.created_at, " +
	              "u1.id AS sender_id, u1.created_by AS sender_created_by, u1.status AS sender_status, u1.updated_by AS sender_updated_by, " +
	              "u1.firstname AS sender_firstname, u1.lastname AS sender_lastname, u1.username AS sender_username, u1.gender AS sender_gender, " +
	              "u1.phone AS sender_phone, u1.email AS sender_email, u1.role AS sender_role, u1.address AS sender_address, " +
	              "u1.image AS sender_image, u1.password AS sender_password, u1.created_at AS sender_created_at, u1.updated_at AS sender_updated_at, " +
	              "u2.id AS receiver_id, u2.created_by AS receiver_created_by, u2.status AS receiver_status, u2.updated_by AS receiver_updated_by, " +
	              "u2.firstname AS receiver_firstname, u2.lastname AS receiver_lastname, u2.username AS receiver_username, u2.gender AS receiver_gender, " +
	              "u2.phone AS receiver_phone, u2.email AS receiver_email, u2.role AS receiver_role, u2.address AS receiver_address, " +
	              "u2.image AS receiver_image, u2.password AS receiver_password, u2.created_at AS receiver_created_at, u2.updated_at AS receiver_updated_at " +
	              "FROM contacts c " +
	              "INNER JOIN users u1 ON c.sender_id = u1.id " +
	              "INNER JOIN users u2 ON c.receiver_id = u2.id " +
	              "WHERE c.receiver_id = ? " +
	              "ORDER BY c.created_at DESC"; 

	      List<Map<String, Object>> contacts = jdbcTemplate.queryForList(sql, sellerId);

	      // Sử dụng một HashMap để lưu trữ các dữ liệu theo sender_id
	      Map<Integer, List<Map<String, Object>>> contactsMap = new HashMap<>();
	      for (Map<String, Object> contact : contacts) {
	          int senderId = (int) contact.get("sender_id");
	          if (!contactsMap.containsKey(senderId)) {
	              contactsMap.put(senderId, new ArrayList<>());
	          }
	          contactsMap.get(senderId).add(contact);
	      }

	      // Sắp xếp các tin nhắn theo thời gian tạo giảm dần
	      for (List<Map<String, Object>> senderContacts : contactsMap.values()) {
	          senderContacts.sort((a, b) -> {
	              Timestamp timestampA = (Timestamp) a.get("created_at");
	              Timestamp timestampB = (Timestamp) b.get("created_at");
	              return timestampB.compareTo(timestampA);
	          });
	      }

	      // Chuyển các giá trị của Map thành một List
	      List<List<Map<String, Object>>> groupedContacts = new ArrayList<>(contactsMap.values());

	      return ResponseEntity.ok(groupedContacts);
	  }


	  @GetMapping("/contacts-with-sellerId/{seller_id}")
	  public ResponseEntity<List<Map<String, Object>>> getContactsWithUsers(@PathVariable("seller_id") int seller_id) {
	      String sql = "SELECT c.id AS contact_id, c.message_text, c.buyer_id, c.seller_id, c.sender_id, c.receiver_id, c.status, c.created_at, " +
	                   "u1.id AS sender_id, u1.created_by AS sender_created_by, u1.status AS sender_status, u1.updated_by AS sender_updated_by, " +
	                   "u1.firstname AS sender_firstname, u1.lastname AS sender_lastname, u1.username AS sender_username, u1.gender AS sender_gender, " +
	                   "u1.phone AS sender_phone, u1.email AS sender_email, u1.role AS sender_role, u1.address AS sender_address, " +
	                   "u1.image AS sender_image, u1.password AS sender_password, u1.created_at AS sender_created_at, u1.updated_at AS sender_updated_at, " +
	                   "u2.id AS receiver_id, u2.created_by AS receiver_created_by, u2.status AS receiver_status, u2.updated_by AS receiver_updated_by, " +
	                   "u2.firstname AS receiver_firstname, u2.lastname AS receiver_lastname, u2.username AS receiver_username, u2.gender AS receiver_gender, " +
	                   "u2.phone AS receiver_phone, u2.email AS receiver_email, u2.role AS receiver_role, u2.address AS receiver_address, " +
	                   "u2.image AS receiver_image, u2.password AS receiver_password, u2.created_at AS receiver_created_at, u2.updated_at AS receiver_updated_at " +
	                   "FROM contacts c " +
	                   "INNER JOIN users u1 ON c.sender_id = u1.id " +
	                   "INNER JOIN users u2 ON c.receiver_id = u2.id " +
	                   "WHERE c.seller_id = ?";

	      List<Map<String, Object>> contactsWithUsers = jdbcTemplate.queryForList(sql, seller_id);
	      return ResponseEntity.ok(contactsWithUsers);
	  }

	  @GetMapping("/contacts-with-buyerId/{buyer_id}")
	  public ResponseEntity<List<Map<String, Object>>> getContactsWithBuyerId(@PathVariable("buyer_id") int buyer_id) {
	      String sql = "SELECT c.id AS contact_id, c.message_text, c.buyer_id, c.seller_id, c.sender_id, c.receiver_id, c.status, c.created_at, " +
	                   "u1.id AS sender_id, u1.created_by AS sender_created_by, u1.status AS sender_status, u1.updated_by AS sender_updated_by, " +
	                   "u1.firstname AS sender_firstname, u1.lastname AS sender_lastname, u1.username AS sender_username, u1.gender AS sender_gender, " +
	                   "u1.phone AS sender_phone, u1.email AS sender_email, u1.role AS sender_role, u1.address AS sender_address, " +
	                   "u1.image AS sender_image, u1.password AS sender_password, u1.created_at AS sender_created_at, u1.updated_at AS sender_updated_at, " +
	                   "u2.id AS receiver_id, u2.created_by AS receiver_created_by, u2.status AS receiver_status, u2.updated_by AS receiver_updated_by, " +
	                   "u2.firstname AS receiver_firstname, u2.lastname AS receiver_lastname, u2.username AS receiver_username, u2.gender AS receiver_gender, " +
	                   "u2.phone AS receiver_phone, u2.email AS receiver_email, u2.role AS receiver_role, u2.address AS receiver_address, " +
	                   "u2.image AS receiver_image, u2.password AS receiver_password, u2.created_at AS receiver_created_at, u2.updated_at AS receiver_updated_at " +
	                   "FROM contacts c " +
	                   "INNER JOIN users u1 ON c.sender_id = u1.id " +
	                   "INNER JOIN users u2 ON c.receiver_id = u2.id " +
	                   "WHERE c.buyer_id = ?";

	      List<Map<String, Object>> getContactsWithBuyerId = jdbcTemplate.queryForList(sql, buyer_id);
	      return ResponseEntity.ok(getContactsWithBuyerId);
	  }


	  /*xóa vĩnh viễn*/
	  @DeleteMapping("/contact/destroy/{id}")
	  public ResponseEntity<Void> destroy(@PathVariable String id) {
	      int contactId = Integer.parseInt(id);
	      Optional<Contact> existingBanner = contactRepository.findById(contactId);

	      if (existingBanner.isPresent()) {
	    	  contactRepository.deleteById(contactId);
	          return ResponseEntity.noContent().build();
	      } else {
	          return ResponseEntity.notFound().build();
	      }
	  }
	  /*chỉnh sửa trạng thái sản phẩm*/
	   @PutMapping("/contact/updatestatus/{id}")
	   public ResponseEntity<Contact> updateStatus(@PathVariable int id) {
	       try {
	           Optional<Contact> optionalContact = contactRepository.findById(id);
	           
	           if (optionalContact.isPresent()) {
	               Contact contact = optionalContact.get();
	               
	               // Đảo ngược trạng thái: nếu là 1, chuyển thành 2; nếu là 2, chuyển thành 1
	               if (contact.getStatus() == 1) {
	                   contact.setStatus(2);
	               } else if (contact.getStatus() == 2) {
	                   contact.setStatus(1);
	               } else {
	                   return ResponseEntity.badRequest().build(); // Trạng thái không hợp lệ, trả về 400 Bad Request
	               }
	               
	               // Lưu sản phẩm đã cập nhật
	               contactRepository.save(contact);
	               
	               return ResponseEntity.ok(contact);
	           } else {
	               return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
	           }
	       } catch (Exception e) {
	           return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
	       }
	   }
}
