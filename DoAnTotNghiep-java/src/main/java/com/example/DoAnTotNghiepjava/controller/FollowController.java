package com.example.DoAnTotNghiepjava.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.DoAnTotNghiepjava.entity.Follow;
import com.example.DoAnTotNghiepjava.entity.ShopProfile;
import com.example.DoAnTotNghiepjava.entity.User;
import com.example.DoAnTotNghiepjava.repository.ShopProfileRepository;
import com.example.DoAnTotNghiepjava.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class FollowController {
	@Autowired
	com.example.DoAnTotNghiepjava.repository.FollowRepository followRepository;
	 @Autowired
		private UserRepository userRepository;

	    @Autowired
	    private ShopProfileRepository shopprofileRepository;
	/*lấy danh sách tất cả danh mục*/
	  @GetMapping("/follows")
	  public List<Follow> index(){
	      return (List<Follow>) followRepository.findAll();
	  }
	  
	  
	  @PostMapping("/follow")
	    public ResponseEntity<Follow> followShop(@RequestBody Follow follow) {
	        // Lưu đối tượng Follow vào cơ sở dữ liệu
	        Follow savedFollow = followRepository.save(follow);
	        
	        // Kiểm tra xem đối tượng Follow đã được lưu thành công hay không
	        if(savedFollow != null) {
	            return new ResponseEntity<>(savedFollow, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	  
	  /*xóa vĩnh viễn*/
	  @DeleteMapping("/follow/destroy/{id}")
	  public ResponseEntity<Void> destroy(@PathVariable String id) {
	      int followid = Integer.parseInt(id);
	      Optional<Follow> existingBanner = followRepository.findById((long) followid);

	      if (existingBanner.isPresent()) {
	    	  followRepository.deleteById((long) followid);
	          return ResponseEntity.noContent().build();
	      } else {
	          return ResponseEntity.notFound().build();
	      }
	  }
	  
	  
	  @PostMapping("/unfollow")
	    public ResponseEntity<String> unfollowShop(@RequestBody Follow follow) {
	        // Kiểm tra xem liệu đối tượng follow có tồn tại trong cơ sở dữ liệu không
	        Follow existingFollow = followRepository.findByUserIdAndShopId(follow.getUser_id(), follow.getShop_id());
	        if (existingFollow != null) {
	            // Nếu tồn tại, xóa đối tượng follow khỏi cơ sở dữ liệu
	            followRepository.delete(existingFollow);
	            return new ResponseEntity<>("Successfully unfollowed shop", HttpStatus.OK);
	        } else {
	            // Nếu không tồn tại, trả về thông báo lỗi và mã HTTP 404 Not Found
	            return new ResponseEntity<>("Follow record not found", HttpStatus.NOT_FOUND);
	        }
	    }
	  
	  @GetMapping("/isFollowing")
	    public ResponseEntity<Map<String, Boolean>> isFollowing(@RequestParam int user_id, @RequestParam int shop_id) {
	        // Kiểm tra xem người dùng đã theo dõi cửa hàng hay chưa
	        boolean isFollowing = followRepository.existsByUserIdAndShopId(user_id, shop_id);
	        Map<String, Boolean> response = new HashMap<>();
	        response.put("isFollowing", isFollowing);
	        return ResponseEntity.ok(response);
	    }
	  
	  
	  @GetMapping("/followedShops")
	    public List<ShopProfile> getFollowedShops(@RequestParam("userId") int userId) {
	        return followRepository.findShopsFollowedByUserId(userId);
	    }
	  @GetMapping("/followeduserShop")
	    public List<User> getUserFollowedShops(@RequestParam("shopId") int shopId) {
	        return followRepository.findUsersFollowingShopId(shopId);
	    }
	  
	  @GetMapping("/{shopId}/followers/count")
	    public long getFollowersCount(@PathVariable int shopId) {
	        return followRepository.countFollowersByShopId(shopId);
	    }

}
