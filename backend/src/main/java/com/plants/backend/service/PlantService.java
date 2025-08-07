package com.plants.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.plants.backend.data.DTOMapper;
import com.plants.backend.data.Plant;
import com.plants.backend.data.PlantDTO;
import com.plants.backend.repository.PlantRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PlantService {

    private final PlantRepository plantRepository;


    public PlantService(PlantRepository plantRepository) {
        this.plantRepository = plantRepository;
    }

    public List<PlantDTO> findAll() {
		/* return plantRepository.findAll(); */
    	return plantRepository.findAll().stream()
                .map(DTOMapper::toPlantDTO)
                .collect(Collectors.toList());
    }
   
    
    public Plant save(Plant plant) {
    	return plantRepository.save(plant);
    }
    
    public Optional<Plant> findPlantById (Long id) {
    	return plantRepository.findById(id);
    }

    public void deletePlantById(Long id) {
        Plant plant = plantRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Plant not found"));

        // Remove plant from other plants' companion lists
        List<Plant> allPlants = plantRepository.findAll();
        for (Plant p : allPlants) {
            p.getCompanionPlants().removeIf(companion -> companion.getId().equals(id));
        }
        plantRepository.saveAll(allPlants);

        // Clear its own companion list
        plant.getCompanionPlants().clear();
        plantRepository.save(plant);

        plantRepository.delete(plant);
    }


    public List<Plant> findPlantsByIds(List<Long> plantIds) {
        return plantRepository.findAllById(plantIds); 
    }

   
    
   

	
}
