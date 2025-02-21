package com.plants.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.data.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
    
}
