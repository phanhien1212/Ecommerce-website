package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.util.List;
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

import com.example.DoAnTotNghiepjava.entity.Transaction;
import com.example.DoAnTotNghiepjava.repository.TransactionRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class TransactionController { 
	@Autowired
	TransactionRepository transactionRepository;
	
/*lấy danh sách tất cả danh mục*/
@GetMapping("/transactions")
public List<Transaction> index(){
    return transactionRepository.findAll();
}
/*thêm mới 1 danh mục*/
@PostMapping("/createTransaction")
@ResponseStatus(HttpStatus.CREATED)
public Transaction create(
       			@RequestParam int order_id,
       			@RequestParam double amount,
       			@RequestParam String payment_method,
       			@RequestParam String description
                   ) throws IOException {
   
    Transaction transaction = new Transaction();
    transaction.setOrder_id(order_id);
    transaction.setAmount(amount);
    transaction.setPayment_method(payment_method);
    transaction.setDescription(description);
    
    return transactionRepository.save(transaction);
}
@PostMapping("/transaction")
public Transaction createtransaction(@RequestBody Transaction transaction) {
    return transactionRepository.save(transaction);
}
/*lấy chi tiết 1 danh mục theo id*/
@GetMapping("/transaction/{id}")
public ResponseEntity<Transaction> show(@PathVariable String id) {
    return ResponseEntity.of(transactionRepository.findById(Integer.parseInt(id)));
}
/*update danh mục*/

@PutMapping("/transaction/{id}")
public ResponseEntity<Transaction> update(@PathVariable int id,
		
		@RequestParam int order_id,
			@RequestParam double amount,
			@RequestParam String payment_method,
			@RequestParam String description) throws IOException {
    try {
        Optional<Transaction> optionalTransaction = transactionRepository.findById(id);

        if (optionalTransaction.isPresent()) {
            Transaction transaction = optionalTransaction.get();
            transaction.setOrder_id(order_id);
            transaction.setAmount(amount);
            transaction.setPayment_method(payment_method);
            transaction.setDescription(description);
           
            transactionRepository.save(transaction);

            return ResponseEntity.ok(transaction);
        } else {
            return ResponseEntity.notFound().build(); 
        }
    } catch (Exception e) {
        return ResponseEntity.status(500).build(); 
    }
    
}



/*xóa vĩnh viễn*/
@DeleteMapping("/transaction/destroy/{id}")
public ResponseEntity<Void> destroy(@PathVariable String id) {
    int transactionId = Integer.parseInt(id);
    Optional<Transaction> existingTransaction = transactionRepository.findById(transactionId);

    if (existingTransaction.isPresent()) {
    	transactionRepository.deleteById(transactionId);
        return ResponseEntity.noContent().build();
    } else {
        return ResponseEntity.notFound().build();
    }
}


}