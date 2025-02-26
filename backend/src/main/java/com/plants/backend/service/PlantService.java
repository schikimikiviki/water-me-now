package com.plants.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.plants.backend.data.DTOMapper;
import com.plants.backend.data.Plant;
import com.plants.backend.data.PlantDTO;
import com.plants.backend.repository.PlantRepository;

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
    	plantRepository.deleteById(id);
    }

    public List<Plant> findPlantsByIds(List<Long> plantIds) {
        return plantRepository.findAllById(plantIds); 
    }

   
    
   

	
}
