package com.example.DoAnTotNghiepjava.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.DoAnTotNghiepjava.entity.Product;
import com.example.DoAnTotNghiepjava.entity.ProductImage;

import com.example.DoAnTotNghiepjava.repository.ProductImageRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class ProductImageController {
	@Autowired
	ProductImageRepository productImageRepository;
	private static final String DEFAULT_FOLDER = "src/main/resources/static"; 
	  private static final Path CURRENT_FOLDER;

	  static {
	      String userDir = System.getProperty("product.dir");
	      if (userDir != null) {
	          CURRENT_FOLDER = Paths.get(userDir, DEFAULT_FOLDER);
	      } else {
	          CURRENT_FOLDER = Paths.get(DEFAULT_FOLDER);
	      }
	  }
	  
	  @PostMapping("/productimage")
	    @ResponseStatus(HttpStatus.CREATED)
	    public ProductImage create(@RequestParam int product_id,
	                       @RequestParam MultipartFile image) throws IOException {
	        Path staticPath = Paths.get("images/product");
	        Path imagePath = Paths.get("");
	        if (!Files.exists(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath))) {
	            Files.createDirectories(CURRENT_FOLDER.resolve(staticPath).resolve(imagePath));
	        }
	        Path file = CURRENT_FOLDER.resolve(staticPath)
	                .resolve(imagePath).resolve(image.getOriginalFilename());
	        try (OutputStream os = Files.newOutputStream(file)) {
	            os.write(image.getBytes());
	        }
	        ProductImage productimage = new ProductImage();
	        productimage.setProduct_id(product_id);
	        productimage.setImage(imagePath.resolve(image.getOriginalFilename()).toString());
	        return productImageRepository.save(productimage);
	    }
}
