package com.plants.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.data.PlantTask;


public interface PlantTaskRepository extends JpaRepository<PlantTask, Long> {
	
    
}
