package com.plants.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.backend.data.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
    
}
