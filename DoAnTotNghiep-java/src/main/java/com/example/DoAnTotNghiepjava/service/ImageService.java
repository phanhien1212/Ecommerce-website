package com.example.DoAnTotNghiepjava.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {
	 private final Path productImagesPath = Paths.get("src/main/resources/static/images/product");

	    public String uploadProductImage(MultipartFile file) throws IOException {
	        if (file.isEmpty()) {
	            throw new IllegalArgumentException("File is empty");
	        }

	        // Create the directory if it doesn't exist
	        Files.createDirectories(productImagesPath);

	        // Resolve the file path
	        Path imagePath = productImagesPath.resolve(file.getOriginalFilename());

	        // Copy the file to the target location
	        Files.copy(file.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

	        return imagePath.toString();
	    }

	    public Resource loadProductImage(String filename) throws MalformedURLException {
	        Path imagePath = productImagesPath.resolve(filename);
	        Resource resource = new UrlResource(imagePath.toUri());

	        if (!resource.exists() || !resource.isReadable()) {
	            throw new RuntimeException("Could not read the image file: " + filename);
	        }

	        return resource;
	    }
}
