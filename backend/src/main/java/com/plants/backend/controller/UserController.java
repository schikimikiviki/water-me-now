package com.plants.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.plants.backend.data.User;
import com.plants.backend.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {



	private final UserService userService;


	public UserController(UserService userService) {
		this.userService = userService;
	}


	@GetMapping("/all")
	public List<User> getAllUsers(){
		return userService.findAll();
	}

	@GetMapping("/id/{Id}")
	public Optional<User> getUserById(@PathVariable Long Id) {
		return userService.findUserById(Id);
	}
	

	@PatchMapping("/{userId}")
	public ResponseEntity<User> editUser(@PathVariable Long userId, @RequestBody Map<String, Object> updates) {
	    Optional<User> foundUserOptional = userService.findUserById(userId);

	    if (foundUserOptional.isPresent()) {
	        User foundUser = foundUserOptional.get();

	        updates.forEach((key, value) -> {
	            switch (key) {
	             
	                case "name":
	                	foundUser.setName((String) value);
	                case "password":
	                	foundUser.setPassword((String) value);
	                
	                default:
	                    throw new IllegalArgumentException("Invalid field: " + key);
	            }
	        });

	        User updatedUser = userService.save(foundUser);
	        return ResponseEntity.ok(updatedUser);
	    }

	    return ResponseEntity.notFound().build();
	}

	


	@DeleteMapping("/{userId}")
	public ResponseEntity<?> deletePlantTask(@PathVariable Long userId) {
		try {
			userService.deleteUserById(userId);
			return ResponseEntity.ok(Map.of("success", true, "message", "User  deleted successfully"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("success", false, "message", "User not found"));
		}
	}

}
