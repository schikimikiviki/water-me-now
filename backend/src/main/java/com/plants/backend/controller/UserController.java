package com.plants.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.plants.backend.data.LoginRequest;
import com.plants.backend.data.User;
import com.plants.backend.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserDetailsService userDetailsService;
	
	private final PasswordEncoder passwordEncoder;


	private final UserService userService;


	public UserController(UserService userService, PasswordEncoder passwordEncoder) {
		this.userService = userService;
		this.passwordEncoder = passwordEncoder;
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
	
	
	@PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest,  HttpServletRequest httpRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (userDetails != null && passwordEncoder.matches(password, userDetails.getPassword())) {
        	
        	  HttpSession session = httpRequest.getSession(true); 
              session.setAttribute("user", username);
            return ResponseEntity.ok(Map.of("success", true, "message", "Login successful"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid credentials"));
        }
    }
	
	@GetMapping("/check-session")
	public ResponseEntity<?> checkSession(HttpSession session) {
	    if (session.getAttribute("user") != null) {
	        return ResponseEntity.ok("User is logged in");
	    } else {
	        return ResponseEntity.status(401).body("Not logged in");
	    }
	}

	
	/*
	 * @CrossOrigin(origins = "http://localhost:5173")
	 * 
	 * @GetMapping("/verify") public ResponseEntity<?>
	 * verifyAuth(@RequestHeader("Authorization") String authHeader) { if
	 * (authHeader == null || !authHeader.startsWith("Basic ")) { return
	 * ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false));
	 * }
	 * 
	 * String base64Credentials = authHeader.substring(6); // Remove "Basic " String
	 * credentials = new String(Base64.getDecoder().decode(base64Credentials));
	 * String[] values = credentials.split(":", 2);
	 * 
	 * if (values.length != 2) { return
	 * ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false));
	 * }
	 * 
	 * String username = values[0]; String password = values[1];
	 * 
	 * UserDetails userDetails = userDetailsService.loadUserByUsername(username);
	 * 
	 * if (userDetails != null && passwordEncoder.matches(password,
	 * userDetails.getPassword())) { return ResponseEntity.ok(Map.of("valid",
	 * true)); } else { return
	 * ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false));
	 * } }
	 */


}
