package com.plants.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.plants.data.Task;
import com.plants.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;


    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> findAll() {
    	return taskRepository.findAll();
    }
   
    
    public Task save(Task task) {
    	return taskRepository.save(task);
    }
    
    public Optional<Task> findTaskById (Long id) {
    	return taskRepository.findById(id);
    }

    public void deleteTaskById(Long id) {
    	taskRepository.deleteById(id);
    }

   
    
   

	
}
