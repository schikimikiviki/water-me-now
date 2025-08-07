package com.plants.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.plants.backend.data.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

	List<Task> findByDate(LocalDate today);
	
    
}
