package com.example.DoAnTotNghiepjava.controller;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ImageController {
	   private static final String IMAGE_DIRECTORY = "/path/to/image/directory";

	    @GetMapping("/images")
	    public List<String> getImages() {
	        File directory = new File(IMAGE_DIRECTORY);
	        String[] files = directory.list();
	        return Arrays.asList(files != null ? files : new String[0]);
	    }
}
