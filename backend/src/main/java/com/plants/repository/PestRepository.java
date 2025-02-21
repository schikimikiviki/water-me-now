package com.plants.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.data.Common_pest;

public interface PestRepository extends JpaRepository<Common_pest, Long> {
	
    
}
