package com.plants.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.plants.backend.data.Plant;
import com.plants.backend.data.PlantTask;
import com.plants.backend.data.Task;
import com.plants.backend.repository.PlantRepository;
import com.plants.backend.repository.PlantTaskRepository;
import com.plants.backend.repository.TaskRepository;

@Service
public class PlantTaskService {

    private final PlantTaskRepository plantTaskRepository;
    private final TaskRepository taskRepository;
    private final PlantRepository plantRepository;


    public PlantTaskService(PlantTaskRepository plantTaskRepository, TaskRepository taskRepository, PlantRepository plantRepository) {
        this.plantTaskRepository = plantTaskRepository;
        this.taskRepository = taskRepository;
        this.plantRepository = plantRepository;
    }

    public List<PlantTask> findAll() {
    	return plantTaskRepository.findAll();
    }
   
    
    public PlantTask save(PlantTask plantTask) {
    	return plantTaskRepository.save(plantTask);
    }
    
    public Optional<PlantTask> findPlantTaskById (Long id) {
    	return plantTaskRepository.findById(id);
    }
    
    public Optional<Task> findTaskForPlantTask (Long id) {
    	Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task with ID " + id + " not found"));
    	return Optional.ofNullable(task);
    }
    
    // same for plant
    public Optional<Plant> findPlantForPlantTask (Long id){
    	// get Task first, then get the plant
    	Plant plant = plantRepository.findById(id).orElseThrow(() -> new RuntimeException("Task with ID " + id + " not found"));
    	return Optional.ofNullable(plant);
    	
    }

    public void deletePlantTaskById(Long id) {
    	plantTaskRepository.deleteById(id);
    }

   
    
   

	
}
