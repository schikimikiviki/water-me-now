package com.plants.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.plants.backend.data.Plant;
import com.plants.backend.repository.PlantRepository;

@Service
public class PlantService {

    private final PlantRepository plantRepository;


    public PlantService(PlantRepository plantRepository) {
        this.plantRepository = plantRepository;
    }

    public List<Plant> findAll() {
    	return plantRepository.findAll();
    }
   
    
    public Plant save(Plant plant) {
    	return plantRepository.save(plant);
    }
    
    public Optional<Plant> findPlantById (Long id) {
    	return plantRepository.findById(id);
    }

    public void deletePlantById(Long id) {
    	plantRepository.deleteById(id);
    }

   
    
   

	
}
