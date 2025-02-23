package com.plants.backend.data;

public class LoginRequest {
    private String username;
    private String password;

    // Getters and setters
    
    public void setUsername(String username) {
    	this.username = username; 
    }
    
    public String getUsername () {
    	return this.username;
    }
    
    public void setPassword(String password) {
    	this.password = password; 
    }
    
    public String getPassword () {
    	return this.password;
    }
}
