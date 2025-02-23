package com.plants.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.backend.data.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
	
    
}
