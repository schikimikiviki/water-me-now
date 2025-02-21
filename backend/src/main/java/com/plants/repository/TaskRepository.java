package com.plants.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.data.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
	
    
}
