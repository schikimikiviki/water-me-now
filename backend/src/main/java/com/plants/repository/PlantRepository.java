package com.plants.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.data.Plant;

public interface PlantRepository extends JpaRepository<Plant, Long> {
	
    
}
