package com.plants.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.plants.backend.data.PlantTask;
import com.plants.backend.repository.PlantTaskRepository;

@Service
public class PlantTaskService {

    private final PlantTaskRepository plantTaskRepository;


    public PlantTaskService(PlantTaskRepository plantTaskRepository) {
        this.plantTaskRepository = plantTaskRepository;
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

    public void deletePlantTaskById(Long id) {
    	plantTaskRepository.deleteById(id);
    }

   
    
   

	
}
