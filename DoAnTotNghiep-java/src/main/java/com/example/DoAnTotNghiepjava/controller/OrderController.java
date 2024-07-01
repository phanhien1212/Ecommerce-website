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
import org.springframework.jdbc.core.JdbcTemplate;
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
import com.example.DoAnTotNghiepjava.repository.OrderRepository;
@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class OrderController {
	@Autowired
	 private JdbcTemplate jdbcTemplate;
	@Autowired
	OrderRepository orderRepository;
	
/*lấy danh sách tất cả danh mục*/
@GetMapping("/orders")
public List<Order> index(){
    return orderRepository.findAll();
}
/*thêm mới 1 danh mục*/
@PostMapping("/order")
public Order create(@RequestBody Order order) {
    return orderRepository.save(order);
}

/*lấy chi tiết 1 danh mục theo id*/
@GetMapping("/order/{id}")
public ResponseEntity<Order> show(@PathVariable String id) {
    return ResponseEntity.of(orderRepository.findById(Integer.parseInt(id)));
}
@GetMapping("/orders-with-details")
public ResponseEntity<List<Map<String, Object>>> getOrdersWithDetails() {
    String sql = "SELECT o.id AS order_id, " +
                 "o.user_id, o.note, o.delivery_address, o.delivery_name, o.delivery_phone, o.delivery_email, " +
                 "  o.total AS order_total, " +
                 "o.status AS order_status, od.id AS order_detail_id, " +
                 " od.product_id, od.qty AS order_detail_qty, od.created_at as order_detail_created, " +
                 "od.discount AS order_detail_discount, od.status AS order_detail_status,od.amount AS order_detail_amount, od.price AS order_detail_price, " +
                 "od.attribute AS order_detail_attribute,od.id AS order_detail_id, p.name AS product_name, p.slug AS product_slug, " +
                 "p.price AS product_price, p.image AS product_image, p.detail AS product_detail, " +
                 "p.description AS product_description, p.created_by AS product_created_by, p.updated_by AS product_updated_by, " +
                 "p.status AS product_status, p.category_id, p.seller_id, p.stockquantity AS product_stockquantity " +
                 "FROM orders o " +
                 "INNER JOIN orderdetails od ON o.id = od.order_id " +
                 "INNER JOIN products p ON od.product_id = p.id";

    List<Map<String, Object>> ordersWithDetails = jdbcTemplate.queryForList(sql);
    return ResponseEntity.ok(ordersWithDetails);
}


@GetMapping("/orders-with-details/{orderId}")
public ResponseEntity<List<Map<String, Object>>> getOrderDetailWithOrderId(@PathVariable("orderId") Long orderId) {
    String sql = "SELECT o.id AS order_id, " +
                 "o.user_id, o.note, o.delivery_address, o.delivery_name, o.delivery_phone, o.delivery_email, " +
                 "o.total AS order_total, " +
                 "o.status AS order_status, od.id AS order_detail_id, " +
                 "od.product_id, od.qty AS order_detail_qty, " +
                 "od.discount AS order_detail_discount, od.status AS order_detail_status, od.amount AS order_detail_amount, od.price AS order_detail_price, " +
                 "od.attribute AS order_detail_attribute, od.id AS order_detail_id,p.name AS product_name, p.slug AS product_slug, " +
                 "p.price AS product_price, p.image AS product_image, p.detail AS product_detail, " +
                 "p.description AS product_description, p.created_by AS product_created_by, p.updated_by AS product_updated_by, " +
                 "p.status AS product_status, p.category_id, p.seller_id, p.stockquantity AS product_stockquantity " +
                 "FROM orders o " +
                 "INNER JOIN orderdetails od ON o.id = od.order_id " +
                 "INNER JOIN products p ON od.product_id = p.id " +
                 "WHERE o.id = ?";

    List<Map<String, Object>> orderWithDetailsList = jdbcTemplate.queryForList(sql, orderId);
    return ResponseEntity.ok(orderWithDetailsList);
}
@GetMapping("/orderdetails-by-id/{orderId}")
public ResponseEntity<Map<String, Object>> getOrderDetailsByOrderId(@PathVariable("orderId") Long orderId) {
    String sql = "SELECT od.id AS order_detail_id, " +
                 "od.product_id, od.qty AS order_detail_qty, " +
                 "od.discount AS order_detail_discount, od.status AS order_detail_status, od.amount AS order_detail_amount, od.price AS order_detail_price, " +
                 "od.attribute AS order_detail_attribute, p.name AS product_name, p.slug AS product_slug, " +
                 "p.price AS product_price, p.image AS product_image, p.detail AS product_detail, " +
                 "p.description AS product_description, p.created_by AS product_created_by, p.updated_by AS product_updated_by, " +
                 "p.status AS product_status, p.category_id, p.seller_id, p.stockquantity AS product_stockquantity " +
                 "FROM orderdetails od " +
                 "INNER JOIN products p ON od.product_id = p.id " +
                 "WHERE od.id = ?";

    Map<String, Object> orderDetails = jdbcTemplate.queryForMap(sql, orderId);
    return ResponseEntity.ok(orderDetails);
}




/*lấy danh sách danh mục trong thùng rác*/
@GetMapping("/order/trash")
public ResponseEntity<List<Order>> getOrdersInTrash() {
    List<Order> ordersInTrash = orderRepository.findByStatus(0);
    return ResponseEntity.ok(ordersInTrash);
}

/*update danh mục*/
@PutMapping("/order/update/{id}")
public ResponseEntity<Order> update(@PathVariable int id,
		@RequestParam int user_id,
			@RequestParam String note,
			@RequestParam String delivery_name,
			@RequestParam String delivery_phone,
			@RequestParam String delivery_address,
			@RequestParam String delivery_email,
			@RequestParam int updated_by,
			@RequestParam double total,
			@RequestParam int status) throws IOException {
    try {
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setUser_id(user_id);
            order.setNote(note);
            order.setDeliveryName(delivery_name);
            order.setDeliveryPhone(delivery_phone);
            order.setDeliveryEmail(delivery_email);
            order.setUpdated_by(updated_by);
            order.setDeliveryAddress(delivery_address);
            order.setTotal(total);
            order.setStatus(status);

         
            // Lưu sản phẩm đã cập n
            orderRepository.save(order);

            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build(); 
        }
    } catch (Exception e) {
        return ResponseEntity.status(500).build(); 
    }
}
/*cập nhật trạng thái danh mục*/
@PutMapping("/order/updatestatus/{id}")
public ResponseEntity<Order> updateStatus(@PathVariable int id, @RequestParam int status) {
    try {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            
            // Cập nhật trạng thái của đơn hàng
            order.setStatus(status);
            
            // Lưu cập nhật trạng thái vào cơ sở dữ liệu
            orderRepository.save(order);
            
            return ResponseEntity.ok(order);
        } else {
            // Trả về lỗi nếu không tìm thấy đơn hàng
            return ResponseEntity.notFound().build(); 
        }
    } catch (Exception e) {
        // Trả về lỗi nếu có lỗi xảy ra trong quá trình xử lý
        return ResponseEntity.status(500).build(); 
    }
}

/*xóa vĩnh viễn*/
@DeleteMapping("/order/destroy/{id}")
public ResponseEntity<Void> destroy(@PathVariable String id) {
    int orderId = Integer.parseInt(id);
    Optional<Order> existingOrder = orderRepository.findById(orderId);

    if (existingOrder.isPresent()) {
    	orderRepository.deleteById(orderId);
        return ResponseEntity.noContent().build();
    } else {
        return ResponseEntity.notFound().build();
    }
}

/*xóa danh mục vào thùng rác*/
@PutMapping("/order/delete/{id}")
public ResponseEntity<Order> deleteTrash(@PathVariable int id) {
    try {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        
        if (optionalOrder.isPresent()) {
        	Order order = optionalOrder.get();
            
            // Thiết lập trạng thái mới cho sản phẩm là 0
        	order.setStatus(0);
            
            // Lưu sản phẩm đã cập nhật
        	orderRepository.save(order);
            
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
        }
    } catch (Exception e) {
        return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
    }
}

/*khôi phục danh mục*/
@PutMapping("/order/restore/{id}")
public ResponseEntity<Order> destroyTrash(@PathVariable int id) {
    try {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        
        if (optionalOrder.isPresent()) {
        	Order order = optionalOrder.get();
            
            // Thiết lập trạng thái mới cho sản phẩm là 0
        	order.setStatus(2);
            
            // Lưu sản phẩm đã cập nhật
        	orderRepository.save(order);
            
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build(); // Không tìm thấy sản phẩm với id tương ứng, trả về 404 Not Found
        }
    } catch (Exception e) {
        return ResponseEntity.status(500).build(); // Có lỗi xảy ra, trả về 500 Internal Server Error
    }
}
}
