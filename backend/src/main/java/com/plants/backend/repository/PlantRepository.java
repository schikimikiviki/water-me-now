package com.plants.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.backend.data.Plant;

public interface PlantRepository extends JpaRepository<Plant, Long> {
	
    
}
