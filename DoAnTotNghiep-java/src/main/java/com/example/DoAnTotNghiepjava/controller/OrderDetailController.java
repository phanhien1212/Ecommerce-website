package com.example.DoAnTotNghiepjava.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import com.example.DoAnTotNghiepjava.entity.OrderDetail;
import com.example.DoAnTotNghiepjava.repository.OrderDetailRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class OrderDetailController {
	@Autowired
	OrderDetailRepository orderDetailRepository;
	@GetMapping("/orderdetails")
	public List<OrderDetail> index(){
	    return (List<OrderDetail>) orderDetailRepository.findAll();
	}
	/*thêm mới 1 danh mục*/
	 @PostMapping("/orderdetail")
	    public OrderDetail create(@RequestBody OrderDetail orderdetail) {
	        return orderDetailRepository.save(orderdetail);
	    }

	/*lấy chi tiết 1 danh mục theo id*/
	@GetMapping("/orderdetail/{id}")
	public ResponseEntity<OrderDetail> show(@PathVariable String id) {
	    return ResponseEntity.of(orderDetailRepository.findById((long) Integer.parseInt(id)));
	}
	@GetMapping("/orderdetails/order/{orderId}")
	public List<OrderDetail> getOrderDetailsByOrderId(@PathVariable Integer orderId) {
	    return orderDetailRepository.findByOrderId(orderId);
	}

	   
	   /*update sản phẩm*/
	/*xóa vĩnh viễn*/
	@DeleteMapping("/orderdetail/destroy/{id}")
	public ResponseEntity<Void> destroy(@PathVariable String id) {
	    int orderDetailId = Integer.parseInt(id);
	    Optional<OrderDetail> existingOrderDetail = orderDetailRepository.findById((long) orderDetailId);

	    if (existingOrderDetail.isPresent()) {
	    	orderDetailRepository.deleteById((long) orderDetailId);
	        return ResponseEntity.noContent().build();
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	@PutMapping("/orderdetail/updatestatus/{id}")
	public ResponseEntity<OrderDetail> updateStatus(@PathVariable int id, @RequestParam int status) {
	    try {
	        Optional<OrderDetail> optionalOrderDetail = orderDetailRepository.findById(id);
	        
	        if (optionalOrderDetail.isPresent()) {
	            OrderDetail orderDetail = optionalOrderDetail.get();
	            
	            // Cập nhật trạng thái của đơn hàng
	            orderDetail.setStatus(status);
	            
	            // Lưu cập nhật trạng thái vào cơ sở dữ liệu
	            orderDetailRepository.save(orderDetail);
	            
	            return ResponseEntity.ok(orderDetail);
	        } else {
	            // Trả về lỗi nếu không tìm thấy đơn hàng
	            return ResponseEntity.notFound().build(); 
	        }
	    } catch (Exception e) {
	        // Trả về lỗi nếu có lỗi xảy ra trong quá trình xử lý
	        return ResponseEntity.status(500).build(); 
	    }
	}

	
}
