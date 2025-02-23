package com.plants.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.backend.data.PlantTask;


public interface PlantTaskRepository extends JpaRepository<PlantTask, Long> {
	
    
}
