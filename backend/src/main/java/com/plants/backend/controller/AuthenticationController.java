package com.plants.backend.controller;

import com.plants.backend.data.dtos.LoginUserDto;
import com.plants.backend.data.dtos.RegisterUserDto;
import com.plants.backend.data.entities.User;
import com.plants.backend.service.AuthenticationService;
import com.plants.backend.service.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);

        return ResponseEntity.ok(registeredUser);
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(HttpServletRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            return ResponseEntity.ok().build(); // or return user info if needed
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto, HttpServletResponse response) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        // Create HTTP-only cookie
        Cookie cookie = new Cookie("token", jwtToken);
        cookie.setHttpOnly(true);  // Prevents access to the cookie via JavaScript
        //cookie.setSecure(true);     // Ensures cookie is sent only over HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(3600);

        //cookie.setDomain("your-domain.com");  
        response.addCookie(cookie);


        LoginResponse loginResponse = new LoginResponse().setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }

    /*
     * @PostMapping("/login") public ResponseEntity<LoginResponse>
     * authenticate(@RequestBody LoginUserDto loginUserDto) {
     * System.out.println("Login endpoint hit"); User authenticatedUser =
     * authenticationService.authenticate(loginUserDto);
     *
     * String jwtToken = jwtService.generateToken(authenticatedUser);
     *
     * LoginResponse loginResponse = new
     * LoginResponse().setToken(jwtToken).setExpiresIn(jwtService.getExpirationTime(
     * ));
     *
     * return ResponseEntity.ok(loginResponse); }
     */
}