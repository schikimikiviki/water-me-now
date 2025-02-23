package com.plants.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.backend.data.Common_pest;

public interface PestRepository extends JpaRepository<Common_pest, Long> {
	
    
}
